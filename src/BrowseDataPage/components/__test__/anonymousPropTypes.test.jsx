import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import StudyDataExplorer from '../studyDataExplorer';
import CollectionScopeBar from '../collectionScopeBar';
import actions from '../../browseDataActions';

/**
 * An anonymous visitor has no `profile.user_metadata`, so `userType` is
 * undefined throughout the download page. That is a normal state, not a missing
 * prop -- CollectionActionButtons used to declare it `isRequired` and warned on
 * every render of the page.
 *
 * These tests fail on *any* propType warning, so they guard the whole class of
 * problem rather than the one component that happened to be reported.
 */
let errorSpy;

// React logs the warning as a format string -- console.error is called with
// "Warning: Failed %s type: %s%s" and the details as separate arguments -- so
// the readable text only exists once every argument is joined. Matching on
// call[0] alone silently matches nothing and the assertion passes vacuously.
function propTypeWarnings() {
  return errorSpy.mock.calls
    .map((call) => call.map((arg) => String(arg)).join(' '))
    .filter(
      (message) =>
        message.includes('Failed %s type') || message.includes('Failed prop type')
    );
}

beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
});

describe('anonymous rendering emits no propType warnings', () => {
  test('the Study Collections view', () => {
    renderWithProviders(<StudyDataExplorer userType={undefined} />);
    expect(screen.getAllByRole('button', { name: /browse files/i }).length).toBeGreaterThan(0);
    expect(propTypeWarnings()).toEqual([]);
  });

  test('the Data Releases view', () => {
    renderWithProviders(<StudyDataExplorer userType={undefined} />);
    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));
    expect(propTypeWarnings()).toEqual([]);
  });

  test('the collection scope bar after a collection loads', async () => {
    const { store } = renderWithProviders(<CollectionScopeBar userType={undefined} />);
    await act(async () => {
      await store.dispatch(actions.selectCollection('quant-id/rat-training-06/c2.0'));
    });
    expect(propTypeWarnings()).toEqual([]);
  });
});

describe('anonymous visitors get no GCS path controls', () => {
  test('the GCP Storage toggle is internal-only', () => {
    renderWithProviders(<StudyDataExplorer userType={undefined} />);
    expect(screen.queryByRole('button', { name: /gcp storage/i })).not.toBeInTheDocument();
  });

  test('internal users do get it', () => {
    renderWithProviders(<StudyDataExplorer userType="internal" />);
    expect(screen.getAllByRole('button', { name: /gcp storage/i }).length).toBeGreaterThan(0);
  });
});
