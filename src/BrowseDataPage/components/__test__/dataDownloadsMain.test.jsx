import { describe, test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import DataDownloadsMain from '../dataDownloadsMain';

const requiredProps = {
  filteredFiles: [],
  activeFilters: {
    tissue_name: [],
    assay: [],
    omics: [],
    category: [],
    reference_genome: [],
  },
  onChangeFilter: vi.fn(),
  onResetFilters: vi.fn(),
  handleDownloadRequest: vi.fn(),
  downloadRequestResponse: '',
  waitingForResponse: false,
  surveySubmitted: false,
  downloadedData: false,
};

function renderMain(userType) {
  return renderWithProviders(
    <DataDownloadsMain {...requiredProps} profile={{ user_metadata: { userType } }} />
  );
}

describe('DataDownloadsMain - Study Data card access gating (integration smoke test)', () => {
  test('external users do not see rat-acute-06 (consortium-only), internal users do - confirms userType reaches StudyDataExplorer', () => {
    renderMain('external');
    expect(screen.queryByText('Acute Exercise in Young Adult Rats')).not.toBeInTheDocument();

    renderMain('internal');
    expect(screen.getByText('Acute Exercise in Young Adult Rats')).toBeInTheDocument();
  });
});

describe('DataDownloadsMain - redundant RN6/RN7 callout removed', () => {
  test('the standalone internal-only RN6/RN7 callout no longer renders, now that genome badges are on the card', () => {
    renderMain('internal');
    expect(
      screen.queryByText(/now accessible in both v1\.0 \(RN6\) and v2\.0 \(RN7\)/i)
    ).not.toBeInTheDocument();
  });
});
