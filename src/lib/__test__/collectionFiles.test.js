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
  test('every collection declared on a card has a loader', () => {
    const declared = [];
    [...studyDataCards, ...humanPhenotypeDataCards].forEach((card) => {
      Object.values(card.dataTypes).forEach((versions) => {
        versions.forEach((version) => {
          declared.push(prefixFromStorageLocation(version.storageLocation));
        });
      });
    });
    const missing = declared.filter((prefix) => !isKnownCollection(prefix));
    expect(missing).toEqual([]);
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
    const files = await loadCollection('quant-id/rat-training-06/c3.0');
    expect(files.length).toBeGreaterThan(0);
    const strays = files.filter(
      (file) => !file.object.startsWith('quant-id/rat-training-06/c3.0/')
    );
    expect(strays).toEqual([]);
  });

  test('an unknown collection is rejected rather than silently empty', async () => {
    await expect(loadCollection('quant-id/nope/c1.0')).rejects.toThrow('Unknown collection');
  });

  test('loading several collections concatenates them', async () => {
    const prefixes = ['phenotype/human-eqc/c14.0', 'phenotype/rat-training-06/c4.0'];
    const files = await loadCollections(prefixes);
    const [first, second] = await Promise.all(prefixes.map(loadCollection));
    expect(files).toHaveLength(first.length + second.length);
  });

  test('cross-study collections carry a null phase and study', async () => {
    const files = await loadCollection('phenotype/human-eqc/c14.0');
    expect(files.every((file) => file.phase === null && file.study === null)).toBe(true);
    expect(files.every((file) => file.species === 'Human')).toBe(true);
  });

  test('release stage varies per file within a collection', async () => {
    const files = await loadCollection('analysis/human-precovid-sed-adu/c1.3');
    const stages = new Set(files.map((file) => file.release_stage));
    expect(stages).toEqual(new Set(['public_release', 'consortium_release']));
    expect(files.filter((file) => file.external_release)).toHaveLength(120);
  });
});
