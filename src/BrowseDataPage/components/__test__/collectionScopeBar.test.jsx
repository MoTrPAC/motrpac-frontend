import { describe, test, expect } from 'vitest';
import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import CollectionScopeBar from '../collectionScopeBar';
import { defaultBrowseDataState } from '../../browseDataReducer';
import actions from '../../browseDataActions';
import { studyCollections } from '../../../lib/collectionScope';

const STUDY_ROUTE = '/data-download/file-browser/rat-training-06';

function render(userType, { route = STUDY_ROUTE, preloadedState } = {}) {
  return renderWithProviders(<CollectionScopeBar userType={userType} />, {
    route,
    ...(preloadedState ? { preloadedState } : {}),
  });
}

describe('CollectionScopeBar - status only', () => {
  test('renders no buttons; the picker owns selection', () => {
    const { container } = render('internal');
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });
});

describe('CollectionScopeBar - what it says', () => {
  test('names the collection when exactly one is selected', async () => {
    const { store } = render('internal');
    await act(async () => {
      await store.dispatch(actions.selectCollection('quant-id/rat-training-06/c3.0'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Endurance Training in Young Adult Rats/i)).toBeInTheDocument();
    });
    // The object-path prefix is not repeated beneath: the line above already
    // names the study and collection, and internal users get the GCS path from
    // the card's "GCP Storage" reveal.
    expect(screen.queryByText('quant-id/rat-training-06/c3.0')).not.toBeInTheDocument();
  });

  test('says "all" when nothing is selected, since that means no constraint', () => {
    const total = studyCollections('rat-training-06', 'internal').length;
    render('internal');
    expect(
      screen.getByText(new RegExp(`all ${total} collections in Endurance Training`, 'i'))
    ).toBeInTheDocument();
  });

  test('counts a partial selection honestly rather than claiming "all"', async () => {
    const { store } = render('internal');
    const total = studyCollections('rat-training-06', 'internal').length;
    await act(async () => {
      await store.dispatch(
        actions.selectCollections([
          'quant-id/rat-training-06/c3.0',
          'phenotype/rat-training-06/c4.0',
        ])
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(`2 of ${total} collections in Endurance Training`, 'i'))
      ).toBeInTheDocument();
    });
  });

  test('surfaces a load failure instead of showing an unexplained empty table', () => {
    render('internal', {
      preloadedState: {
        browseData: {
          ...defaultBrowseDataState,
          error: 'Unknown collection: quant-id/nope/c1.0',
        },
        auth: { profile: {} },
      },
    });
    expect(screen.getByText(/could not load these files/i)).toBeInTheDocument();
    expect(screen.getByText(/Unknown collection/)).toBeInTheDocument();
  });
});
