import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';
import TimewiseResultsTable from './timewiseTable';
import TrainingResultsTable from './trainingResultsTable';
import EmbargoExtension from '../lib/embargoExtension';
import SearchActions from './searchActions';
import BrowseDataActions from '../BrowseDataPage/browseDataActions';
import DataStatusActions from '../DataStatusPage/dataStatusActions';
import SearchResultFilters from './deaSearchResultFilters';
import AnimatedLoadingIcon from '../lib/ui/loading';
import { searchParamsDefaultProps, searchParamsPropType } from './sharedlib';
import FeatureLinks from './featureLinks';
import IconSet from '../lib/iconSet';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

export function SearchPage({
  profile,
  searchResults,
  scope,
  searching,
  searchError,
  searchParams,
  changeParam,
  changeResultFilter,
  handleSearch,
  resetSearch,
  downloadResults,
  downloading,
  downloadError,
  handleSearchDownload,
  handleDataFetch,
  handleQCDataFetch,
  allFiles,
  lastModified,
  enabledFilters,
}) {
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Function to map array of keys to each array of values for each row
  function mapKeyToValue(indexObj) {
    const newArray = [];
    if (indexObj && indexObj.headers && indexObj.data) {
      const keys = indexObj.headers;
      const rows = indexObj.data;
      rows.forEach((row) => {
        const newObj = {};
        row.forEach((value, index) => {
          newObj[keys[index]] = value;
        });
        newArray.push(newObj);
      });
    }

    return newArray;
  }

  const timewiseResults = [];
  const trainingResults = [];
  if (searchResults.result && Object.keys(searchResults.result).length > 0) {
    Object.keys(searchResults.result).forEach((key) => {
      if (key.indexOf('timewise') > -1) {
        timewiseResults.push(...mapKeyToValue(searchResults.result[key]));
      } else if (key.indexOf('training') > -1) {
        trainingResults.push(...mapKeyToValue(searchResults.result[key]));
      }
    });
  }

  // render feature links
  function renderFeatureLinks() {
    if (
      !searching &&
      !searchError &&
      !searchResults.result &&
      !searchResults.errors
    ) {
      return (
        <FeatureLinks
          handleDataFetch={handleDataFetch}
          handleQCDataFetch={handleQCDataFetch}
          allFiles={allFiles}
          lastModified={lastModified}
        />
      );
    }
    return null;
  }

  // render placeholder text in primary search input field
  function renderPlaceholder() {
    if (searchParams.ktype === 'protein') {
      return 'Example: NP_001000006.1, NP_001001508.2, NP_001005898.3';
    }
    if (searchParams.ktype === 'metab') {
      return 'Example: 8,9-EpETrE, C18:1 LPC plasmalogen B';
    }
    return 'Example: BRD2, SMAD3, ID1';
  }

  return (
    <div className="searchPage px-3 px-md-4 mb-3">
      <form id="searchForm" name="searchForm">
        {userType && userType === 'external' && <EmbargoExtension />}
        <PageTitle title="Search differential abundance data" />
        <div className="search-content-container">
          <div className="search-summary-container row mb-4">
            <div className="lead col-12">
              Search by genes, protein IDs, or metabolite names to examine the
              training response of its related molecules in 6-month old rats'
              endurance training (PASS1B) data.{' '}
              <span className="font-weight-bold">
                Multiple search terms MUST be separated by comma and space.
                Examples: "NP_001000006.1, NP_001001508.2, NP_001005898.3" or
                "8,9-EpETrE, C18:1 LPC plasmalogen B".
              </span>
            </div>
          </div>
          <div className="es-search-ui-container d-flex align-items-center w-100">
            <RadioButton
              changeParam={changeParam}
              ktype={searchParams.ktype}
              resetSearch={resetSearch}
            />
            <div className="search-box-input-group d-flex align-items-center flex-grow-1">
              <input
                type="text"
                id="keys"
                name="keys"
                className="form-control search-input-kype flex-grow-1"
                placeholder={renderPlaceholder()}
                value={searchParams.keys}
                onChange={(e) => changeParam('keys', e.target.value)}
              />
              <PrimaryOmicsFilter
                omics={searchParams.omics}
                toggleOmics={changeParam}
              />
              <div className="search-button-group d-flex justify-content-end ml-4">
                <button
                  type="submit"
                  className="btn btn-primary search-submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearch(searchParams, 'all');
                  }}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-secondary search-reset ml-2"
                  onClick={() => resetSearch('all')}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {userType && userType === 'internal' && renderFeatureLinks()}
          <div className="search-body-container mt-4 mb-2">
            {searching && <AnimatedLoadingIcon isFetching={searching} />}
            {!searching && searchError ? (
              <div className="alert alert-danger">{searchError}</div>
            ) : null}
            {!searching &&
            !searchResults.result &&
            searchResults.errors &&
            scope === 'all' ? (
              <div className="alert alert-warning">
                {searchResults.errors} Please modify your search parameters and
                try again.
              </div>
            ) : null}
            {!searching &&
            (searchResults.result ||
              (searchResults.errors && scope === 'filters')) ? (
              <div className="search-results-wrapper-container row">
                <div className="search-sidebar-container col-md-3">
                  <SearchResultFilters
                    searchParams={searchParams}
                    changeResultFilter={changeResultFilter}
                    handleSearch={handleSearch}
                    resetSearch={resetSearch}
                    enabledFilters={enabledFilters}
                  />
                </div>
                <div className="tabbed-content col-md-9">
                  {/* nav tabs */}
                  <ul className="nav nav-tabs" id="dataTab" role="tablist">
                    <li
                      className="nav-item font-weight-bold"
                      role="presentation"
                    >
                      <a
                        className="nav-link active"
                        id="timewise_dea_tab"
                        data-toggle="pill"
                        href="#timewise_dea"
                        role="tab"
                        aria-controls="timewise_dea"
                        aria-selected="true"
                      >
                        Timewise
                      </a>
                    </li>
                    <li
                      className="nav-item font-weight-bold"
                      role="presentation"
                    >
                      <a
                        className="nav-link"
                        id="training_dea_tab"
                        data-toggle="pill"
                        href="#training_dea"
                        role="tab"
                        aria-controls="training_dea"
                        aria-selected="false"
                      >
                        Training
                      </a>
                    </li>
                  </ul>
                  {/* tab panes */}
                  <div className="tab-content mt-3">
                    <div
                      className="tab-pane fade show active"
                      id="timewise_dea"
                      role="tabpanel"
                      aria-labelledby="timewise_dea_tab"
                    >
                      {timewiseResults.length ? (
                        <TimewiseResultsTable
                          timewiseData={timewiseResults}
                          searchParams={searchParams}
                          handleSearchDownload={handleSearchDownload}
                        />
                      ) : (
                        scope === 'filters' && (
                          <p className="mt-4">
                            {searchResults.errors &&
                            searchResults.errors.indexOf('No results found') !==
                              -1 ? (
                              <span>
                                No matches found for the selected filters.
                                Please refer to the{' '}
                                <Link to="/summary">Summary Table</Link> for
                                data that are available.
                              </span>
                            ) : (
                              searchResults.errors
                            )}
                          </p>
                        )
                      )}
                    </div>
                    <div
                      className="tab-pane fade"
                      id="training_dea"
                      role="tabpanel"
                      aria-labelledby="training_dea_tab"
                    >
                      {trainingResults.length ? (
                        <TrainingResultsTable
                          trainingData={trainingResults}
                          searchParams={searchParams}
                          handleSearchDownload={handleSearchDownload}
                        />
                      ) : (
                        scope === 'filters' && (
                          <p className="mt-4">
                            {searchResults.errors &&
                            searchResults.errors.indexOf('No results found') !==
                              -1 ? (
                              <span>
                                No matches found for the selected filters.
                                Please refer to the{' '}
                                <Link to="/summary">Summary Table</Link> for
                                data that are available.
                              </span>
                            ) : (
                              searchResults.errors
                            )}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  <ResultsDownloadModal
                    downloadPath={downloadResults.path}
                    downloadError={downloadError}
                    downloading={downloading}
                    profile={profile}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}

// Radio buttons for selecting the search context
function RadioButton({ changeParam, ktype, resetSearch }) {
  return (
    <div className="search-context">
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="ktype"
          id="inlineRadioGene"
          value="gene"
          checked={ktype === 'gene'}
          onChange={(e) => {
            resetSearch('all');
            changeParam('ktype', e.target.value);
          }}
        />
        <label className="form-check-label" htmlFor="inlineRadioGene">
          Gene
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="ktype"
          id="inlineRadioProtein"
          value="protein"
          checked={ktype === 'protein'}
          onChange={(e) => {
            resetSearch('all');
            changeParam('ktype', e.target.value);
          }}
        />
        <label className="form-check-label" htmlFor="inlineRadioProtein">
          Protein ID
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="ktype"
          id="inlineRadioMetab"
          value="metab"
          checked={ktype === 'metab'}
          onChange={(e) => {
            resetSearch('all');
            changeParam('ktype', e.target.value);
          }}
        />
        <label className="form-check-label" htmlFor="inlineRadioMetabolite">
          Metabolite
        </label>
      </div>
    </div>
  );
}

function PrimaryOmicsFilter({ omics, toggleOmics }) {
  const omicsDictionary = {
    all: 'All omics',
    epigenomics: 'Epigenomics',
    metabolomics: 'Metabolomics',
    proteomics: 'Proteomics',
    transcriptomics: 'Transcriptomics',
  };

  return (
    <div className="controlPanelContainer ml-2">
      <div className="controlPanel">
        <div className="controlRow">
          <div className="dropdown">
            <button
              className="btn btn-primary btn-outline-primary dropdown-toggle"
              type="button"
              id="reportViewMenu"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {omicsDictionary[omics]}
            </button>
            <div
              className="dropdown-menu animate slideIn"
              aria-labelledby="reportViewMenu"
            >
              {Object.keys(omicsDictionary).map((key) => {
                return (
                  <button
                    key={key}
                    className="dropdown-item"
                    type="button"
                    onClick={toggleOmics.bind(this, 'omics', key)}
                  >
                    {omicsDictionary[key]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Render modal message
function ResultsDownloadLink({ downloadPath, downloadError, profile }) {
  const host =
    process.env.NODE_ENV !== 'production'
      ? process.env.REACT_APP_ES_PROXY_HOST_DEV
      : process.env.REACT_APP_ES_PROXY_HOST;

  const resultDownloadFilePath =
    downloadPath &&
    downloadPath.substring(downloadPath.indexOf('search_results'));

  if (downloadError && downloadError.length) {
    return <span className="modal-message">{downloadError}</span>;
  }

  return (
    <span className="modal-message">
      {resultDownloadFilePath ? (
        <a
          id={resultDownloadFilePath}
          href={`${host}/${resultDownloadFilePath}`}
          download
          onClick={trackEvent.bind(
            this,
            'Search results download',
            resultDownloadFilePath,
            profile.user_metadata.name
          )}
        >
          Click this link to download the search results.
        </a>
      ) : null}
    </span>
  );
}

// Render modal
function ResultsDownloadModal({
  downloadPath,
  downloadError,
  downloading,
  profile,
}) {
  return (
    <div
      className="modal fade data-download-modal"
      id="dataDownloadModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="dataDownloadModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Download Results</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {!downloading ? (
              <ResultsDownloadLink
                downloadPath={downloadPath}
                downloadError={downloadError}
                profile={profile}
              />
            ) : (
              <div className="loading-spinner w-100 text-center my-3">
                <img src={IconSet.Spinner} alt="" />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/* End: Download modal */

SearchPage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  searchResults: PropTypes.shape({
    result: PropTypes.object,
    total: PropTypes.number,
  }),
  scope: PropTypes.string,
  searching: PropTypes.bool,
  searchError: PropTypes.string,
  searchParams: PropTypes.shape({ ...searchParamsPropType }),
  changeParam: PropTypes.func.isRequired,
  changeResultFilter: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  downloadResults: PropTypes.shape({
    total: PropTypes.number,
    path: PropTypes.string,
  }),
  downloading: PropTypes.bool,
  downloadError: PropTypes.string,
  handleSearchDownload: PropTypes.func.isRequired,
  handleDataFetch: PropTypes.func.isRequired,
  handleQCDataFetch: PropTypes.func.isRequired,
  allFiles: PropTypes.arrayOf(PropTypes.shape({})),
  lastModified: PropTypes.string,
  enabledFilters: PropTypes.shape({
    assay: PropTypes.object,
    comparison_group: PropTypes.object,
    sex: PropTypes.object,
    tissue: PropTypes.object,
  }),
};

SearchPage.defaultProps = {
  profile: {},
  searchResults: {},
  scope: 'all',
  searching: false,
  searchError: '',
  searchParams: { ...searchParamsDefaultProps },
  downloadResults: {},
  downloading: false,
  downloadError: '',
  allFiles: [],
  lastModified: '',
  enabledFilters: {},
};

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.search,
  allFiles: state.browseData.allFiles,
  lastModified: state.dataStatus.qcData.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
  changeParam: (field, value) =>
    dispatch(SearchActions.changeParam(field, value)),
  changeResultFilter: (field, value, bound) =>
    dispatch(SearchActions.changeResultFilter(field, value, bound)),
  handleSearch: (params, scope) =>
    dispatch(SearchActions.handleSearch(params, scope)),
  resetSearch: (scope) => dispatch(SearchActions.searchReset(scope)),
  handleSearchDownload: (params, analysis) =>
    dispatch(SearchActions.handleSearchDownload(params, analysis)),
  handleDataFetch: () => dispatch(BrowseDataActions.handleDataFetch()),
  handleQCDataFetch: () => dispatch(DataStatusActions.fetchData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
