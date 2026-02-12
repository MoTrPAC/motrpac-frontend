/**
 * fetch-docs.js
 *
 * Build script that fetches markdown documentation from a private GitHub repo
 * and generates a static JSON file for the Knowledge Center.
 *
 * Usage: node scripts/fetch-docs.js
 *
 * Required .env variables:
 *   GITHUB_PAT - Fine-grained personal access token with contents:read scope
 *   GITHUB_REPO_OWNER - Repository owner (e.g., "MoTrPAC")
 *   GITHUB_REPO_NAME - Repository name
 *
 * Optional .env variables:
 *   GITHUB_DOCS_BRANCH - Branch to fetch from (default: "main")
 *   GITHUB_DOCS_PATH - Root path for docs in repo (default: "docs")
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const {
  GITHUB_PAT,
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME,
  GITHUB_DOCS_BRANCH = "main",
  GITHUB_DOCS_PATH = "docs",
} = process.env;

if (!GITHUB_PAT || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
  console.error(
    "Missing required env vars: GITHUB_PAT, GITHUB_REPO_OWNER, GITHUB_REPO_NAME"
  );
  process.exit(1);
}

const API_BASE = "https://api.github.com";
const REPO_SLUG = `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;
const HEADERS = {
  Authorization: `Bearer ${GITHUB_PAT}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

// Folders to exclude from processing
const EXCLUDED_DIRS = new Set(["assets"]);

const OUTPUT_PATH = join(__dirname, "..", "src", "data", "knowledge-base.json");

// Max retries for transient GitHub API failures
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Concurrency limit for parallel blob fetches
const CONCURRENCY = 10;

// ---------------------------------------------------------------------------
// GitHub API helpers
// ---------------------------------------------------------------------------

/**
 * Fetch a GitHub API URL with automatic retry and rate-limit handling.
 */
