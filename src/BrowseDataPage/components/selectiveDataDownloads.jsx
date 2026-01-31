import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
    let title = '';
    let showInfo = false;

    if (dataDownload.pass1a06DataSelected) {
      title = 'Data Download - Acute Exercise Rats';
    } else if (dataDownload.humanPrecovidSedAduDataSelected) {
      title = 'Data Download - Human Sedentary Adults (Pre-Suspension)';
    } else {
      title = 'Data Download - Endurance Training Rats';
      showInfo = true;
    }

    return (
      <>
        <div className="page-title">
          <h1 className={`mb-0 ${showInfo ? 'flex-grow-1' : ''}`}>{title}</h1>
        </div>
        {showInfo && (
          <div className="btn-group show-data-download-info-link">
            <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-info-circle-fill"></i>
              <span className="ml-1">Show Info</span>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <p>Data available for download on this page includes:</p>
              <h6 className="border-bottom mb-2 pb-2">Raw &quot;Results&quot;</h6>
              <ul className="pl-3">
                <li><b>Untargeted Metabolomics:</b> MS intensities</li>
                <li><b>Targeted Metabolomics</b>: Absolute concentrations</li>
                <li><b>Proteomics:</b> Reporter ion intensities and log ratios</li>
                <li><b>ATAC-seq:</b> Peak counts</li>
                <li><b>RRBS:</b> CpG methylation counts (or methylation beta values)</li>
                <li><b>Immunoassay (Luminex):</b> Protein concentrations</li>
              </ul>
              <h6 className="border-bottom mb-2 pb-2">&quot;Analysis&quot; Results</h6>
              <ul className="pl-3">
                <li>Normalized data tables</li>
                <li>Differential analysis results (e.g., log2 fold-change, p-values, adjusted p-values)</li>
              </ul>
            </div>
          </div>
        )}
      </>
    );
  }

  // set page summary based on selected data
  function renderStudySummary() {
    if (dataDownload.pass1a06DataSelected) {
      return (
        <p className="lead">
          Experimental data from acute exercise study on young adult rats for a comprehensive
          analysis of the physiological responses following a single exercise session in
          6-month-old F344 rats.
        </p>
      );
    }
    if (dataDownload.humanPrecovidSedAduDataSelected) {
      return (
        <p className="lead">
          The data included here are summary-level results for differences in changes during
          the acute bout, comparing the change from pre-exercise baseline at any given
          timepoint during the acute bout as compared to resting control. This is an initial
          set of human data representing a subset of sedentary adults who underwent an acute
          exercise bout before the study was suspended due to COVID-19. Please refer to the
          {' '}
          <a href="https://d1yw74buhe0ts0.cloudfront.net/docs/MoTrPAC_Human_PreSuspension_Sed_Adu_Analysis_Data_Release_Notes.pdf" target="_blank" rel="noopener noreferrer">
            Data Release Notes
          </a>
          {' '}
          for more information on this dataset.
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
