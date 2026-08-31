import { describe, test, expect } from 'vitest';
import React from 'react';
import { fireEvent, act, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import CollectionFilterModule from '../collectionFilterModule';
import BrowseDataFilter from '../../browseDataFilter';
import { defaultBrowseDataState } from '../../browseDataReducer';
import actions from '../../browseDataActions';
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

describe('CollectionFilterModule - options', () => {
  test('offers only the current study, not the whole corpus', () => {
    const { container } = render('internal');
    const buttons = [...container.querySelectorAll('.filterBtn')];
    expect(buttons).toHaveLength(studyCollections('rat-training-06', 'internal').length);
    expect(container.textContent).not.toContain('rat-acute-06');
  });

  test('an external user is offered only that study’s public collections', () => {
    const { container } = render('external');
    expect([...container.querySelectorAll('.filterBtn')]).toHaveLength(
      studyCollections('rat-training-06', 'external').length
    );
    expect(labelled(container, 'Quant-ID c3.0')).toBeUndefined();
  });

  test('names the reference genome inline instead of a separate facet', () => {
    const { container } = render('internal');
    expect(labelled(container, 'Quant-ID c3.0').textContent).toContain('Rn8');
  });

  test('a study with one entitled collection hides the module', () => {
    const { container } = render('internal', '/data-download/file-browser/human-eqc');
    expect(container.querySelector('.collection-filter-module')).toBeNull();
  });

  test('nothing renders outside the file browser', () => {
    const { container } = render('internal', '/data-download');
    expect(container.querySelector('.collection-filter-module')).toBeNull();
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

    // Check the one remaining unchecked collection.
    const remaining = [...container.querySelectorAll('.filterBtn')].find(
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

    const state = store.getState().browseData;
    expect(state.selectedCollections).toEqual([]);
    expect(state.loadedCollections).toEqual(studyCollections('rat-training-06', 'internal'));
  });
});

describe('Reset filters clears the collection selection too', () => {
  test('a narrowed selection is restored to the whole study', async () => {
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

    const state = store.getState().browseData;
    expect(state.selectedCollections).toEqual([]);
    expect(state.loadedCollections).toEqual(studyCollections('rat-training-06', 'internal'));
  });
});
