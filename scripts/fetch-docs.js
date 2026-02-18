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

import { writeFileSync, mkdirSync, existsSync, lstatSync } from "fs";
import { basename, dirname, relative, resolve } from "path";
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

const PROJECT_ROOT = resolve(__dirname, "..");
const OUTPUT_DIR = resolve(PROJECT_ROOT, "src", "data");
const OUTPUT_FILENAME = "knowledge-base.json";
const OUTPUT_PATH = resolve(OUTPUT_DIR, OUTPUT_FILENAME);

// Max retries for transient GitHub API failures
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Concurrency limit for parallel blob fetches
const CONCURRENCY = 10;

function assertSafeOutputPath(outputPath) {
  const resolved = resolve(outputPath);

  // Ensure writes are constrained to the intended fixed location.
  if (basename(resolved) !== OUTPUT_FILENAME) {
    throw new Error(`Unsafe output filename: ${resolved}`);
  }

  const rel = relative(OUTPUT_DIR, resolved);
  if (rel.startsWith("..") || rel.startsWith("/") || rel === "") {
    throw new Error(`Unsafe output path outside allowed directory: ${resolved}`);
  }

  // Prevent writing through symbolic links.
  if (existsSync(resolved) && lstatSync(resolved).isSymbolicLink()) {
    throw new Error(`Refusing to write to symlinked output path: ${resolved}`);
  }

  return resolved;
}

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
  return new Promise((done) => setTimeout(done, ms));
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

/**
 * Fetch mkdocs.yml from the docs repo root.
 * Returns raw YAML string or null if not found.
 */
async function fetchMkdocsYaml() {
  try {
    const data = await apiFetch(
      `${API_BASE}/repos/${REPO_SLUG}/contents/mkdocs.yml?ref=${GITHUB_DOCS_BRANCH}`
    );

    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    console.warn("No mkdocs.yml found, falling back to path-based organization.");
    return null;
  }
}

/**
 * Parse mkdocs nav block into a simple tree structure.
 * Supports the nav style used in this repository:
 * - Label: path.md
 * - Label:
 *     - Child: child.md
 */
