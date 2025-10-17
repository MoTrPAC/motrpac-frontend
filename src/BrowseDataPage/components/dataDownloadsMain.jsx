import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PageTitle from '../../lib/ui/pageTitle';
import BrowseDataFilter from '../browseDataFilter';
import DataTypeInfo from './dataTypeInfo';
import BundleDatasets from './bundleDatasets';
import BundleDataTypes from './bundleDataTypes';
import actions from '../browseDataActions';
import SelectiveDataDownloads from './selectiveDataDownloads';
import SelectiveDataDownloadsCard from './selectiveDataDownloadsCard';

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

  return (
    <div className="data-download-overview container">
      <PageTitle title="Data Download" />
      <div className="browse-data-summary-container row mb-4">
        <div className="col-12">
          <p className="lead mb-2">
            Explore and download the MoTrPAC multi-omics datasets, which
            includes quantitative results and analyses of molecular changes from
            exercise across tissues. Currently, the complete young adult rat endurance
            training dataset is publicly available and provided under the
            {' '}
            <Link to="/license">CC BY 4.0 license</Link>
            .
            {' '}
            {userType && userType === 'internal'
              ? 'The young rat acute exercise and human precovid sedentary adult datasets are currently available to consortium members only in the early preview phase. '
              : null}
            For a summary of all the ongoing studies in MoTrPAC (data available
            soon), please visit our
            {' '}
            <Link to="/project-overview">Project Overview</Link>
            .
          </p>
          <div className="row">
            <DataTypeInfo grid="col-7 col-md-7" />
            <div className="browse-data-summary-content col-5 col-md-5">
              <div className="bd-callout bd-callout-info">
                <h4>Learn more about MoTrPAC studies</h4>
                <ul className="mb-0">
                  <li>
                    <a
                      href="https://www.nature.com/articles/s41586-023-06877-w"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      MoTrPAC Endurance Exercise Training Animal Study
                    </a>
                    {' '}
                    in Nature
                  </li>
                  <li>
                    <Link to="/project-overview">Project overview</Link>
                    {' '}
                    covering the study design and study protocols
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-2">
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
          <div className="bd-callout bd-callout-primary">
            <span className="font-weight-bold">
              The endurance trained young adult rats study data are now available for
              both RN6 and RN7 reference genomes.
            </span>
          </div>
          <div className="card-deck mb-3 text-center">
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
            {userType && userType === 'internal' && (
              <SelectiveDataDownloadsCard
                cardIcon="person"
                cardTitle="Human Adults"
                dataSelectHandler={() => dispatch(actions.selectHumanPreCovidSedAduData())}
                selectedData="human-precovid-sed-adu"
              >
                <h3 className="card-title phase-card-title">
                  Pre-COVID Sedentary
                </h3>
                <ul className="list-unstyled mt-3 mb-4 text-muted">
                  <li>Acute exercise adult participants</li>
                  <li>4 tissues</li>
                  <li>22 assays across different omes</li>
                  <li>
                    <a href={import.meta.env.VITE_DATA_RELEASE_README} target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-file-earmark-fill mr-1" />
                      <span>Release README</span>
                    </a>
                  </li>
                </ul>
              </SelectiveDataDownloadsCard>
            )}
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
                Endurance Training Rats
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
                  Acute Exercise Rats
                </a>
              </li>
            )}
            {userType && userType === 'internal' && (
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
                  Human Sedentary Adults
                </a>
              </li>
            )}
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
            {userType && userType === 'internal' && (
              <div
                className="tab-pane fade"
                id="human_sed_adu_bundle_datasets"
                role="tabpanel"
                aria-labelledby="human_sed_adu_bundle_datasets_tab"
              >
                <BundleDatasets
                  profile={profile}
                  bundleDatasets={BundleDataTypes.human_sed_adu}
                  surveySubmitted={surveySubmitted}
                  downloadedData={downloadedData}
                />
              </div>
            )}
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
