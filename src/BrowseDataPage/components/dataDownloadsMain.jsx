import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PageTitle from '../../lib/ui/pageTitle';
import ExternalLink from '../../lib/ui/externalLink';
import BrowseDataFilter from '../browseDataFilter';
import DataTypeInfo from './dataTypeInfo';
import BundleDatasets from './bundleDatasets';
import BundleDataTypes from './bundleDataTypes';
import actions from '../browseDataActions';
import SelectiveDataDownloads from './selectiveDataDownloads';
import SelectiveDataDownloadsCard from './selectiveDataDownloadsCard';

function DataDownloadsMain({
  profile,
  filteredFiles,
  fetching,
  activeFilters,
  onChangeFilter,
  onResetFilters,
  handleDownloadRequest,
  downloadRequestResponse,
  waitingForResponse,
}) {
  const dispatch = useDispatch();
  const location = useLocation();

  // anonymous user or authenticated user
  const userType = profile.user_metadata && profile.user_metadata.userType;

  if (location.pathname === '/data-download/file-browser') {
    return (
      <SelectiveDataDownloads
        profile={profile}
        filteredFiles={filteredFiles}
        fetching={fetching}
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
          <p className="lead">
            Browse and download the rat{' '}
            {userType && userType === 'internal' && 'or human '}study data
            consisting of both quantitative results and analyses that defining
            the molecular changes that occur with training and exercise across
            tissues.
          </p>
          <div className="bd-callout bd-callout-info">
            Learn more about MoTrPAC studies:
            <ul className="mb-0">
              <li>
                <ExternalLink
                  to="https://www.cell.com/cell/fulltext/S0092-8674(20)30691-7"
                  label="First published paper of the entire MoTrPAC study"
                />
              </li>
              <li>
                <ExternalLink
                  to="https://www.biorxiv.org/content/10.1101/2022.09.21.508770v1"
                  label="MoTrPAC Endurance Exercise Training Animal Study Landscape Preprint"
                />
              </li>
              <li>
                <Link to="/methods">Project overview</Link> covering the study
                design and study protocols
              </li>
            </ul>
          </div>
        </div>
        <div className="col-12 mt-3">
          <h2>Study Data</h2>
          <p>
            Browse and find the data of your interest by tissue, ome, or assay
            types.
          </p>
          <div className="card-deck mb-3 text-center">
            <SelectiveDataDownloadsCard
              cardIcon="pest_control_rodent"
              cardTitle="Young Adult Rats"
              dataSelectHandler={() => dispatch(actions.selectPass1B06Data())}
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
                <li>Total of 60 male and female animals</li>
                <li>20 tissues</li>
                <li>29 assays across different omes</li>
                <li>4 time points</li>
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
                  <li>Total of 70 male and female animals</li>
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
                dataSelectHandler={() =>
                  dispatch(actions.selectHumanPreCovidSedAduData())
                }
                selectedData="human-precovid-sed-adu"
              >
                <h3 className="card-title phase-card-title">
                  Pre-COVID Sedentary
                </h3>
                <ul className="list-unstyled mt-3 mb-4 text-muted">
                  <li>175 adult participants</li>
                  <li>4 tissues</li>
                  <li>22 assays across different omes</li>
                  <li>Acute exercise</li>
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
                tagColor="badge-success"
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
                  tagColor="badge-info"
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
                  tagColor="badge-warning"
                />
              </div>
            )}
          </div>
        </div>
        {/* Additional data information */}
        <DataTypeInfo grid="col-6 col-md-6" />
        <div className="browse-data-summary-content col-6 col-md-6">
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
              Please refer to this{' '}
              <a
                href="https://docs.google.com/document/d/1bdXcYQLZ65GpJKTjf9XwRxhrfHJSD9NIqCxhG6icL8U"
                className="inline-link-with-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                README
                <i className="material-icons readme-file-icon">description</i>
              </a>{' '}
              document for the data included in the very last consortium data
              release.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

DataDownloadsMain.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetching: PropTypes.bool.isRequired,
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

DataDownloadsMain.defaultProps = {
  profile: {},
};

export default DataDownloadsMain;
