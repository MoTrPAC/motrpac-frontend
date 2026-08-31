import { describe, expect, test } from 'vitest';
import {
  FILE_BROWSER_PATH,
  isKnownStudy,
  resolveScope,
  scopeToPath,
  studyCollections,
  studyOf,
} from '../collectionScope';

const at = (pathname, search = '') => ({ pathname, search });

describe('studyOf', () => {
  test('resolves a study through its card, not the object path', () => {
    // The study folder differs per family: Quant-ID lives under
    // `human-precovid` while Analysis and Phenotype live under
    // `human-precovid-sed-adu`. Both are the same study.
    expect(studyOf('quant-id/human-precovid/c1.0')).toBe('human-precovid-sed-adu');
    expect(studyOf('analysis/human-precovid-sed-adu/c1.3')).toBe('human-precovid-sed-adu');
  });

  test('is null for an unknown collection', () => {
    expect(studyOf('quant-id/nope/c1.0')).toBeNull();
  });
});

describe('studyCollections', () => {
  test('keeps a split-folder study together', () => {
    const collections = studyCollections('human-precovid-sed-adu', 'internal');
    expect(collections).toContain('quant-id/human-precovid/c1.0');
    expect(collections).toContain('analysis/human-precovid-sed-adu/c1.3');
    expect(collections).toHaveLength(4);
  });

  test('is filtered by entitlement', () => {
    const internal = studyCollections('rat-training-06', 'internal');
    const external = studyCollections('rat-training-06', 'external');
    expect(internal).toContain('quant-id/rat-training-06/c3.0');
    expect(external).not.toContain('quant-id/rat-training-06/c3.0');
    expect(external.length).toBeLessThan(internal.length);
  });

  test('never mixes studies', () => {
    const collections = studyCollections('rat-acute-06', 'internal');
    expect(collections.every((prefix) => studyOf(prefix) === 'rat-acute-06')).toBe(true);
  });
});

describe('isKnownStudy', () => {
  test('accepts card codes including the cross-study one', () => {
    expect(isKnownStudy('rat-training-06')).toBe(true);
    expect(isKnownStudy('human-eqc')).toBe(true);
    expect(isKnownStudy('quant-id')).toBe(false);
  });
});

describe('scopeToPath', () => {
  test('one collection keeps the collection path', () => {
    expect(scopeToPath('rat-training-06', ['quant-id/rat-training-06/c3.0'])).toBe(
      `${FILE_BROWSER_PATH}/quant-id/rat-training-06/c3.0`
    );
  });

  test('an empty selection is the study path', () => {
    expect(scopeToPath('rat-training-06', [])).toBe(`${FILE_BROWSER_PATH}/rat-training-06`);
  });

  test('several collections hang off the study path', () => {
    expect(
      scopeToPath('rat-training-06', [
        'quant-id/rat-training-06/c3.0',
        'phenotype/rat-training-06/c4.0',
      ])
    ).toBe(
      `${FILE_BROWSER_PATH}/rat-training-06?collections=quant-id/rat-training-06/c3.0,phenotype/rat-training-06/c4.0`
    );
  });
});

describe('resolveScope - round trips', () => {
  const cases = [
    ['one collection', 'rat-training-06', ['quant-id/rat-training-06/c3.0']],
    ['all of a study', 'rat-training-06', []],
    [
      'some of a study',
      'rat-training-06',
      ['quant-id/rat-training-06/c3.0', 'phenotype/rat-training-06/c4.0'],
    ],
  ];

  test.each(cases)('%s survives the URL', (_label, studyCode, selected) => {
    const url = scopeToPath(studyCode, selected);
    const [pathname, search] = url.split('?');
    const scope = resolveScope(at(pathname, search ? `?${search}` : ''), 'internal');

    expect(scope.inFileBrowser).toBe(true);
    expect(scope.studyCode).toBe(studyCode);
    expect(scope.selected).toEqual(selected);
  });
});

describe('resolveScope - what gets loaded', () => {
  test('an empty selection loads the whole study', () => {
    const scope = resolveScope(at(`${FILE_BROWSER_PATH}/rat-training-06`), 'internal');
    expect(scope.selected).toEqual([]);
    expect(scope.prefixes).toEqual(scope.available);
    expect(scope.prefixes).toHaveLength(6);
  });

  test('the same study URL resolves smaller for an external user', () => {
    const internal = resolveScope(at(`${FILE_BROWSER_PATH}/rat-training-06`), 'internal');
    const external = resolveScope(at(`${FILE_BROWSER_PATH}/rat-training-06`), 'external');
    expect(external.prefixes.length).toBeLessThan(internal.prefixes.length);
    expect(external.prefixes).not.toContain('quant-id/rat-training-06/c3.0');
  });

  test('a selection loads only what was selected', () => {
    const scope = resolveScope(
      at(`${FILE_BROWSER_PATH}/quant-id/rat-training-06/c3.0`),
      'internal'
    );
    expect(scope.prefixes).toEqual(['quant-id/rat-training-06/c3.0']);
  });
});

describe('resolveScope - entitlement', () => {
  test('an anonymous user asking for a consortium collection gets nothing', () => {
    const scope = resolveScope(
      at(`${FILE_BROWSER_PATH}/quant-id/rat-training-06/c3.0`),
      undefined
    );
    expect(scope.inFileBrowser).toBe(true);
    expect(scope.prefixes).toEqual([]);
    expect(scope.studyCode).toBeNull();
  });

  test('asking for nothing is not the same as asking for the forbidden', () => {
    // Naming no collections legitimately means "all of this study"; naming only
    // collections you cannot see must not silently become that.
    const anonymous = resolveScope(at(`${FILE_BROWSER_PATH}/rat-training-06`), undefined);
    expect(anonymous.prefixes.length).toBeGreaterThan(0);
  });

  test('a mixed list keeps only the entitled entries', () => {
    const scope = resolveScope(
      at(
        `${FILE_BROWSER_PATH}/rat-training-06`,
        '?collections=quant-id/rat-training-06/c3.0,quant-id/rat-training-06/c2.0'
      ),
      'external'
    );
    expect(scope.selected).toEqual(['quant-id/rat-training-06/c2.0']);
  });
});

describe('resolveScope - malformed input', () => {
  test('a list spanning studies is clamped to the first entry’s study', () => {
    const scope = resolveScope(
      at(
        `${FILE_BROWSER_PATH}/rat-training-06`,
        '?collections=quant-id/rat-training-06/c3.0,quant-id/rat-acute-06/c1.0'
      ),
      'internal'
    );
    expect(scope.studyCode).toBe('rat-training-06');
    expect(scope.selected).toEqual(['quant-id/rat-training-06/c3.0']);
  });

  test('an unknown study falls through', () => {
    const scope = resolveScope(at(`${FILE_BROWSER_PATH}/not-a-study`), 'internal');
    expect(scope.inFileBrowser).toBe(true);
    expect(scope.prefixes).toEqual([]);
  });

  test('an unknown collection falls through', () => {
    const scope = resolveScope(at(`${FILE_BROWSER_PATH}/quant-id/nope/c9.9`), 'internal');
    expect(scope.prefixes).toEqual([]);
  });

  test('trailing slashes are tolerated', () => {
    const scope = resolveScope(at(`${FILE_BROWSER_PATH}/rat-training-06/`), 'internal');
    expect(scope.studyCode).toBe('rat-training-06');
  });

  test('a URL outside the file browser is not the file browser', () => {
    expect(resolveScope(at('/data-download'), 'internal').inFileBrowser).toBe(false);
  });
});
