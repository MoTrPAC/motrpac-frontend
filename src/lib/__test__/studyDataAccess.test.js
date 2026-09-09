import { describe, test, expect } from 'vitest';
import {
  allVersions,
  collectionSeries,
  hasVisibleCollections,
  versionStages,
  visibleVersions,
} from '../studyDataAccess';
import studyDataCards from '../studyDataCards';

const ratTraining06 = studyDataCards.find((s) => s.code === 'rat-training-06');
const ratAcute06 = studyDataCards.find((s) => s.code === 'rat-acute-06');
const humanPrecovid = studyDataCards.find((s) => s.code === 'human-precovid-sed-adu');
// rat-acute-06 was the consortium-only example until c2.0/c4.0 were released
// publicly on 2026-09-08. The human main study is the one that holds that shape
// now; the property under test is the gating, not the study.
const consortiumOnly = studyDataCards.find((s) => s.code === 'human-main');

describe('hasVisibleCollections', () => {
  test('external users: a study with zero public collections is not visible', () => {
    expect(hasVisibleCollections(consortiumOnly, 'external')).toBe(false);
  });

  test('external users: rat-acute-06 became visible when c2.0 and c4.0 went public', () => {
    expect(hasVisibleCollections(ratAcute06, 'external')).toBe(true);
  });

  test('external users: rat-training-06 has public collections, so it is visible', () => {
    expect(hasVisibleCollections(ratTraining06, 'external')).toBe(true);
  });

  test('external users: human-precovid-sed-adu has public collections, so it is visible', () => {
    expect(hasVisibleCollections(humanPrecovid, 'external')).toBe(true);
  });

  test('internal users always see every study, including consortium-only ones', () => {
    expect(hasVisibleCollections(consortiumOnly, 'internal')).toBe(true);
  });
});

describe('visibleVersions', () => {
  test('external users never see the Rn8 (c3.0, consortium-only) version of rat-training-06 quantID', () => {
    const versions = visibleVersions(ratTraining06.dataTypes.quantID, 'external');

    expect(versions.map((v) => v.referenceGenome)).not.toContain('Rn8');
    expect(versions.map((v) => v.collection)).toEqual(['c2.0', 'c1.0']);
  });

  test('external users see all of rat-training-06 analysis, since both versions are public (regression guard for the releaseStage typo fix)', () => {
    const versions = visibleVersions(ratTraining06.dataTypes.analysis, 'external');

    expect(versions).toHaveLength(2);
  });

  test('internal users see every version, including consortium-only ones', () => {
    const versions = visibleVersions(ratTraining06.dataTypes.quantID, 'internal');

    expect(versions).toHaveLength(3);
  });
});

describe('a kind can hold several independent series', () => {
  const kind = 'phenotype';
  const flat = [
    { collection: 'c2.0', storageLocation: 'gs://b/phenotype/x/c2.0', releaseStage: 'public' },
    { collection: 'c1.0', storageLocation: 'gs://b/phenotype/x/c1.0', releaseStage: 'public' },
  ];
  const grouped = [
    {
      name: 'Sedentary Adults',
      description: 'Adults enrolled after the suspension.',
      collections: [
        { collection: 'c2.0', storageLocation: 'gs://b/phenotype/sed/c2.0', releaseStage: 'consortium' },
      ],
    },
    {
      name: 'Pediatric',
      collections: [
        { collection: 'c2.0', storageLocation: 'gs://b/phenotype/ped/c2.0', releaseStage: 'consortium, early' },
      ],
    },
  ];

  test('a bare version list is one unnamed series', () => {
    const series = collectionSeries(flat);
    expect(series).toHaveLength(1);
    expect(series[0].name).toBeNull();
    expect(series[0].versions).toHaveLength(2);
  });

  test('named series stay separate, so one is not read as a version of another', () => {
    const series = collectionSeries(grouped);
    expect(series.map((s) => s.name)).toEqual(['Sedentary Adults', 'Pediatric']);
    expect(series[0].versions).toHaveLength(1);
    expect(series[1].versions).toHaveLength(1);
  });

  test('each series keeps its own storage paths', () => {
    const series = collectionSeries(grouped);
    expect(series[0].versions[0].storageLocation).toContain('/sed/');
    expect(series[1].versions[0].storageLocation).toContain('/ped/');
  });

  test('allVersions flattens across series', () => {
    expect(allVersions(grouped)).toHaveLength(2);
    expect(allVersions(flat)).toHaveLength(2);
  });
});

describe('a version can name more than one release stage', () => {
  test('the stages are parsed apart', () => {
    expect(versionStages({ releaseStage: 'consortium, early' })).toEqual([
      'consortium',
      'early',
    ]);
    expect(versionStages({ releaseStage: 'public' })).toEqual(['public']);
    expect(versionStages({})).toEqual([]);
  });

  test('a mixed-stage collection is public only if every stage is public', () => {
    // Taking the most permissive stage would expose the consortium datasets
    // inside a collection that also holds public ones.
    const mixed = [{ storageLocation: 'gs://b/a/b/c1.0', releaseStage: 'public, consortium' }];
    expect(visibleVersions(mixed, 'external')).toEqual([]);
    expect(visibleVersions(mixed, 'internal')).toHaveLength(1);
  });

  test('a version with no stage is never public', () => {
    expect(visibleVersions([{ storageLocation: 'gs://b/a/b/c1.0' }], 'external')).toEqual([]);
  });
});

describe('early-access data is not distributed through the data download feature', () => {
  const earlyOnly = [
    { collection: 'c1.0', storageLocation: 'gs://b/quant-id/x/c1.0', releaseStage: 'early' },
  ];
  const mixed = [
    { collection: 'c2.0', storageLocation: 'gs://b/phenotype/y/c2.0', releaseStage: 'consortium, early' },
  ];

  test('an early-access-only collection is hidden from everyone, internal included', () => {
    expect(visibleVersions(earlyOnly, 'internal')).toEqual([]);
    expect(visibleVersions(earlyOnly, 'external')).toEqual([]);
    expect(visibleVersions(earlyOnly, undefined)).toEqual([]);
  });

  test('a collection mixing consortium and early access is still distributed', () => {
    // It is listed on the strength of its released files, not withheld because
    // some of its contents are provisional.
    expect(visibleVersions(mixed, 'internal')).toHaveLength(1);
  });

  test('a mixed consortium/early collection stays hidden from external users', () => {
    expect(visibleVersions(mixed, 'external')).toEqual([]);
  });

  test('a study whose only collections are early access has nothing to show', () => {
    const study = { dataTypes: { quantID: earlyOnly } };
    expect(hasVisibleCollections(study, 'internal')).toBe(false);
  });
});
