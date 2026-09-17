import { describe, test, expect } from 'vitest';
import React from 'react';
import { act, fireEvent, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import StudyFilterModule from '../studyFilterModule';
import CollectionFilterModule from '../collectionFilterModule';
import { entitledPrefixes } from '../../../lib/collectionFiles';
import { resolveScope, studyOf } from '../../../lib/collectionScope';

const BROWSER = '/data-download/file-browser';
const studiesFor = (userType) => [...new Set(entitledPrefixes(userType).map(studyOf))];

function render(userType, route = BROWSER) {
  return renderWithProviders(<StudyFilterModule userType={userType} />, { route });
}

describe('StudyFilterModule - what it offers', () => {
  test('lists every study the user may see anything of', () => {
    const { container } = render('internal');
    expect(container.querySelectorAll('.filterBtn')).toHaveLength(
      studiesFor('internal').length
    );
  });

  test('an external user is never offered a study they cannot see', () => {
    const { container } = render('external');
    const external = studiesFor('external');
    expect(container.querySelectorAll('.filterBtn')).toHaveLength(external.length);
    // human-eqc is consortium throughout. (rat-acute-06 was the example here
    // until its c2.0 and c4.0 were released publicly on 2026-09-08.)
    expect(external).not.toContain('human-eqc');
    expect(container.textContent).not.toMatch(/Human Extended Quality Control/);
    expect(external.length).toBeLessThan(studiesFor('internal').length);
  });

  test('a bare URL presses nothing, the same as every other facet', () => {
    // No study selected is every study. Pressing one button per study instead
    // made this the only control where clearing the last selection looked like
    // it selected them all.
    const { container } = render('internal');
    expect(container.querySelectorAll('.filterBtn.activeFilter')).toHaveLength(0);
    expect(container.querySelectorAll('.filterBtn').length).toBe(
      studiesFor('internal').length
    );
  });

  test('with nothing pressed, every entitled collection is in scope', () => {
    // What the bare URL resolves to, which is what dataDownloadsMain loads.
    const scope = resolveScope({ pathname: BROWSER, search: '' }, 'internal');
    expect(scope.studyCodes).toEqual([]);
    expect(scope.prefixes).toEqual(entitledPrefixes('internal'));
  });
});

describe('StudyFilterModule - changing the scope', () => {
  test('pressing one study narrows the load to it', async () => {
    // From the unconstrained default, the first click is a narrowing, not a
    // widening -- the opposite of what it was when the default was one study.
    const { store, container } = render('internal');
    await act(async () => {
      fireEvent.click(container.querySelectorAll('.filterBtn')[0]);
    });
    await waitFor(() => {
      expect(store.getState().browseData.loadingFiles).toBe(false);
    });

    const studies = new Set(
      store.getState().browseData.loadedCollections.map(studyOf)
    );
    expect(studies.size).toBe(1);
  });

  test('a study with more than one in scope can be removed', async () => {
    const two = studiesFor('internal').slice(0, 2);
    const { container } = render('internal', `${BROWSER}?studies=${two.join(',')}`);
    const active = [...container.querySelectorAll('.filterBtn.activeFilter')];
    expect(active).toHaveLength(2);
    active.forEach((button) => expect(button).not.toBeDisabled());
  });

  test('deselecting the last study means every study, not none', async () => {
    // Asking for none is read the way an empty selection is read everywhere else
    // in the panel: as no constraint. (`useNavigate` is mocked away in
    // setupTests, so the resulting URL is covered in collectionScope.test.js;
    // here we check what loads.)
    const { store, container } = render('internal', `${BROWSER}/rat-training-06`);
    await act(async () => {
      fireEvent.click(container.querySelector('.filterBtn.activeFilter'));
    });
    await waitFor(() => {
      expect(store.getState().browseData.loadingFiles).toBe(false);
    });

    expect(new Set(store.getState().browseData.loadedCollections.map(studyOf))).toEqual(
      new Set(studiesFor('internal'))
    );
  });

  test('checking every study lands in the same state as checking none', async () => {
    const all = studiesFor('internal');
    const { store, container } = render(
      'internal',
      `${BROWSER}?studies=${all.slice(0, -1).join(',')}`
    );

    await act(async () => {
      fireEvent.click(
        [...container.querySelectorAll('.filterBtn')].find(
          (button) => !button.classList.contains('activeFilter')
        )
      );
    });
    await waitFor(() => {
      expect(store.getState().browseData.loadingFiles).toBe(false);
    });

    expect(new Set(store.getState().browseData.loadedCollections.map(studyOf))).toEqual(
      new Set(all)
    );
  });
});

describe('CollectionFilterModule - labels repeat across studies', () => {
  test('options are grouped by study, whatever the scope', () => {
    // The picker lists every entitled collection at all times, so the headings
    // are always needed: "Quant-ID c1.0" exists in three studies and the label
    // alone cannot tell them apart.
    const { container } = renderWithProviders(
      <CollectionFilterModule userType="internal" />,
      { route: `${BROWSER}/rat-training-06` }
    );

    const groups = [...container.querySelectorAll('.collection-filter-group')];
    expect(groups).toHaveLength(studiesFor('internal').length);
    groups.forEach((group) => {
      expect(group.querySelector('.collection-filter-study')).toBeInTheDocument();
    });

    const repeated = [...container.querySelectorAll('.filterBtn')].filter((button) =>
      button.textContent.startsWith('Quant-ID c1.0')
    );
    expect(repeated.length).toBeGreaterThan(1);
    expect(new Set(repeated.map((b) => b.closest('.collection-filter-group')))).toHaveProperty(
      'size',
      repeated.length
    );
  });

  test('only the collections of the studies in scope are enabled', () => {
    const { container } = renderWithProviders(
      <CollectionFilterModule userType="internal" />,
      { route: `${BROWSER}/rat-training-06` }
    );
    const groupOf = (name) =>
      [...container.querySelectorAll('.collection-filter-group')].find((group) =>
        within(group).queryByText(name)
      );
    const rat = groupOf('Endurance Training in Young Adult Rats');
    const other = [...container.querySelectorAll('.collection-filter-group')].find(
      (group) => group !== rat
    );

    expect([...rat.querySelectorAll('.filterBtn')].every((b) => !b.disabled)).toBe(true);
    expect([...other.querySelectorAll('.filterBtn')].every((b) => b.disabled)).toBe(true);
  });
});