function parseMkdocsNav(yaml) {
  const lines = yaml.replace(/\r\n/g, "\n").split("\n");
  const navStart = lines.findIndex((line) => line.trim() === "nav:");
  if (navStart === -1) return [];

  const navLines = [];
  for (let i = navStart + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Stop at next top-level key
    if (/^[A-Za-z0-9_-]+:\s*$/.test(line) && !line.startsWith(" ")) break;
    if (line.trimStart().startsWith("#")) continue;
    if (!line.trimStart().startsWith("- ")) continue;

    navLines.push(line);
  }

  let idx = 0;

  function lineIndent(line) {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  function parseList(expectedIndent) {
    const items = [];

    while (idx < navLines.length) {
      const line = navLines[idx];
      const indent = lineIndent(line);
      if (indent < expectedIndent) break;
      if (indent > expectedIndent) {
        idx += 1;
        continue;
      }

      const raw = line.trim().replace(/^-\s+/, "");
      const colonPos = raw.indexOf(":");
      if (colonPos === -1) {
        idx += 1;
        continue;
      }

      const label = raw.slice(0, colonPos).trim();
      const value = raw.slice(colonPos + 1).trim();
      idx += 1;

      if (value) {
        items.push({ label, path: value });
      } else {
        const children = parseList(expectedIndent + 4);
        items.push({ label, children });
      }
    }

    return items;
  }

  return parseList(2);
}

function slugifyLabel(label) {
  return label
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDocsRelativePath(path) {
  return path.replace(/^\.\//, "").replace(/^\/+/, "");
}

/**
 * Convert parsed mkdocs nav to lookup maps used by output generation and
 * internal-link routing.
 */
function buildNavStructure(navTree) {
  const categories = [];
  const categoriesMap = new Map();
  const docsByPath = new Map();
  const routeByPath = new Map();
  let homePath = "index.md";

  function ensureCategory(slug, label, order) {
    if (!categoriesMap.has(slug)) {
      const cat = {
        slug,
        label: fixBrandNames(label),
        order,
        indexPath: null,
        subcategories: [],
      };
      categoriesMap.set(slug, cat);
      categories.push(cat);
    }
    return categoriesMap.get(slug);
  }

  function ensureSubcategory(category, slug, label, order) {
    let sub = category.subcategories.find((s) => s.slug === slug);
    if (!sub) {
      sub = { slug, label: fixBrandNames(label), order, indexPath: null };
      category.subcategories.push(sub);
    }
    return sub;
  }

  function registerLeaf({
    path,
    title,
    category,
    subcategory,
    docOrder,
  }) {
    const relativePath = toDocsRelativePath(path);
    const withoutExt = relativePath.replace(/\.md$/, "");
    const parts = withoutExt.split("/");
    const file = parts[parts.length - 1];
    const isIndex = file === "index";

    let route = "/knowledge-center";
    if (category) {
      route = `/knowledge-center/${category}`;
      if (subcategory) route += `/${subcategory}`;
      if (!isIndex) route += `/${file}`;
    }
    routeByPath.set(relativePath, route);

    if (!category) {
      if (relativePath.endsWith("index.md")) homePath = relativePath;
      return;
    }

    if (isIndex) return;

    docsByPath.set(relativePath, {
      title: fixBrandNames(title),
      category,
      subcategory,
      order: docOrder,
      slug: file,
    });
  }

  let categoryOrder = 0;
  let docOrder = 0;

  for (const topItem of navTree) {
    if (topItem.path) {
      registerLeaf({
        path: topItem.path,
        title: topItem.label,
        category: null,
        subcategory: null,
        docOrder: docOrder++,
      });
      continue;
    }

    if (!topItem.children || topItem.children.length === 0) continue;

    const firstLeaf = topItem.children.find((child) => child.path);
    const firstPath = toDocsRelativePath(firstLeaf?.path || "");
    const firstSegment = firstPath.split("/")[0] || slugifyLabel(topItem.label);
    const categorySlug = firstSegment;
    const category = ensureCategory(categorySlug, topItem.label, categoryOrder++);

    let subcategoryOrder = 0;

    for (const child of topItem.children) {
      if (child.path) {
        const relativePath = toDocsRelativePath(child.path);
        if (relativePath === `${categorySlug}/index.md`) {
          category.indexPath = relativePath;
        }

        registerLeaf({
          path: child.path,
          title: child.label,
          category: categorySlug,
          subcategory: null,
          docOrder: docOrder++,
        });
        continue;
      }

      if (!child.children || child.children.length === 0) continue;

      const subSlug = slugifyLabel(child.label);
      const subcategory = ensureSubcategory(
        category,
        subSlug,
        child.label,
        subcategoryOrder++
      );

      for (const grandChild of child.children) {
        if (!grandChild.path) continue;

        const relativePath = toDocsRelativePath(grandChild.path);
        const isSubIndex =
          relativePath.endsWith("/index.md") &&
          relativePath.split("/")[0] === categorySlug;

        if (isSubIndex && grandChild.label.toLowerCase() === "overview") {
          subcategory.indexPath = relativePath;
        }

        registerLeaf({
          path: grandChild.path,
          title: grandChild.label,
          category: categorySlug,
          subcategory: subSlug,
          docOrder: docOrder++,
        });
      }
    }
  }

  return {
    homePath,
    categories,
    docsByPath,
    routeByPath,
  };
}

/**
 * Fallback structure when mkdocs.yml nav is unavailable.
 * Uses directory-based grouping to preserve backward compatibility.
 */
function buildFallbackNavStructure(files) {
  const categories = [];
  const categoriesMap = new Map();
  const docsByPath = new Map();
  const routeByPath = new Map();
  let homePath = "index.md";
  let docOrder = 0;

  function ensureCategory(slug) {
    if (!categoriesMap.has(slug)) {
      const category = {
        slug,
        label: slugToTitle(slug),
        order: categories.length,
        indexPath: null,
        subcategories: [],
      };
      categoriesMap.set(slug, category);
      categories.push(category);
    }
    return categoriesMap.get(slug);
  }

  function ensureSubcategory(category, slug) {
    let sub = category.subcategories.find((s) => s.slug === slug);
    if (!sub) {
      sub = {
        slug,
        label: slugToTitle(slug),
        order: category.subcategories.length,
        indexPath: null,
      };
      category.subcategories.push(sub);
    }
    return sub;
  }

  for (const file of files) {
    if (file.type !== "blob") continue;
    if (!file.relativePath.endsWith(".md")) continue;
    if (isExcluded(file.relativePath)) continue;

    routeByPath.set(file.relativePath, docsPathToRoute(file.relativePath));

    const { category, subcategory, slug, isIndex } = parseDocPath(file.relativePath);
    if (!category) {
      if (isIndex) homePath = file.relativePath;
      continue;
    }

    const cat = ensureCategory(category);
    if (isIndex) {
      if (subcategory) {
        const sub = ensureSubcategory(cat, subcategory);
        sub.indexPath = file.relativePath;
      } else {
        cat.indexPath = file.relativePath;
      }
      continue;
    }

    if (subcategory) ensureSubcategory(cat, subcategory);

    docsByPath.set(file.relativePath, {
      title: slugToTitle(slug),
      category,
      subcategory,
      order: docOrder++,
      slug,
    });
  }

  return {
    homePath,
    categories,
    docsByPath,
    routeByPath,
  };
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
 * Anchor tags (<a href="...">) are converted to markdown links rather than
 * removed so that link destinations are retained.
 * Other tags like <div>, <p>, <span> etc. are removed while keeping their
 * inner text. Self-closing tags (e.g., <br/>, <hr/>) are removed entirely.
 */
function stripHtmlTags(content) {
  // Split on fenced code blocks to avoid stripping inside them
  const parts = content.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  return parts
    .map((part, i) => {
      // Odd indices are code blocks — leave untouched
      if (i % 2 === 1) return part;

      // Convert <a href="url">text</a> to [text](url)
      let cleaned = part.replace(
        /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
        (_, href, text) => `[${text.trim()}](${href})`
      );

      // Convert anchor targets <a id="xxx">text</a> / <a name="xxx">text</a>
      // to inline anchor spans that markdown renderers can use as jump targets:
      // <span id="xxx">text</span>
      cleaned = cleaned.replace(
        /<a\s+(?:[^>]*?\s)?(?:id|name)=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
        (_, id, text) => `<span id="${id}">${text.trim()}</span>`
      );

      // Remove all remaining HTML tags except <span id="..."> anchors
      cleaned = cleaned.replace(
        /<\/?[a-zA-Z][a-zA-Z0-9]*\b[^>]*>/g,
        (tag) => (/^<span\s+id=["'][^"']*["']\s*>$/i.test(tag) || tag === "</span>" ? tag : "")
      );

      // As a final safety measure, strip any remaining angle brackets so no stray
      // HTML-like tags (e.g., "<script") can survive outside of code blocks.
      cleaned = cleaned.replace(/[<>]/g, "");

      return cleaned;
    })
    .join("");
}

/**
 * Transform internal markdown links to Knowledge Center routes.
 * Converts links like [text](./other-doc.md) or [text](../category/doc.md)
 * to [text](/knowledge-center/category/slug) based on the file's own path.
 */
function transformInternalLinks(content, relativePath, routeByPath = null) {
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
      const normalizedResolved = toDocsRelativePath(resolved);
      const route = routeByPath?.get(normalizedResolved) || docsPathToRoute(resolved);
      const suffix = anchor ? `#${anchor}` : "";
      return `[${text}](${route}${suffix})`;
    }
  );
}

/** Resolve a relative file path against a base directory. */
function resolveRelativePath(base, relativePath) {
  // Start from the base directory segments
  const parts = base ? base.split("/") : [];
  for (const seg of relativePath.split("/")) {
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

/**
 * Remove all HTML comments, guarding against incomplete multi-character
 * sanitization by applying the replacement until no more matches exist.
 */
function removeHtmlComments(input) {
  let previous;
  let current = input;
  do {
    previous = current;
    current = current.replace(/<!--[\s\S]*?-->/g, "");
  } while (current !== previous);
  return current;
}

/**
 * Fix brand casing in plain text while preserving original casing in
 * markdown links, URLs, and email addresses.
 */
function fixBrandNamesInPlainTextOnly(text) {
  const protectedTokens = [];
  const patterns = [
    /!?\[[^\]]*\]\([^)]*\)/g,                          // markdown links/images
    /<https?:\/\/[^>]+>/gi,                                // autolink URLs
    /<mailto:[^>]+>/gi,                                     // autolink mailto
    /\bhttps?:\/\/[^\s)]+/gi,                              // bare URLs
    /\bwww\.[^\s)]+/gi,                                    // bare www URLs
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,         // email addresses
  ];

  let masked = text;
  for (const pattern of patterns) {
    masked = masked.replace(pattern, (match) => {
      const token = `__KB_PROTECTED_${protectedTokens.length}__`;
      protectedTokens.push(match);
      return token;
    });
  }

  masked = fixBrandNames(masked);

  return masked.replace(/__KB_PROTECTED_(\d+)__/g, (_, idx) => {
    const tokenIndex = Number(idx);
    return protectedTokens[tokenIndex] || "";
  });
}

