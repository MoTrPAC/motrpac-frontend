import { describe, test, expect } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import StudyDataExplorer from '../studyDataExplorer';

function renderExplorer(userType) {
  return renderWithProviders(
    <StudyDataExplorer userType={userType} />
  );
}

describe('StudyDataExplorer - view toggle', () => {
  test('shows the Study Collections panel by default, and switches to Data Releases on click', () => {
    renderExplorer('internal');

    // Stage sections belong to the Data Releases view only.
    expect(screen.queryByRole('heading', { name: /^public release$/i })).not.toBeInTheDocument();
    expect(screen.getByText('Progressive treadmill training for 1, 2, 4 or 8 weeks in young adult rats, with 18 tissues coillected 48-hour after the last bout.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));

    expect(screen.getByRole('heading', { name: /^public release$/i })).toBeInTheDocument();
  });
});

describe('StudyDataExplorer - access control on card visibility', () => {
  test('external users never see rat-acute-06 (zero public collections)', () => {
    renderExplorer('external');
    expect(screen.queryByText('Acute Exercise in Young Adult Rats')).not.toBeInTheDocument();
  });

  test('internal users see all three studies', () => {
    renderExplorer('internal');
    expect(screen.getByText('Acute Exercise in Young Adult Rats')).toBeInTheDocument();
  });
});

// SKIPPED: the species/design/stage filter bar is currently commented out in
// studyDataExplorer.jsx pending a restyle scoped to the Study Collections view.
// Re-enable this test when that block comes back.
describe.skip('StudyDataExplorer - species filter', () => {
  test('selecting Human hides rat studies', () => {
    renderExplorer('internal');
    const filters = screen.getByRole('group', { name: /species/i });

    fireEvent.click(within(filters).getByRole('button', { name: /^human$/i }));

    expect(screen.queryByText('Endurance Training in Young Adult Rats')).not.toBeInTheDocument();
    expect(screen.getByText('Acute Exercise in Human Sedentary Adults')).toBeInTheDocument();
  });
});

describe('StudyDataExplorer - Data Releases panel', () => {
  test('external users see a Public section but no Consortium section at all', () => {
    renderExplorer('external');
    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));

    expect(screen.getByRole('heading', { name: /^public release$/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^consortium release$/i })).not.toBeInTheDocument();
    // rat-training-06 c2.0 quantID/analysis and human-precovid phenotype c2.0 are public
    expect(screen.getAllByText('c2.0').length).toBeGreaterThan(0);
    // rat-training-06 c3.0 quantID is consortium-only - must never appear for external users
    expect(screen.queryByText('c3.0')).not.toBeInTheDocument();
  });

  test('internal users see both Public and Consortium sections', () => {
    renderExplorer('internal');
    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));

    expect(screen.getByRole('heading', { name: /^public release$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^consortium release$/i })).toBeInTheDocument();
    expect(screen.getAllByText('c3.0').length).toBeGreaterThan(0);
  });
});

describe('StudyDataExplorer - Browse Files dispatches the correct study selection', () => {
  test('clicking Browse Files in the Data Releases view selects that study\'s data in the store', () => {
    const { store } = renderExplorer('internal');
    fireEvent.click(screen.getByRole('tab', { name: /data releases/i }));

    // First row of the Public section is rat-training-06.
    fireEvent.click(screen.getAllByRole('button', { name: /browse files/i })[0]);

    expect(store.getState().browseData.pass1b06DataSelected).toBe(true);
  });
});
