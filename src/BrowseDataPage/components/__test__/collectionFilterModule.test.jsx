import { describe, test, expect } from 'vitest';
import React from 'react';
import { fireEvent, act, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import CollectionFilterModule from '../collectionFilterModule';
import BrowseDataFilter from '../../browseDataFilter';
import { defaultBrowseDataState } from '../../browseDataReducer';
import actions from '../../browseDataActions';
import { entitledPrefixes } from '../../../lib/collectionFiles';
import { studyCollections } from '../../../lib/collectionScope';

const STUDY_ROUTE = '/data-download/file-browser/rat-training-06';

function render(userType, route = STUDY_ROUTE) {
  return renderWithProviders(<CollectionFilterModule userType={userType} />, { route });
}

async function settle(store) {
  await waitFor(() => {
    expect(store.getState().browseData.loadingFiles).toBe(false);
  });
}

const labelled = (container, text) =>
  [...container.querySelectorAll('.filterBtn')].find((button) =>
    button.textContent.includes(text)
  );

const enabled = (container) =>
  [...container.querySelectorAll('.filterBtn')].filter((button) => !button.disabled);

describe('CollectionFilterModule - options', () => {
  test('lists the whole entitled corpus, enabling only what is in scope', () => {
    // Every collection stays on screen so the panel does not reflow as studies
    // are toggled; the ones whose study is out of scope are disabled instead.
    const { container } = render('internal');
    expect(container.querySelectorAll('.filterBtn')).toHaveLength(
      entitledPrefixes('internal').length
    );
    expect(enabled(container)).toHaveLength(
      studyCollections('rat-training-06', 'internal').length
    );
  });

  test('a collection the user may not see is absent, not merely disabled', () => {
    // Disabling is a UI affordance; entitlement is not. An external user is
    // never told that Quant-ID c3.0 exists.
    const { container } = render('external');
    expect(container.querySelectorAll('.filterBtn')).toHaveLength(
      entitledPrefixes('external').length
    );
    expect(labelled(container, 'Quant-ID c3.0')).toBeUndefined();
  });

  test('names the reference genome inline instead of a separate facet', () => {
    const { container } = render('internal');
    expect(labelled(container, 'Quant-ID c3.0').textContent).toContain('Rn8');
  });

  test('a scope holding one collection still shows the rest, disabled', () => {
    const { container } = render('internal', '/data-download/file-browser/human-eqc');
    expect(container.querySelector('.collection-filter-module')).toBeInTheDocument();
    expect(enabled(container)).toHaveLength(1);
  });

  test('nothing renders outside the file browser', () => {
    const { container } = render('internal', '/data-download');
    expect(container.querySelector('.collection-filter-module')).toBeNull();
  });

  test('picking a collection does not narrow the study scope', () => {
    // Study gates collection, not the reverse. If choosing one collection
    // collapsed the scope to its study, every other study's buttons would
    // disable and a second collection could never be added by clicking.
    const { container } = render(
      'internal',
      '/data-download/file-browser?collections=quant-id/rat-training-06/c3.0'
    );
    expect(enabled(container)).toHaveLength(entitledPrefixes('internal').length);
  });

  test('an explicit study list survives a collection selection too', () => {
    const { container } = render(
      'internal',
      '/data-download/file-browser?studies=rat-training-06,rat-acute-06'
        + '&collections=quant-id/rat-training-06/c3.0'
    );
    expect(enabled(container)).toHaveLength(
      studyCollections('rat-training-06', 'internal').length
        + studyCollections('rat-acute-06', 'internal').length
    );
  });
});

describe('CollectionFilterModule - selection', () => {
  test('nothing is checked when the whole study is loaded', async () => {
    const { store, container } = render('internal');
    await act(async () => {
      // An empty selection is how "the whole study" is expressed.
      await store.dispatch(
        actions.selectCollections(studyCollections('rat-training-06', 'internal'), [])
      );
    });
    expect(container.querySelectorAll('.filterBtn.activeFilter')).toHaveLength(0);
  });

  test('selecting one narrows the load to it', async () => {
    const { store, container } = render('internal');
    await act(async () => {
      fireEvent.click(labelled(container, 'Quant-ID c3.0'));
    });
    await settle(store);

    const { selectedCollections, allFiles } = store.getState().browseData;
    expect(selectedCollections).toEqual(['quant-id/rat-training-06/c3.0']);
    expect(
      allFiles.every((file) => file.object.startsWith('quant-id/rat-training-06/c3.0/'))
    ).toBe(true);
  });

  test('deselecting the last one loads the whole study rather than nothing', async () => {
    const { store, container } = render('internal');
    await act(async () => {
      await store.dispatch(actions.selectCollection('quant-id/rat-training-06/c3.0'));
    });

    await act(async () => {
      fireEvent.click(container.querySelector('.filterBtn.activeFilter'));
    });
    await settle(store);

    const state = store.getState().browseData;
    expect(state.selectedCollections).toEqual([]);
    expect(state.loadedCollections).toEqual(studyCollections('rat-training-06', 'internal'));
  });

  test('checking every collection collapses to the empty set', async () => {
    const { store, container } = render('internal');
    const available = studyCollections('rat-training-06', 'internal');
    await act(async () => {
      await store.dispatch(actions.selectCollections(available.slice(1)));
    });

    // Check the one remaining unchecked collection. Only in-scope buttons are
    // candidates; the rest of the corpus is on screen but disabled.
    const remaining = enabled(container).find(
      (button) => !button.classList.contains('activeFilter')
    );
    await act(async () => {
      fireEvent.click(remaining);
    });
    await settle(store);

    // Everything loaded, nothing checked - one state, one representation.
    const state = store.getState().browseData;
    expect(state.selectedCollections).toEqual([]);
    expect(state.loadedCollections).toEqual(available);
    expect(container.querySelectorAll('.filterBtn.activeFilter')).toHaveLength(0);
  });
});

describe('CollectionFilterModule - Clear', () => {
  test('is hidden when nothing is selected', () => {
    const { container } = render('internal');
    expect(container.querySelector('.collection-filter-clear')).toBeNull();
  });

  test('appears once something is selected and restores the whole study', async () => {
    const { store, container } = render('internal');
    await act(async () => {
      await store.dispatch(actions.selectCollection('quant-id/rat-training-06/c3.0'));
    });

    const clear = container.querySelector('.collection-filter-clear');
    expect(clear).toBeTruthy();
    await act(async () => {
      fireEvent.click(clear);
    });
    await settle(store);

    // Clear is the Collection module's own control, so it restores the study --
    // it does not touch the Study picker. "Reset filters" is the one that clears
    // both; see below.
    const state = store.getState().browseData;
    expect(state.selectedCollections).toEqual([]);
    expect(state.loadedCollections).toEqual(studyCollections('rat-training-06', 'internal'));
  });
});

describe('Reset filters clears every scope control, Study included', () => {
  test('a narrowed selection is restored to the whole corpus', async () => {
    const { store, container } = renderWithProviders(
      <BrowseDataFilter
        activeFilters={defaultBrowseDataState.activeFilters}
        onChangeFilter={() => {}}
        onResetFilters={() => {}}
      />,
      {
        route: STUDY_ROUTE,
        preloadedState: {
          auth: { profile: { user_metadata: { userType: 'internal' } } },
        },
      }
    );

    await act(async () => {
      await store.dispatch(actions.selectCollection('quant-id/rat-training-06/c3.0'));
    });
    expect(container.querySelectorAll('.filterBtn.activeFilter').length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reset filters/i }));
    });
    await settle(store);

    // Reset clears Study as well as Collection, so it lands on the whole corpus
    // rather than the study it started in -- Study is a filter like the others,
    // and a reset that skipped it read as the button being broken.
    const state = store.getState().browseData;
    expect(state.selectedCollections).toEqual([]);
    expect(state.loadedCollections).toEqual(entitledPrefixes('internal'));
  });
});
