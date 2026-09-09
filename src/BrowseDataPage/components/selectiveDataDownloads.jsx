import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BrowseDataFilter from '../browseDataFilter';
import SelectiveDataDownloadFileBrowser from './selectiveDataDownloadFileBrowser';
import CollectionScopeBar from './collectionScopeBar';

function SelectiveDataDownloads({
  profile = {},
  filteredFiles = [],
  activeFilters,
  onChangeFilter,
  onResetFilters,
  handleDownloadRequest,
  downloadRequestResponse,
  waitingForResponse,
}) {
  /**
   * The title and summary are fixed.
   *
   * They used to be rewritten from whichever study was in scope, which made the
   * page rename itself on every facet click, and could only be honest while the
   * browser held exactly one study. The browser is now a destination in its own
   * right -- the cards on /data-download are the per-study overview -- so it is
   * named for what it is.
   *
   * The summary carries what the "Show Info" dropdown used to hide: the same
   * page cannot both hide its description behind a toggle and claim to be a
   * self-contained entry point.
   */
  function renderPageTitle() {
    return (
      <div className="page-title">
        <h1 className="mb-0">Data Download - File Browser</h1>
      </div>
    );
  }

  function renderSummary() {
    return (
      <>
        <p className="lead mb-2">
          Browse and download individual data files from across MoTrPAC. Use the filters to
          narrow by study, collection, tissue, ome or assay, then select the files you want.
          For a study-by-study overview of what has been released, see the{' '}
          <Link to="/data-download" className="link" onClick={onResetFilters}>
            data collections
          </Link>
          .
        </p>
        <p className="mb-0">
          <b>Quant-ID</b> files hold the measured values for each assay: MS intensities for
          untargeted metabolomics, absolute concentrations for targeted metabolomics, reporter
          ion intensities and log ratios for proteomics, peak counts for ATAC-seq, CpG
          methylation counts for RRBS, and protein concentrations for immunoassay (Luminex).
          {' '}
          <b>Analysis</b> files hold normalized data tables and differential analysis results
          such as log2 fold-changes, p-values and adjusted p-values. <b>Phenotype</b> files
          hold the accompanying subject, sample and QC measurements.
        </p>
      </>
    );
  }

  return (
    <div className="data-download-selective-files">
      <div className="link link-back mb-2">
        <Link
          to="/data-download"
          className="d-flex align-items-center font-weight-bold"
          onClick={onResetFilters}
        >
          <span className="material-icons mr-1">arrow_back</span>
          <span>Back</span>
        </Link>
      </div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        {renderPageTitle()}
      </div>
      <div className="browse-data-summary-container mb-4">{renderSummary()}</div>
      <CollectionScopeBar userType={profile.user_metadata && profile.user_metadata.userType} />
      {/*
        No `row`/`tab-content` wrapper here. `.tab-content` carried no `col-*`
        class, so as a flex item in a `.row` it defaulted to `flex: 0 1 auto` and
        sized to its content rather than filling the width -- which is why the
        table stopped short of the right edge while the status line above it did
        not. It was a leftover from the tab UI that was removed (see the
        commented-out `.nav.nav-tabs` block in browseData.scss); the file browser
        renders its own `.row` with the `col-md-3` / `col-md-9` split.
        `.browse-data-container` stays because the filter-panel styles hang off it.
      */}
      <div className="browse-data-container">
        <SelectiveDataDownloadFileBrowser
          profile={profile}
          filteredFiles={filteredFiles}
          activeFilters={activeFilters}
          onChangeFilter={onChangeFilter}
          onResetFilters={onResetFilters}
          handleDownloadRequest={handleDownloadRequest}
          downloadRequestResponse={downloadRequestResponse}
          waitingForResponse={waitingForResponse}
        />
      </div>
    </div>
  );
}

SelectiveDataDownloads.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({})),
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
      userid: PropTypes.string,
    }),
  }),
  activeFilters: BrowseDataFilter.propTypes.activeFilters.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

export default SelectiveDataDownloads;
