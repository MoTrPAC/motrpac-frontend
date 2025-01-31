import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PageTitle from '../../lib/ui/pageTitle';
import BrowseDataFilter from '../browseDataFilter';
import SelectiveDataDownloadFileBrowser from './selectiveDataDownloadFileBrowser';

function SelectiveDataDownloads({
  profile,
  filteredFiles,
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
    let titleStr = 'Data Download';
    if (dataDownload.pass1b06DataSelected) {
      titleStr = 'Data Download - Endurance Training Rats';
    }
    if (dataDownload.pass1a06DataSelected) {
      titleStr = 'Data Download - Acute Exercise Rats';
    }
    if (dataDownload.humanPrecovidSedAduDataSelected) {
      titleStr = 'Data Download - Human Sedentary Adults';
    }

    return titleStr;
  }

  // set page summary based on selected data
  function renderStudySummary() {
    let summary = '';
    if (dataDownload.pass1b06DataSelected) {
      summary =
        'Experimental data from endurance trained (1 week, 2 weeks, 4 weeks or 8 weeks) compared to untrained young adult rats (6 months old).';
    }
    if (dataDownload.pass1a06DataSelected) {
      summary =
        'Experimental data from acute exercise study on young adult rats for a comprehensive analysis of the physiological responses following a single exercise session in 6-month-old F344 rats.';
    }
    if (dataDownload.humanPrecovidSedAduDataSelected) {
      summary =
        'Differential analysis results data for differences in changes during the acute bout, comparing the change from pre-exercise baseline at any given timepoint during the acute bout as compared to resting control.';
    }

    return summary;
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
      <PageTitle title={renderPageTitle()} />
      <p className="lead mb-4">{renderStudySummary()}</p>
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

SelectiveDataDownloads.defaultProps = {
  profile: {},
  filteredFiles: [],
};

export default SelectiveDataDownloads;