async function apiFetch(url, retries = MAX_RETRIES) {
  const res = await fetch(url, { headers: HEADERS });

  // Handle rate limiting with retry-after
  if (res.status === 403 || res.status === 429) {
    const retryAfter = res.headers.get("retry-after");
    const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RETRY_DELAY_MS * 2;
    if (retries > 0) {
      console.warn(`Rate limited. Retrying in ${waitMs}ms... (${retries} retries left)`);
      await sleep(waitMs);
      return apiFetch(url, retries - 1);
    }
  }

  // Retry on transient server errors
  if (res.status >= 500 && retries > 0) {
    console.warn(`Server error ${res.status}. Retrying in ${RETRY_DELAY_MS}ms...`);
    await sleep(RETRY_DELAY_MS);
    return apiFetch(url, retries - 1);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }

  return res.json();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch the full recursive tree for the docs path.
 * Returns an array of { path, sha, type, relativePath } objects.
 */
async function fetchTree() {
  const branch = await apiFetch(
    `${API_BASE}/repos/${REPO_SLUG}/branches/${GITHUB_DOCS_BRANCH}`
  );

  const treeSha = branch.commit.commit.tree.sha;

  const tree = await apiFetch(
    `${API_BASE}/repos/${REPO_SLUG}/git/trees/${treeSha}?recursive=1`
  );

  if (tree.truncated) {
    console.warn(
      "Warning: GitHub tree response was truncated. Some files may be missing."
    );
  }

  const docsPrefix = `${GITHUB_DOCS_PATH}/`;

  return tree.tree
    .filter((item) => item.path.startsWith(docsPrefix))
    .map((item) => ({
      ...item,
      relativePath: item.path.slice(docsPrefix.length),
    }));
}

/**
 * Fetch a single file's content by its blob SHA.
 * Returns decoded UTF-8 string.
 */
async function fetchFileContent(sha) {
  const blob = await apiFetch(
    `${API_BASE}/repos/${REPO_SLUG}/git/blobs/${sha}`
  );

  return Buffer.from(blob.content, "base64").toString("utf-8");
}

// ---------------------------------------------------------------------------
// Manifest handling
// ---------------------------------------------------------------------------

/**
 * Attempt to fetch docs-manifest.json from the repo root.
 * Returns parsed manifest or null if not found.
 */
async function fetchManifest() {
  try {
    const data = await apiFetch(
      `${API_BASE}/repos/${REPO_SLUG}/contents/docs-manifest.json?ref=${GITHUB_DOCS_BRANCH}`
    );

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(content);
  } catch {
    console.warn("No docs-manifest.json found, using fallback metadata.");
    return null;
  }
}

// ---------------------------------------------------------------------------
// Markdown processing helpers
// ---------------------------------------------------------------------------

/**
 * Extract YAML frontmatter (---...---) from markdown content.
 * Returns { frontmatter, body }. Supports title, order, tags.
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { frontmatter: null, body: content };

  const raw = match[1];
  const body = content.slice(match[0].length);
  const frontmatter = {};

  for (const line of raw.split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.+)$/);
    if (!kv) continue;

    const [, key, val] = kv;
    const trimmed = val.trim();

    if (key === "order") {
      const num = Number(trimmed);
      if (!Number.isNaN(num)) frontmatter.order = num;
    } else if (key === "tags") {
      // Handle ["a", "b"], [a, b], and "a, b" formats
      const raw = trimmed.replace(/^\[|\]$/g, "");
      frontmatter.tags = raw.split(",").map((t) => t.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else {
      // Strip surrounding quotes
      frontmatter[key] = trimmed.replace(/^["']|["']$/g, "");
    }
  }

  return { frontmatter, body };
}

/**
 * Strip HTML tags from markdown, preserving content inside fenced code blocks.
 * Removes tags like <div>, <p>, <span> etc. while keeping their inner text.
 * Self-closing tags (e.g., <br/>, <hr/>) are removed entirely.
 */
function stripHtmlTags(content) {
  // Split on fenced code blocks to avoid stripping inside them
  const parts = content.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  return parts
    .map((part, i) => {
      // Odd indices are code blocks — leave untouched
      if (i % 2 === 1) return part;
      // Remove paired tags, keep inner content: <tag ...>content</tag> → content
      let cleaned = part.replace(/<\/?[a-zA-Z][a-zA-Z0-9]*\b[^>]*>/g, "");
      return cleaned;
    })
    .join("");
}

/**
 * Transform internal markdown links to Knowledge Center routes.
 * Converts links like [text](./other-doc.md) or [text](../category/doc.md)
 * to [text](/knowledge-center/category/slug) based on the file's own path.
 */
function transformInternalLinks(content, relativePath) {
  // Match markdown links: [text](url)
  return content.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (match, text, url) => {
      // Skip external links, anchors, and absolute paths
      if (/^(https?:|mailto:|#|\/)/.test(url)) return match;
      // Only transform .md links
      if (!url.replace(/#.*$/, "").endsWith(".md")) return match;

      // Split off any anchor fragment
      const [filePart, anchor] = url.split("#", 2);

      // Resolve relative path against the current file's directory
      const fileDir = relativePath.includes("/")
        ? relativePath.replace(/\/[^/]+$/, "")
        : "";
      const resolved = resolveRelativePath(fileDir, filePart);

      // Convert resolved docs path to a route
      const route = docsPathToRoute(resolved);
      const suffix = anchor ? `#${anchor}` : "";
      return `[${text}](${route}${suffix})`;
    }
  );
}

/** Resolve a relative file path against a base directory. */
function resolveRelativePath(base, relative) {
  // Start from the base directory segments
  const parts = base ? base.split("/") : [];
  for (const seg of relative.split("/")) {
    if (seg === ".." && parts.length > 0) parts.pop();
    else if (seg !== "." && seg !== "") parts.push(seg);
  }
  return parts.join("/");
}

/**
 * Convert a docs-relative file path to a Knowledge Center route.
 * e.g., "data-access/getting-started.md" → "/knowledge-center/data-access/getting-started"
 *       "data-access/animal-study/overview.md" → "/knowledge-center/data-access/animal-study/overview"
 *       "data-access/index.md" → "/knowledge-center/data-access"
 */
function docsPathToRoute(filePath) {
  const withoutExt = filePath.replace(/\.md$/, "");
  const parts = withoutExt.split("/");
  // Drop trailing "index" — it maps to the parent route
  if (parts[parts.length - 1] === "index") parts.pop();
  return `/knowledge-center${parts.length ? "/" + parts.join("/") : ""}`;
}

/** Fix branded acronyms that get mangled by slug-to-title conversion. */
function fixBrandNames(text) {
  return text
    .replace(/\bmotrpac\b/gi, "MoTrPAC")
    .replace(/\bcfde\b/gi, "CFDE");
}

/** Clean up markdown: strip comments, HTML tags, fix whitespace, fix brands. */
function normalizeContent(content, relativePath) {
  let result = content.replace(/<!--[\s\S]*?-->/g, "");
  result = stripHtmlTags(result);
  result = transformInternalLinks(result, relativePath);
  result = fixBrandNames(result);
  // Trim trailing whitespace per line
  result = result.replace(/[^\S\r\n]+$/gm, "");
  // Collapse excessive blank lines (3+ → 2)
  result = result.replace(/(\r?\n){3,}/g, "\n\n");
  return result.trim();
}

// ---------------------------------------------------------------------------
// Path & slug helpers
// ---------------------------------------------------------------------------

/**
 * Convert a filename or folder name to a human-readable title.
 * e.g., "mcp-server" → "MCP Server", "analysis-results" → "Analysis Results"
 */
function slugToTitle(slug) {
  return fixBrandNames(
    slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/**
 * Determine if a path falls under an excluded top-level directory.
 */
function isExcluded(relativePath) {
  const topDir = relativePath.split("/")[0];
  return EXCLUDED_DIRS.has(topDir);
}

/**
 * Parse the relative path of a markdown file to extract
 * category, subcategory, slug, and whether it's an index file.
 *
 * Examples:
 *   "data-analysis/analysis-results.md"
 *     → { category: "data-analysis", subcategory: null, slug: "analysis-results", isIndex: false }
 *
 *   "data-injection/guidelines/some-doc.md"
 *     → { category: "data-injection", subcategory: "guidelines", slug: "some-doc", isIndex: false }
 *
 *   "data-injection/index.md"
 *     → { category: "data-injection", subcategory: null, slug: null, isIndex: true }
 *
 *   "index.md"
 *     → { category: null, subcategory: null, slug: null, isIndex: true }
 */
function parseDocPath(relativePath) {
  const parts = relativePath.replace(/\.md$/, "").split("/");
  const file = parts[parts.length - 1];
  const isIndex = file === "index";

  switch (parts.length) {
    case 1:
      return {
        category: null,
        subcategory: null,
        slug: isIndex ? null : parts[0],
        isIndex,
      };

    case 2:
      return {
        category: parts[0],
        subcategory: null,
        slug: isIndex ? null : file,
        isIndex,
      };

    // 3 or deeper: category = parts[0], subcategory = parts[1], slug = filename
    default:
      return {
        category: parts[0],
        subcategory: parts[1],
        slug: isIndex ? null : file,
        isIndex,
      };
  }
}

// ---------------------------------------------------------------------------
// Output builder
// ---------------------------------------------------------------------------

/** Get or create a category entry in the map. */
function ensureCategory(categoriesMap, slug, manifestCategories) {
  if (!categoriesMap.has(slug)) {
    const manifestCat = manifestCategories.get(slug);
    categoriesMap.set(slug, {
      slug,
      label: fixBrandNames(manifestCat?.label || slugToTitle(slug)),
      order: manifestCat?.order ?? 999,
      indexContent: null,
      subcategories: [],
    });
  }
  return categoriesMap.get(slug);
}

/** Get or create a subcategory entry within a category. */
function ensureSubcategory(category, slug, manifestSubcategories) {
  let sub = category.subcategories.find((s) => s.slug === slug);
  if (!sub) {
    const manifestSub = manifestSubcategories?.get(slug);
    sub = {
      slug,
      label: fixBrandNames(manifestSub?.label || slugToTitle(slug)),
      order: manifestSub?.order ?? 999,
    };
    category.subcategories.push(sub);
  }
  return sub;
}

/**
 * Build the structured JSON output from raw file data and manifest.
 */
function buildOutput(files, manifest) {
  const categoriesMap = new Map();
  const documents = [];
  let rootIndexContent = null;

  // Pre-index manifest metadata
  const manifestCategories = new Map();
  const manifestSubcategories = new Map();
  if (manifest?.categories) {
    for (const cat of manifest.categories) {
      manifestCategories.set(cat.slug, cat);
      // Index subcategories from manifest if provided
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          manifestSubcategories.set(sub.slug, sub);
        }
      }
    }
  }
  const manifestDocs = manifest?.documents || {};

  // First pass: discover categories & subcategories from directory entries
  for (const file of files) {
    if (file.type !== "tree") continue;
    if (isExcluded(file.relativePath)) continue;

    const parts = file.relativePath.split("/");
    const cat = ensureCategory(categoriesMap, parts[0], manifestCategories);
    if (parts.length >= 2) {
      ensureSubcategory(cat, parts[1], manifestSubcategories);
    }
  }

  // Second pass: process markdown files
  for (const file of files) {
    if (file.type !== "blob") continue;
    if (!file.relativePath.endsWith(".md")) continue;
    if (isExcluded(file.relativePath)) continue;

    const { category, subcategory, slug, isIndex } = parseDocPath(
      file.relativePath
    );

    // Extract frontmatter then normalize content
    const { frontmatter, body } = extractFrontmatter(file.content);
    const cleanContent = normalizeContent(body, file.relativePath);

    // Handle index files — attach content to category/subcategory
    if (isIndex) {
      if (!category) {
        rootIndexContent = cleanContent;
      } else {
        const cat = categoriesMap.get(category);
        if (cat) {
          if (subcategory) {
            const sub = cat.subcategories.find((s) => s.slug === subcategory);
            if (sub) sub.indexContent = cleanContent;
          } else {
            cat.indexContent = cleanContent;
          }
        } else {
          console.warn(
            `Warning: index.md references unknown category "${category}" (${file.relativePath})`
          );
        }
      }
      continue;
    }

    // Skip root-level docs without a category — all docs should be in a folder
    if (!category) {
      console.warn(
        `Warning: skipping root-level doc "${file.relativePath}" (no category folder)`
      );
      continue;
    }

    // Build manifest lookup key for this document
    const manifestKey = subcategory
      ? `${category}/${subcategory}/${slug}.md`
      : `${category}/${slug}.md`;

    const manifestMeta = manifestDocs[manifestKey] || {};

    // Merge metadata: frontmatter > manifest > defaults
    const title = fixBrandNames(
      frontmatter?.title || manifestMeta.title || slugToTitle(slug)
    );

    documents.push({
      slug,
      title,
      category,
      subcategory,
      order: frontmatter?.order ?? manifestMeta.order ?? 999,
      tags: frontmatter?.tags || manifestMeta.tags || [],
      content: cleanContent,
    });
  }

  // Sort categories and subcategories by order
  const categories = Array.from(categoriesMap.values())
    .sort((a, b) => a.order - b.order)
    .map((cat) => ({
      ...cat,
      subcategories: cat.subcategories.sort((a, b) => a.order - b.order),
    }));

  // Sort documents: by category order → subcategory order → doc order
  const catOrderMap = new Map(categories.map((c, i) => [c.slug, i]));
  const subOrderMap = new Map();
  for (const cat of categories) {
    for (let i = 0; i < cat.subcategories.length; i++) {
      subOrderMap.set(`${cat.slug}/${cat.subcategories[i].slug}`, i);
    }
  }

  documents.sort((a, b) => {
    const catA = catOrderMap.get(a.category) ?? 999;
    const catB = catOrderMap.get(b.category) ?? 999;
    if (catA !== catB) return catA - catB;

    const subA = a.subcategory
      ? (subOrderMap.get(`${a.category}/${a.subcategory}`) ?? 999)
      : -1;
    const subB = b.subcategory
      ? (subOrderMap.get(`${b.category}/${b.subcategory}`) ?? 999)
      : -1;
    if (subA !== subB) return subA - subB;

    return a.order - b.order;
  });

  return {
    lastFetched: new Date().toISOString(),
    rootIndexContent,
    categories,
    documents,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const startTime = Date.now();

  console.log(
    `Fetching docs from ${REPO_SLUG} (${GITHUB_DOCS_BRANCH})...`
  );

  // Fetch tree and manifest in parallel
  const [treeItems, manifest] = await Promise.all([
    fetchTree(),
    fetchManifest(),
  ]);

  const mdFiles = treeItems.filter(
    (item) =>
      item.type === "blob" &&
      item.relativePath.endsWith(".md") &&
      !isExcluded(item.relativePath)
  );

  console.log(`Found ${mdFiles.length} markdown files. Fetching content...`);

  // Fetch all file contents in parallel with concurrency limit
  for (let i = 0; i < mdFiles.length; i += CONCURRENCY) {
    const batch = mdFiles.slice(i, i + CONCURRENCY);
    const contents = await Promise.all(
      batch.map((file) => fetchFileContent(file.sha))
    );
    batch.forEach((file, idx) => {
      file.content = contents[idx];
    });
  }

  // Combine directory entries + fetched markdown files for output builder
  const allItems = [
    ...treeItems.filter((item) => item.type === "tree"),
    ...mdFiles,
  ];

  const output = buildOutput(allItems, manifest);

  // Ensure output directory exists and write
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Knowledge base written to ${OUTPUT_PATH}`);
  console.log(
    `  ${output.categories.length} categories, ${output.documents.length} documents (${elapsed}s)`
  );
}

main().catch((err) => {
  console.error("Failed to fetch docs:", err);
  process.exit(1);
});
