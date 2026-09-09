import { describe, expect, test } from 'vitest';
import LOADERS, {
  entitledPrefixes,
  findCollection,
  isKnownCollection,
  loadCollection,
  loadCollections,
  prefixFromStorageLocation,
} from '../collectionFiles';
import studyDataCards, { humanPhenotypeDataCards } from '../studyDataCards';

const bucket = import.meta.env.VITE_DATA_FILE_BUCKET;

describe('collection prefixes', () => {
  test('a collection without metadata is never offered for loading', () => {
    // Cards announce collections as soon as data lands in the bucket; the
    // metadata is generated afterwards, so declared-without-metadata is a
    // legitimate transient state. The safety property is that the file browser
    // only ever loads collections that actually have metadata behind them.
    ['internal', 'external', undefined].forEach((userType) => {
      const unloadable = entitledPrefixes(userType).filter(
        (prefix) => !isKnownCollection(prefix)
      );
      expect(unloadable).toEqual([]);
    });
  });

  test('every loader corresponds to a declared collection', () => {
    const orphans = Object.keys(LOADERS).filter((prefix) => findCollection(prefix) === null);
    expect(orphans).toEqual([]);
  });

  test('storage locations reduce to the object-path prefix', () => {
    expect(prefixFromStorageLocation(`gs://${bucket}/quant-id/rat-training-06/c3.0`)).toBe(
      'quant-id/rat-training-06/c3.0'
    );
  });
});

describe('entitlement', () => {
  test('external users are not offered consortium-only collections', () => {
    const external = entitledPrefixes('external');
    expect(external).not.toContain('quant-id/rat-training-06/c3.0');
    expect(external).not.toContain('quant-id/rat-acute-06/c1.0');
    expect(external).not.toContain('phenotype/human-eqc/c14.0');
  });

  test('external users keep the public collections', () => {
    const external = entitledPrefixes('external');
    expect(external).toContain('quant-id/rat-training-06/c2.0');
    expect(external).toContain('analysis/human-precovid-sed-adu/c1.3');
  });

  test('internal users are entitled to every collection', () => {
    expect(entitledPrefixes('internal').sort()).toEqual(Object.keys(LOADERS).sort());
  });
});

describe('loading', () => {
  test('a collection loads only its own files', async () => {
    const files = await loadCollection('quant-id/rat-training-06/c3.0', 'internal');
    expect(files.length).toBeGreaterThan(0);
    const strays = files.filter(
      (file) => !file.object.startsWith('quant-id/rat-training-06/c3.0/')
    );
    expect(strays).toEqual([]);
  });

  test('an unknown collection is rejected rather than silently empty', async () => {
    await expect(loadCollection('quant-id/nope/c1.0', 'internal')).rejects.toThrow(
      'Unknown collection'
    );
  });

  test('loading several collections concatenates them', async () => {
    const prefixes = ['phenotype/human-eqc/c14.0', 'phenotype/rat-training-06/c4.0'];
    const files = await loadCollections(prefixes, 'internal');
    const [first, second] = await Promise.all(
      prefixes.map((prefix) => loadCollection(prefix, 'internal'))
    );
    expect(files).toHaveLength(first.length + second.length);
  });

  test('cross-study collections carry a null phase and study', async () => {
    const files = await loadCollection('phenotype/human-eqc/c14.0', 'internal');
    expect(files.every((file) => file.phase === null && file.study === null)).toBe(true);
    expect(files.every((file) => file.species === 'Human')).toBe(true);
  });

  test('release stage varies per file within a collection', async () => {
    const files = await loadCollection('analysis/human-precovid-sed-adu/c1.3', 'internal');
    const stages = new Set(files.map((file) => file.release_stage));
    expect(stages).toEqual(new Set(['public_release', 'consortium_release']));
  });
});

describe('a public collection may still hold consortium-only files', () => {
  // `analysis/human-precovid-sed-adu/c1.3` is public, so `entitledPrefixes`
  // offers it to everyone -- but in the real corpus 98 of its 218 files are
  // consortium-only. The collection-level gate cannot see that, so the
  // file-level one has to.
  //
  // Stated as relations rather than those two counts, because the metadata
  // committed here is a sample of the real listings (see `generator mock`) --
  // and because hardcoded totals would have broken on the next regeneration
  // anyway. These hold against the sample and the real data alike, so CI and
  // the staging build assert the same property.
  const PARTIAL = 'analysis/human-precovid-sed-adu/c1.3';

  test('internal users get strictly more of it than external users', async () => {
    const internal = await loadCollection(PARTIAL, 'internal');
    const external = await loadCollection(PARTIAL, 'external');
    expect(external.length).toBeGreaterThan(0);
    expect(internal.length).toBeGreaterThan(external.length);
  });

  test.each(['external', undefined])('%s users get only its public files', async (userType) => {
    const all = await loadCollection(PARTIAL, 'internal');
    const files = await loadCollection(PARTIAL, userType);
    expect(files).toHaveLength(all.filter((file) => file.external_release === true).length);
    expect(files.every((file) => file.external_release === true)).toBe(true);
  });

  test('no unreleased file reaches a non-internal user, across the whole corpus', async () => {
    // The property that matters, stated once over everything rather than per
    // collection, so a future collection with per-file rules is covered too.
    const checks = await Promise.all(
      ['external', undefined].map((userType) =>
        loadCollections(entitledPrefixes(userType), userType)
      )
    );
    checks.forEach((files) => {
      expect(files.length).toBeGreaterThan(0);
      expect(files.every((file) => file.release_stage === 'public_release')).toBe(true);
    });
  });

  test('internal users still see consortium files', async () => {
    const files = await loadCollections(entitledPrefixes('internal'), 'internal');
    expect(files.some((file) => file.release_stage === 'consortium_release')).toBe(true);
  });
});
