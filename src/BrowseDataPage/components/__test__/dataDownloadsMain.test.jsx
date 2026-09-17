import { describe, test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../testUtils/test-utils';
import DataDownloadsMain from '../dataDownloadsMain';
import { defaultBrowseDataState } from '../../browseDataReducer';

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
  test('external users do not see a consortium-only study, internal users do - confirms userType reaches StudyDataExplorer', () => {
    // The Human Main Study replaced rat-acute-06 as the consortium-only example
    // when rat-acute c2.0/c4.0 were released publicly on 2026-09-08.
    renderMain('external');
    expect(screen.queryByText('Human Main Study')).not.toBeInTheDocument();

    renderMain('internal');
    expect(screen.getByText('Human Main Study')).toBeInTheDocument();
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

describe('DataDownloadsMain - data updates notice', () => {
  function renderMain(userType) {
    return renderWithProviders(
      <DataDownloadsMain
        profile={userType ? { user_metadata: { userType } } : {}}
        filteredFiles={[]}
        activeFilters={defaultBrowseDataState.activeFilters}
        onChangeFilter={() => {}}
        onResetFilters={() => {}}
        handleDownloadRequest={() => {}}
        downloadRequestResponse=""
        waitingForResponse={false}
        surveySubmitted={false}
        downloadedData={false}
      />
    );
  }

  test('sits at page level, above the tabs, not inside one study’s card', () => {
    const { container } = renderMain('internal');
    const notice = container.querySelector('.data-updates-notice');
    expect(notice).toBeInTheDocument();

    const tabs = container.querySelector('.study-data-explorer-tabs');
    // Document order: the notice precedes the explorer it applies to.
    expect(notice.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('its wording is no longer tied to one study', () => {
    const { container } = renderMain('internal');
    const notice = container.querySelector('.data-updates-notice');
    expect(notice.textContent).toMatch(/future MoTrPAC data updates/i);
    expect(notice.textContent).not.toMatch(/human sedentary adults/i);
  });

  test('anonymous visitors see it too', () => {
    const { container } = renderMain(undefined);
    expect(container.querySelector('.data-updates-notice')).toBeInTheDocument();
  });

  test('the subscribe link is external and safe', () => {
    const { container } = renderMain('internal');
    const link = container.querySelector('.data-updates-notice a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.textContent).toMatch(/subscribe/i);
  });
});
