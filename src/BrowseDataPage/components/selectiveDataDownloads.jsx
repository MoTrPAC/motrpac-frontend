import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PageTitle from '../../lib/ui/pageTitle';
import BrowseDataFilter from '../browseDataFilter';
import SelectiveDataDownloadFileBrowser from './selectiveDataDownloadFileBrowser';

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
  const dataDownload = useSelector((state) => state.browseData);

  // set page title based on selected data
  function renderPageTitle() {
    if (dataDownload.pass1a06DataSelected) {
      return (
        <div className="page-title">
          <h1 className="mb-0">Data Download - Acute Exercise Rats</h1>
        </div>
      );
    }
    if (dataDownload.humanPrecovidSedAduDataSelected) {
      return (
        <div className="page-title">
          <h1 className="mb-0">Data Download - Human Sedentary Adults</h1>
        </div>
      )
    }

    return (
      <>
        <div className="page-title">
          <h1 className="mb-0 flex-grow-1">Data Download - Endurance Training Rats</h1>
        </div>
        <button type="button" className="btn btn-link show-data-download-info-link">
          <i className="bi bi-info-circle-fill"></i>
          <span className="ml-1">Show Info</span>
        </button>
      </>
    );
  }

  // set page summary based on selected data
  function renderStudySummary() {
    if (dataDownload.pass1a06DataSelected) {
      return (
        <p className="lead">
          Experimental data from acute exercise study on young adult rats for a comprehensive analysis of the physiological responses following a single exercise session in 6-month-old F344 rats.
        </p>
      );
    }
    if (dataDownload.humanPrecovidSedAduDataSelected) {
      return (
        <p className="lead">
          Differential analysis results data for differences in changes during the acute bout, comparing the change from pre-exercise baseline at any given timepoint during the acute bout as compared to resting control.
        </p>
      );
    }

    return (
      <p className="lead">
        This study investigates the long-term adaptive effects of endurance training in young
        adult rats by analyzing multi-omics profiles across 18 tissues and blood at 1, 2, 4,
        and 8 weeks of treadmill training.{' '}
        <Link to="/project-overview#endurance-training" className="link">
          Learn more
        </Link>
        {' '}
        about this study.
      </p>
    );
  }

  return (
    <div className="data-download-selective-files">
      <div className="link link-back mb-1">
        <Link
          to="/data-download"
          className="d-flex align-items-center"
          onClick={onResetFilters}
        >
          <span className="material-icons">arrow_back</span>
          <span>Back</span>
        </Link>
      </div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        {renderPageTitle()}
      </div>
      <div className="browse-data-summary-container mb-4">{renderStudySummary()}</div>
      <div className="browse-data-container row">
        <div className="tab-content mx-3">
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
