import { describe, test, expect } from 'vitest';
import { hasVisibleCollections, visibleVersions } from '../studyDataAccess';
import studyDataCards from '../studyDataCards';

const ratTraining06 = studyDataCards.find((s) => s.code === 'rat-training-06');
const ratAcute06 = studyDataCards.find((s) => s.code === 'rat-acute-06');
const humanPrecovid = studyDataCards.find((s) => s.code === 'human-precovid-sed-adu');

describe('hasVisibleCollections', () => {
  test('external users: rat-acute-06 has zero public collections, so it is not visible', () => {
    expect(hasVisibleCollections(ratAcute06, 'external')).toBe(false);
  });

  test('external users: rat-training-06 has public collections, so it is visible', () => {
    expect(hasVisibleCollections(ratTraining06, 'external')).toBe(true);
  });

  test('external users: human-precovid-sed-adu has public collections, so it is visible', () => {
    expect(hasVisibleCollections(humanPrecovid, 'external')).toBe(true);
  });

  test('internal users always see every study, including rat-acute-06 (consortium-only)', () => {
    expect(hasVisibleCollections(ratAcute06, 'internal')).toBe(true);
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
