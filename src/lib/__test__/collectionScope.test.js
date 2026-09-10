import { describe, expect, test } from 'vitest';
import {
  ALL_STUDIES,
  DEFAULT_STUDY,
  FILE_BROWSER_PATH,
  availableStudies,
  collectionVersion,
  isKnownStudy,
  resolveScope,
  scopeStudies,
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
    expect(collections).toHaveLength(5);
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

describe('collectionVersion', () => {
  test('is the version alone, without the family', () => {
    // The file table shows this beside a Type column that already says Quant-ID
    // / Analysis / Phenotype, so prefixing the family repeats it on every row.
    expect(collectionVersion('quant-id/rat-training-06/c3.0')).toBe('c3.0');
    expect(collectionVersion('phenotype/human-precovid-sed-adu/c2.0')).toBe('c2.0');
  });

  test('an unknown prefix is empty rather than a broken label', () => {
    expect(collectionVersion('quant-id/nope/c9.9')).toBe('');
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
    expect(scopeToPath(['rat-training-06'], ['quant-id/rat-training-06/c3.0'])).toBe(
      `${FILE_BROWSER_PATH}/quant-id/rat-training-06/c3.0`
    );
  });

  test('an empty selection is the study path', () => {
    expect(scopeToPath(['rat-training-06'], [])).toBe(`${FILE_BROWSER_PATH}/rat-training-06`);
  });

  test('several collections hang off the study path', () => {
    expect(
      scopeToPath(['rat-training-06'], [
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
    const url = scopeToPath([studyCode], selected);
    const [pathname, search] = url.split('?');
    const scope = resolveScope(at(pathname, search ? `?${search}` : ''), 'internal');

    expect(scope.inFileBrowser).toBe(true);
    expect(scope.studyCodes).toEqual([studyCode]);
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
    expect(scope.studyCodes).toEqual([]);
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
  test('a list spanning studies is honoured, not clamped', () => {
    // Clamping existed only because the browser was pinned to one study.
    const scope = resolveScope(
      at(
        `${FILE_BROWSER_PATH}/rat-training-06`,
        '?collections=quant-id/rat-training-06/c3.0,quant-id/rat-acute-06/c1.0'
      ),
      'internal'
    );
    expect([...scope.studyCodes].sort()).toEqual(['rat-acute-06', 'rat-training-06']);
    expect(scope.selected).toHaveLength(2);
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
    expect(scope.studyCodes).toEqual(['rat-training-06']);
  });

  test('a URL outside the file browser is not the file browser', () => {
    expect(resolveScope(at('/data-download'), 'internal').inFileBrowser).toBe(false);
  });
});

describe('resolveScope - the browser is reachable on its own', () => {
  test('a bare URL opens on the default study, not on everything', () => {
    // rat-training-06 is the one study any visitor can reach. Loading all
    // studies for someone who merely typed the URL would be a poor trade.
    ['internal', 'external', undefined].forEach((userType) => {
      const scope = resolveScope(at(FILE_BROWSER_PATH), userType);
      expect(scope.inFileBrowser).toBe(true);
      expect(scope.studyCodes).toEqual([DEFAULT_STUDY]);
      expect(scope.prefixes).toEqual(scope.available);
      expect(scope.prefixes.length).toBeGreaterThan(0);
    });
  });

  test('the default scope is still filtered by entitlement', () => {
    const internal = resolveScope(at(FILE_BROWSER_PATH), 'internal');
    const anonymous = resolveScope(at(FILE_BROWSER_PATH), undefined);
    expect(anonymous.prefixes.length).toBeLessThan(internal.prefixes.length);
    expect(anonymous.prefixes).not.toContain('quant-id/rat-training-06/c3.0');
  });
});

describe('resolveScope - asking for everything', () => {
  test('the all-studies path brings every entitled study into scope', () => {
    const scope = resolveScope(at(`${FILE_BROWSER_PATH}/${ALL_STUDIES}`), 'internal');
    expect(scope.inFileBrowser).toBe(true);
    expect(scope.allStudies).toBe(true);
    expect(new Set(scope.studyCodes)).toEqual(new Set(availableStudies('internal')));
    expect(scope.prefixes).toEqual(scope.available);
  });

  test('it is still filtered by entitlement', () => {
    const internal = resolveScope(at(`${FILE_BROWSER_PATH}/${ALL_STUDIES}`), 'internal');
    const anonymous = resolveScope(at(`${FILE_BROWSER_PATH}/${ALL_STUDIES}`), undefined);
    expect(anonymous.prefixes.length).toBeLessThan(internal.prefixes.length);
    expect(anonymous.prefixes).not.toContain('quant-id/rat-training-06/c3.0');
    // rat-acute-06 is in scope for everyone now that c2.0 and c4.0 are public,
    // but only those two collections of it.
    expect(anonymous.prefixes).not.toContain('quant-id/rat-acute-06/c1.0');
    expect(anonymous.studyCodes).not.toContain('human-eqc');
  });

  test('it round trips, and keeps the short form', () => {
    const scope = resolveScope(at(`${FILE_BROWSER_PATH}/${ALL_STUDIES}`), 'internal');
    expect(scopeStudies(scope)).toEqual([ALL_STUDIES]);
    expect(scopeToPath(scopeStudies(scope), [])).toBe(`${FILE_BROWSER_PATH}/${ALL_STUDIES}`);
  });

  test('a collection selection narrows what loads, not the scope', () => {
    // Study decides which collections are offered; the selection decides which
    // are loaded. Collapsing the scope onto the selection would disable every
    // other study's collections and make a second one unpickable.
    const scope = resolveScope(
      at(
        `${FILE_BROWSER_PATH}/${ALL_STUDIES}`,
        '?collections=quant-id/rat-training-06/c3.0'
      ),
      'internal'
    );
    expect(scope.selected).toEqual(['quant-id/rat-training-06/c3.0']);
    expect(scope.prefixes).toEqual(['quant-id/rat-training-06/c3.0']);
    expect(scope.studyCodes).toEqual(availableStudies('internal'));
    expect(scope.allStudies).toBe(true);
  });

  test('the scope survives the round trip with a selection', () => {
    const scope = resolveScope(
      at(`${FILE_BROWSER_PATH}/${ALL_STUDIES}`, '?collections=quant-id/rat-training-06/c3.0'),
      'internal'
    );
    const path = scopeToPath(scopeStudies(scope), scope.selected);
    const [pathname, search] = path.split('?');
    const again = resolveScope(at(pathname, `?${search}`), 'internal');
    expect(again.allStudies).toBe(true);
    expect(again.selected).toEqual(scope.selected);
  });

  test('an explicit study list also survives a selection', () => {
    const two = ['rat-training-06', 'rat-acute-06'];
    const scope = resolveScope(
      at(
        FILE_BROWSER_PATH,
        `?studies=${two.join(',')}&collections=quant-id/rat-training-06/c3.0`
      ),
      'internal'
    );
    expect(scope.studyCodes).toEqual(two);
    expect(scope.prefixes).toEqual(['quant-id/rat-training-06/c3.0']);
    expect(scopeToPath(scope.studyCodes, scope.selected)).toContain(`studies=${two.join(',')}`);
  });

  test('a single-collection URL still means that collection’s study', () => {
    // What the cards' Browse Files links produce; the short form has to keep
    // resolving the way it always did.
    const path = scopeToPath(['rat-training-06'], ['quant-id/rat-training-06/c3.0']);
    expect(path).toBe(`${FILE_BROWSER_PATH}/quant-id/rat-training-06/c3.0`);
    const scope = resolveScope(at(path), 'internal');
    expect(scope.studyCodes).toEqual(['rat-training-06']);
    expect(scope.allStudies).toBe(false);
  });

  test('a denial is not turned into a grant', () => {
    // The empty study list that a refusal produces must stay a refusal. "All"
    // has its own spelling precisely so the two cannot be confused.
    const denied = resolveScope(
      at(`${FILE_BROWSER_PATH}/quant-id/rat-training-06/c3.0`),
      undefined
    );
    expect(denied.studyCodes).toEqual([]);
    expect(denied.allStudies).toBe(false);
    expect(denied.prefixes).toEqual([]);
  });

  test('a bare URL is still the default study, not everything', () => {
    const scope = resolveScope(at(FILE_BROWSER_PATH), 'internal');
    expect(scope.studyCodes).toEqual([DEFAULT_STUDY]);
    expect(scope.allStudies).toBe(false);
  });
});

describe('resolveScope - several studies in scope', () => {
  const two = ['rat-training-06', 'rat-acute-06'];

  test('a studies list brings both studies collections into scope', () => {
    const scope = resolveScope(at(FILE_BROWSER_PATH, `?studies=${two.join(',')}`), 'internal');
    expect(scope.studyCodes).toEqual(two);
    expect(new Set(scope.available.map(studyOf))).toEqual(new Set(two));
    expect(scope.selected).toEqual([]);
    expect(scope.prefixes).toEqual(scope.available);
  });

  test('entitlement still applies across the whole scope', () => {
    const internal = resolveScope(at(FILE_BROWSER_PATH, `?studies=${two.join(',')}`), 'internal');
    const external = resolveScope(at(FILE_BROWSER_PATH, `?studies=${two.join(',')}`), 'external');
    // Both studies stay in scope -- rat-acute-06 has public collections since
    // 2026-09-08 -- but an external user gets fewer collections of each.
    expect(new Set(external.available.map(studyOf))).toEqual(new Set(two));
    expect(external.available.length).toBeLessThan(internal.available.length);
    expect(external.available).not.toContain('quant-id/rat-acute-06/c1.0');
    expect(external.available).toContain('quant-id/rat-acute-06/c2.0');
  });

  test('a multi-study scope round trips through the URL', () => {
    const path = scopeToPath(two, []);
    const [pathname, search] = path.split('?');
    const scope = resolveScope(at(pathname, `?${search}`), 'internal');
    expect(scope.studyCodes).toEqual(two);
  });

  test('an unknown study in the list is ignored rather than emptying the scope', () => {
    const scope = resolveScope(
      at(FILE_BROWSER_PATH, '?studies=rat-training-06,not-a-study'),
      'internal'
    );
    expect(scope.studyCodes).toEqual(['rat-training-06']);
  });
});