/** Clean up markdown: strip comments, HTML tags, fix whitespace, fix brands. */
function normalizeContent(content, relativePath, routeByPath = null) {
  let result = removeHtmlComments(content);
  result = stripHtmlTags(result);
  result = transformInternalLinks(result, relativePath, routeByPath);
  result = fixBrandNamesInPlainTextOnly(result);
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

/**
 * Build the structured JSON output from raw file data and manifest.
 */
function buildOutput(files, manifest, navStructure) {
  const documents = [];
  let rootIndexContent = null;

  const manifestDocs = manifest?.documents || {};

  const categoriesMap = new Map(
    navStructure.categories.map((cat) => [
      cat.slug,
      {
        slug: cat.slug,
        label: fixBrandNames(cat.label),
        order: cat.order,
        indexContent: null,
        subcategories: cat.subcategories.map((sub) => ({
          slug: sub.slug,
          label: fixBrandNames(sub.label),
          order: sub.order,
          indexContent: null,
        })),
      },
    ])
  );

  // Process markdown files based on mkdocs nav mapping
  for (const file of files) {
    if (file.type !== "blob") continue;
    if (!file.relativePath.endsWith(".md")) continue;
    if (isExcluded(file.relativePath)) continue;

    const { frontmatter, body } = extractFrontmatter(file.content);
    const cleanContent = normalizeContent(
      body,
      file.relativePath,
      navStructure.routeByPath
    );

    // Root landing page from mkdocs Home entry (index.md)
    if (file.relativePath === navStructure.homePath) {
      rootIndexContent = cleanContent;
      continue;
    }

    // Category/subcategory index content from nav-defined overview paths
    let handledAsIndex = false;
    for (const cat of navStructure.categories) {
      if (cat.indexPath && file.relativePath === cat.indexPath) {
        const outCat = categoriesMap.get(cat.slug);
        if (outCat) outCat.indexContent = cleanContent;
        handledAsIndex = true;
        break;
      }

      for (const sub of cat.subcategories) {
        if (sub.indexPath && file.relativePath === sub.indexPath) {
          const outCat = categoriesMap.get(cat.slug);
          const outSub = outCat?.subcategories.find((s) => s.slug === sub.slug);
          if (outSub) outSub.indexContent = cleanContent;
          handledAsIndex = true;
          break;
        }
      }
      if (handledAsIndex) break;
    }
    if (handledAsIndex) continue;

    const navDoc = navStructure.docsByPath.get(file.relativePath);
    if (!navDoc) {
      console.warn(
        `Warning: skipping doc not present in mkdocs nav: ${file.relativePath}`
      );
      continue;
    }

    const manifestMeta = manifestDocs[file.relativePath] || {};
    const title = fixBrandNames(
      frontmatter?.title || manifestMeta.title || navDoc.title || slugToTitle(navDoc.slug)
    );

    documents.push({
      slug: navDoc.slug,
      title,
      category: navDoc.category,
      subcategory: navDoc.subcategory,
      order: frontmatter?.order ?? manifestMeta.order ?? navDoc.order,
      tags: frontmatter?.tags || manifestMeta.tags || [],
      content: cleanContent,
    });
  }

  const categories = Array.from(categoriesMap.values())
    .sort((a, b) => a.order - b.order)
    .map((cat) => ({
      ...cat,
      subcategories: cat.subcategories.sort((a, b) => a.order - b.order),
    }));

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

  // Fetch tree, manifest, and mkdocs nav in parallel
  const [treeItems, manifest, mkdocsYaml] = await Promise.all([
    fetchTree(),
    fetchManifest(),
    fetchMkdocsYaml(),
  ]);

  const navTree = mkdocsYaml ? parseMkdocsNav(mkdocsYaml) : [];
  const navStructure = navTree.length > 0
    ? buildNavStructure(navTree)
    : buildFallbackNavStructure(treeItems);

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

  const output = buildOutput(allItems, manifest, navStructure);

  // Ensure output directory exists and write to a validated fixed path
  const safeOutputPath = assertSafeOutputPath(OUTPUT_PATH);
  mkdirSync(dirname(safeOutputPath), { recursive: true });
  writeFileSync(safeOutputPath, JSON.stringify(output, null, 2), {
    encoding: "utf-8",
    mode: 0o600,
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Knowledge base written to ${safeOutputPath}`);
  console.log(
    `  ${output.categories.length} categories, ${output.documents.length} documents (${elapsed}s)`
  );
}

main().catch((err) => {
  console.error("Failed to fetch docs:", err);
  process.exit(1);
});
