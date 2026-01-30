import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import BrowseDataFilter from '../browseDataFilter';
import BundleDatasets from './bundleDatasets';
import BundleDataTypes from './bundleDataTypes';
import actions from '../browseDataActions';
import SelectiveDataDownloads from './selectiveDataDownloads';
import SelectiveDataDownloadsCard from './selectiveDataDownloadsCard';
import ExternalLink from '../../lib/ui/externalLink';

function DataDownloadsMain({
  profile = {},
  filteredFiles,
  activeFilters,
  onChangeFilter,
  onResetFilters,
  handleDownloadRequest,
  downloadRequestResponse,
  waitingForResponse,
  surveySubmitted,
  downloadedData,
}) {
  const dispatch = useDispatch();
  const location = useLocation();

  // anonymous user or authenticated user
  const userType = profile.user_metadata && profile.user_metadata.userType;

  if (location.pathname.startsWith('/data-download/file-browser')) {
    return (
      <SelectiveDataDownloads
        profile={profile}
        filteredFiles={filteredFiles}
        activeFilters={activeFilters}
        onChangeFilter={onChangeFilter}
        onResetFilters={onResetFilters}
        handleDownloadRequest={handleDownloadRequest}
        downloadRequestResponse={downloadRequestResponse}
        waitingForResponse={waitingForResponse}
        selectedData={location.state.selectedData}
      />
    );
  }

  // Custom render page title with info button
  function renderPageTitle() {
    return (
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <div className="page-title">
          <h1 className="mb-0 flex-grow-1">Data Download</h1>
        </div>
        <div className="btn-group show-main-data-download-info-link">
          <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <i className="bi bi-info-circle-fill"></i>
            <span className="ml-1">Show Info</span>
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <h5 className="border-bottom mt-1 mb-2 pb-2">Data types available to download:</h5>
            <ul className="pl-3">
              <li>
                &quot;Raw&quot; results including assay-specific quantitative results, experiment
                metadata and QA/QC reports
              </li>
              <li>
                &quot;Analysis&quot; results including normalized data tables, differential analysis
                results (e.g., log2 fold-change, p-values, adjusted p-values), and
                cross-platform merged metabolomics data tables for named metabolites
              </li>
              <li>Phenotypic data</li>
            </ul>
            <p>
              <span className="font-weight-bold">Note:</span> Raw files are not
              currently available for direct download through the Data Hub portal.
              Please{' '}
              <Link to="/contact">submit your requests to our helpdesk</Link> and
              specify the relevant tissues/assays if you would like to get access
              to the raw files.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="data-download-overview container">
      {renderPageTitle()}
      <div className="browse-data-summary-container row mb-4">
        <div className="col-12">
          <div className="lead mb-2">
            Explore and download MoTrPAC multi-omics datasets, including phenotype, quantitative
            and summary-level results of molecular changes from exercise across multiple tissues. Currently
            available under the
            {' '}
            <Link to="/license">CC BY 4.0 license</Link>
            :
            {' '}
            <ul className="mt-2">
              <li>
                <span className="font-weight-bold">Endurance training in young adult rats study</span> - complete dataset (
                <ExternalLink
                  to="https://www.nature.com/articles/s41586-023-06877-w"
                  label="Nature publication"
                />
                )
              </li>
              <li>
                <span className="font-weight-bold">Acute exercise in human sedentary adults study</span> -
                {' '}
                <Link to="/search">summary-level results</Link>
                {' '}
                representing a subset of participants who underwent an acute exercise bout before the study
                was suspended due to COVID-19.
              </li>
            </ul>
          </div>
            {userType && userType === 'internal' && (
              <p className="lead mb-2">
                The acute exercise in young adult rats study datasets are currently available to consortium
                members only in the early preview phase.
              </p>
            )}
          <p className="lead mb-2">
            For study designs, protocols, and updates on upcoming data releases, visit our
            {' '}
            <Link to="/project-overview">Project Overview</Link>
            {' '}
            page.
          </p>
        </div>
        <div className="col-12 mt-4">
          <h2>Study Data</h2>
          <p>
            Browse and select the data of your interest to download by tissue,
            ome, or assay types. It is recommended to download the phenotypic data
            along with the omics data for a comprehensive analysis. Learn more
            about the
            {' '}
            <Link to="/technical-guides/phenotype">phenotypic data</Link>
            {' '}
            in MoTrPAC studies.
          </p>
          {userType && userType === 'internal' && (
            <div className="bd-callout bd-callout-primary">
              <span className="font-weight-bold">
                Data from the endurance trained young adult rats study are now
                accessible in both v1.0 (RN6) and v2.0 (RN7).
              </span>
            </div>
          )}
          <div className="card-deck mt-4 mb-3 text-center">
            <SelectiveDataDownloadsCard
              cardIcon="pest_control_rodent"
              cardTitle="Young Adult Rats"
              dataSelectHandler={() => dispatch(actions.selectPass1B06Data(userType))}
              selectedData="pass1b-06"
              cssSelector={
                !userType || (userType && userType === 'external')
                  ? 'external-access'
                  : ''
              }
            >
              <h3 className="card-title phase-card-title">
                Endurance Training
              </h3>
              <ul className="list-unstyled mt-3 mb-4 text-muted">
                <li>Male and female animals</li>
                <li>20 tissues</li>
                <li>29 assays across different omes</li>
                <li>5 time points</li>
              </ul>
            </SelectiveDataDownloadsCard>
            {/* pass1a/1c-06 data set */}
            {userType && userType === 'internal' && (
              <SelectiveDataDownloadsCard
                cardIcon="pest_control_rodent"
                cardTitle="Young Adult Rats"
                dataSelectHandler={() => dispatch(actions.selectPass1A06Data())}
                selectedData="pass1a-06"
              >
                <h3 className="card-title phase-card-title">Acute Exercise</h3>
                <ul className="list-unstyled mt-3 mb-4 text-muted">
                  <li>Male and female animals</li>
                  <li>21 tissues</li>
                  <li>30 assays across different omes</li>
                  <li>7 time points</li>
                </ul>
              </SelectiveDataDownloadsCard>
            )}
            {/* human-precovid-sed-adu data set */}
            <SelectiveDataDownloadsCard
              cardIcon="person"
              cardTitle="Human Sedentary Adults"
              dataSelectHandler={() => userType && userType === 'internal' ? dispatch(actions.selectHumanPreCovidSedAduData()) : dispatch(actions.selectHumanPreCovidSedAduExternalData())}
              selectedData="human-precovid-sed-adu"
              cssSelector={
              !userType || (userType && userType === 'external')
                ? 'external-access'
                : ''
              }
              >
              <h3 className="card-title phase-card-title">
                Acute Exercise
              </h3>
              <ul className="list-unstyled mt-3 mb-4 text-muted">
                <li>Pre-Suspension</li>
                <li>4 tissues</li>
                <li>22 assays across different omes</li>
                {import.meta.env.VITE_DATA_RELEASE_README ? (
                  <li>
                    <a href="https://d1yw74buhe0ts0.cloudfront.net/docs/MoTrPAC_Human_PreSuspension_Sed_Adu_Analysis_Data_Release_Notes.pdf" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-file-earmark-fill mr-1" />
                      <span>Data Release Notes</span>
                    </a>
                  </li>
                ) : null}
              </ul>
            </SelectiveDataDownloadsCard>
          </div>
        </div>
        {/* Pre-bundled data sets */}
        <div className="col-12 mt-2">
          <h2>Pre-bundled Data Sets</h2>
          {/* nav tabs */}
          <ul className="nav nav-tabs" id="bundleDatasetsTab" role="tablist">
            <li className="nav-item font-weight-bold" role="presentation">
              <a
                className="nav-link active"
                id="pass1b_06_bundle_datasets_tab"
                data-toggle="pill"
                href="#pass1b_06_bundle_datasets"
                role="tab"
                aria-controls="pass1b_06_bundle_datasets"
                aria-selected="true"
              >
                Endurance Training in Rats
              </a>
            </li>
            {userType && userType === 'internal' && (
              <li className="nav-item font-weight-bold" role="presentation">
                <a
                  className="nav-link"
                  id="pass1a_06_bundle_datasets_tab"
                  data-toggle="pill"
                  href="#pass1a_06_bundle_datasets"
                  role="tab"
                  aria-controls="pass1a_06_bundle_datasets"
                  aria-selected="false"
                >
                  Acute Exercise in Rats
                </a>
              </li>
            )}
            <li className="nav-item font-weight-bold" role="presentation">
              <a
                className="nav-link"
                id="human_sed_adu_bundle_datasets_tab"
                data-toggle="pill"
                href="#human_sed_adu_bundle_datasets"
                role="tab"
                aria-controls="human_sed_adu_bundle_datasets"
                aria-selected="false"
              >
                Acute Exercise in Humans
              </a>
            </li>
          </ul>
          {/* tab panes */}
          <div className="tab-content mt-3">
            <div
              className="tab-pane fade show active"
              id="pass1b_06_bundle_datasets"
              role="tabpanel"
              aria-labelledby="pass1b_06_bundle_datasets_tab"
            >
              <BundleDatasets
                profile={profile}
                bundleDatasets={BundleDataTypes.pass1b_06}
                surveySubmitted={surveySubmitted}
                downloadedData={downloadedData}
              />
            </div>
            {userType && userType === 'internal' && (
              <div
                className="tab-pane fade"
                id="pass1a_06_bundle_datasets"
                role="tabpanel"
                aria-labelledby="pass1a_06_bundle_datasets_tab"
              >
                <BundleDatasets
                  profile={profile}
                  bundleDatasets={BundleDataTypes.pass1a_06}
                  surveySubmitted={surveySubmitted}
                  downloadedData={downloadedData}
                />
              </div>
            )}
            <div
              className="tab-pane fade"
              id="human_sed_adu_bundle_datasets"
              role="tabpanel"
              aria-labelledby="human_sed_adu_bundle_datasets_tab"
            >
              <BundleDatasets
                profile={profile}
                bundleDatasets={userType && userType === 'internal' ? BundleDataTypes.human_sed_adu_internal : BundleDataTypes.human_sed_adu_external}
                surveySubmitted={surveySubmitted}
                downloadedData={downloadedData}
              />
              <div className="bd-callout bd-callout-primary mt-3">
                <span className="font-weight-bold">
                  <i className="bi bi-envelope-paper mr-2 text-primary" />
                  <span>
                    Be sure to{' '}
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScjGxwsHDDsE4P4j1VNvIUR73cEyh9SJrofxuQyHqucl0GhBg/viewform" target="_blank" rel="noopener noreferrer">
                      subscribe
                    </a>{' '}
                    to receive notifications about future data updates for the acute exercise in human sedentary adults study!
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Additional data information */}
        {userType && userType === 'internal' ? (
          <div className="browse-data-summary-content col-12 col-md-12">
            <div className="bd-callout bd-callout-info">
              <h4>Additional Information</h4>
              <p>
                The currently available young adult rats experimental data for
                acute exercise and endurance training include all tissues and
                assays from the very last consortium data release, as well as
                additional tissues and assays made available afterwards. The
                phenotypic data sets have also been updated since then.
              </p>
              <p>
                Please refer to this
                {' '}
                <a
                  href="https://docs.google.com/document/d/1bdXcYQLZ65GpJKTjf9XwRxhrfHJSD9NIqCxhG6icL8U"
                  className="inline-link-with-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  README
                  <i className="material-icons readme-file-icon">
                    description
                  </i>
                </a>
                {' '}
                document for the data included in the very last consortium
                data release.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

DataDownloadsMain.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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
  surveySubmitted: PropTypes.bool.isRequired,
  downloadedData: PropTypes.bool.isRequired,
};

export default DataDownloadsMain;
