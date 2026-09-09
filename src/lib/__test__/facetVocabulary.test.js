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

  test('the phenotype collections contribute nothing, and that is not a bug', () => {
    // Phenotype files are subject-level: no tissue, no ome, no assay. A scope
    // holding only phenotype collections therefore shows all three facets with
    // every option disabled, which is the honest rendering of "these do not
    // apply here".
    const covered = new Set(
      CATEGORIES.flatMap((category) =>
        vocabulary[category].flatMap((entry) => entry.collections)
      )
    );
    const silent = collections
      .map((collection) => collection.prefix)
      .filter((prefix) => !covered.has(prefix));
    expect(silent.every((prefix) => prefix.startsWith('phenotype/'))).toBe(true);
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
    const entitled = entitledPrefixes('internal');
    const options = facetOptions('tissue_name', entitled, studyCollections('rat-training-06', 'internal'));
    const enabled = options.filter((option) => option.enabled).map((option) => option.value);

    // Rat specimens from the study in scope are enabled; the human superclasses,
    // which only human collections carry, are present but not.
    expect(enabled).toContain('Gastrocnemius');
    expect(options.map((option) => option.value)).toContain('Adipose');
    expect(enabled).not.toContain('Adipose');
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

describe('the vocabulary fixes what the hand-written lists got wrong', () => {
  test('rat-training-06 offers only the targeted assays it actually has', () => {
    // The list this replaced (`assayList.pass1b_06`) named 15 targeted assays
    // for this study. The metadata has 7; the other 8 belong to rat-acute-06,
    // so those buttons matched zero files.
    const targeted = facetOptions(
      'assay',
      entitledPrefixes('internal'),
      studyCollections('rat-training-06', 'internal')
    )
      .filter((option) => option.enabled && option.value.startsWith('Targeted'))
      .map((option) => option.value);

    expect(targeted).toHaveLength(7);
    expect(targeted).not.toContain('Targeted Acylcarnitines');
    expect(targeted).toContain('Targeted Acyl-CoA');
  });

  test('rat-acute-06 offers the assays the old list omitted', () => {
    // The same list under-reported the other direction: four assays present in
    // rat-acute-06 were unreachable.
    const values = facetOptions(
      'assay',
      entitledPrefixes('internal'),
      studyCollections('rat-acute-06', 'internal')
    )
      .filter((option) => option.enabled)
      .map((option) => option.value);

    ['Targeted Amines', 'Targeted Ceramides', 'Targeted Tricarboxylic Acid Cycle'].forEach(
      (assay) => expect(values).toContain(assay)
    );
  });

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
