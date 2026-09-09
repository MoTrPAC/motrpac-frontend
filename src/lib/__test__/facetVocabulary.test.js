import { describe, expect, test } from 'vitest';
import vocabulary, { FACETS, facetOptions } from '../facetVocabulary';
import facetValues from '../fileFacets';
import { entitledPrefixes } from '../collectionFiles';
import { studyCollections } from '../collectionScope';

const CATEGORIES = FACETS.map((facet) => facet.keyName);

/** Every shipped collection, keyed by the prefix its filename encodes. */
const collections = Object.entries(
  import.meta.glob('../../data/file_download_metadata/collections/*.json', { eager: true })
).map(([path, module]) => ({
  prefix: path
    .split('/')
    .pop()
    .replace(/-minified\.json$/, '')
    .split('_')
    .join('/'),
  files: module.default,
}));

describe('the checked-in vocabulary matches the shipped metadata', () => {
  // `scripts/build-facet-vocabulary.js` writes the file this guards. It is a
  // build artifact committed to the repo, so the one way it can go wrong is by
  // not being rebuilt after collection metadata changes. Rebuilding it here and
  // comparing is cheaper than remembering.
  const rebuilt = {};
  CATEGORIES.forEach((category) => {
    const seen = new Map();
    collections.forEach(({ prefix, files }) => {
      files.forEach((file) => {
        facetValues(file, category).forEach((value) => {
          if (!seen.has(value)) {
            seen.set(value, { species: new Set(), collections: new Set() });
          }
          if (file.species) {
            seen.get(value).species.add(file.species);
          }
          seen.get(value).collections.add(prefix);
        });
      });
    });
    rebuilt[category] = [...seen.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, entry]) => ({
        value,
        species: [...entry.species].sort(),
        collections: [...entry.collections].sort(),
      }));
  });

  test.each(CATEGORIES)('%s is up to date - rerun yarn build-facet-vocabulary', (category) => {
    expect(vocabulary[category]).toEqual(rebuilt[category]);
  });

  test('every prefix it names is a real collection', () => {
    const known = new Set(collections.map((collection) => collection.prefix));
    CATEGORIES.forEach((category) => {
      vocabulary[category].forEach((entry) => {
        entry.collections.forEach((prefix) => expect(known).toContain(prefix));
      });
    });
  });

  test('a collection contributes exactly the values its files carry', () => {
    // Phenotype files are subject-level -- no tissue, no ome, no assay -- so a
    // scope holding only those shows all three facets with every option
    // disabled, which is the honest rendering of "these do not apply here".
    // Stated as an equivalence so it holds for any collection, rather than
    // naming the families that happen to be silent today.
    const covered = new Set(
      CATEGORIES.flatMap((category) =>
        vocabulary[category].flatMap((entry) => entry.collections)
      )
    );
    collections.forEach(({ prefix, files }) => {
      const hasAnyValue = files.some((file) =>
        CATEGORIES.some((category) => facetValues(file, category).length > 0)
      );
      expect(covered.has(prefix)).toBe(hasAnyValue);
    });
  });
});

describe('facetOptions', () => {
  test('an option exists only if an entitled collection carries it', () => {
    const internal = facetOptions('assay', entitledPrefixes('internal'), []);
    const external = facetOptions('assay', entitledPrefixes('external'), []);
    expect(external.length).toBeLessThan(internal.length);

    const externalPrefixes = new Set(entitledPrefixes('external'));
    external.forEach((option) => {
      const entry = vocabulary.assay.find((candidate) => candidate.value === option.value);
      expect(entry.collections.some((prefix) => externalPrefixes.has(prefix))).toBe(true);
    });
  });

  test('scope decides enablement, not existence', () => {
    // An option is enabled iff some in-scope collection carries it, and every
    // option stays on screen either way. Asserted as that equivalence rather
    // than by naming tissues, because the committed metadata is one record per
    // collection and carries no particular value.
    const entitled = entitledPrefixes('internal');
    const inScope = studyCollections('rat-training-06', 'internal');
    const scoped = new Set(inScope);
    const options = facetOptions('tissue_name', entitled, inScope);
    const all = facetOptions('tissue_name', entitled, []);

    expect(options.map((o) => o.value)).toEqual(all.map((o) => o.value));
    options.forEach((option) => {
      const entry = vocabulary.tissue_name.find((e) => e.value === option.value);
      expect(option.enabled).toBe(entry.collections.some((p) => scoped.has(p)));
    });
  });

  test('an empty scope enables nothing but still offers everything', () => {
    const entitled = entitledPrefixes('internal');
    const options = facetOptions('omics', entitled, []);
    expect(options.length).toBeGreaterThan(0);
    expect(options.every((option) => !option.enabled)).toBe(true);
  });

  test('an unknown category is empty rather than a crash', () => {
    expect(facetOptions('not_a_facet', entitledPrefixes('internal'), [])).toEqual([]);
  });
});

describe('the vocabulary is derived, not hand-written', () => {
  // The counts that motivated this -- rat-training-06 offering 8 targeted
  // assays it never ran, rat-acute-06 missing 4 it has, 24 of human-precovid's
  // 46 unreachable -- were measured against the full listings, which are not in
  // this repo. They are recorded in scripts/build-facet-vocabulary.js and in
  // dev_resources/multi-study-file-browser-plan.md rather than asserted here,
  // since a test cannot check data it does not have.
  test('no option is a comma-joined pair', () => {
    // `omics: ['Epigenomics', 'Transcriptomics, Proteomics']` used to reach the
    // panel verbatim as one option.
    CATEGORIES.forEach((category) => {
      vocabulary[category].forEach((entry) => {
        expect(entry.value).not.toContain(',');
      });
    });
  });
});
