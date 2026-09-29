import { describe, test, expect } from 'vitest';
import knowledgeBase from '../../data/knowledge-base.json';

const { categories = [], documents = [] } = knowledgeBase;

/** Every route the Knowledge Center can actually render. */
function publishedRoutes() {
  const routes = new Set(['/knowledge-center']);

  categories.forEach((category) => {
    routes.add(`/knowledge-center/${category.slug}`);
    (category.subcategories || []).forEach((sub) => {
      routes.add(`/knowledge-center/${category.slug}/${sub.slug}`);
    });
  });

  documents.forEach((doc) => {
    const parts = [doc.category, doc.subcategory, doc.slug].filter(Boolean);
    routes.add(`/knowledge-center/${parts.join('/')}`);
  });

  return routes;
}

/** Internal links, as `{ from, to }`, anchors and query strings removed. */
function internalLinks() {
  const links = [];
  documents.forEach((doc) => {
    const matches = (doc.content || '').matchAll(/\]\((\/knowledge-center[^)\s]*)\)/g);
    for (const match of matches) {
      const to = match[1].split('#')[0].split('?')[0].replace(/\/$/, '');
      links.push({ from: `${doc.category}/${doc.subcategory || ''}/${doc.slug}`, to });
    }
  });
  return links;
}

describe('the knowledge base has no dead internal links', () => {
  test('every /knowledge-center link resolves to something that renders', () => {
    // `fetch-docs.js` rewrites relative .md links into Knowledge Center routes
    // whether or not the target was published, so a link to a doc missing from
    // the mkdocs nav used to become a plausible URL rendering "not found". Two
    // shipped that way, both to analysis-human-precovid-sed-adu-c2.0.
    const routes = publishedRoutes();
    const dead = internalLinks().filter((link) => !routes.has(link.to));

    expect(dead.map((link) => `${link.from} -> ${link.to}`)).toEqual([]);
  });

  test('there is something to check', () => {
    // The assertion above passes trivially against an empty knowledge base, so
    // this pins that the corpus is really being read.
    expect(documents.length).toBeGreaterThan(0);
    expect(internalLinks().length).toBeGreaterThan(0);
  });
});

describe('docs outside the mkdocs nav', () => {
  test('are published under a real category, not their folder name', () => {
    // The folder is not the slug: a subcategory slug comes from its label, so
    // placing an unlisted doc by its path produced a route no category matched.
    const unlisted = documents.filter((doc) => doc.unlisted);

    unlisted.forEach((doc) => {
      const category = categories.find((c) => c.slug === doc.category);
      expect(category, `${doc.slug} has no category`).toBeDefined();
      if (doc.subcategory) {
        const sub = (category.subcategories || []).find((s) => s.slug === doc.subcategory);
        expect(sub, `${doc.slug} has no subcategory`).toBeDefined();
      }
    });
  });
});
