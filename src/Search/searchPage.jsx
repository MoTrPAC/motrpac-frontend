import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import SearchResultsTable from './searchResultsTable';
import SearchActions from './searchActions';
import surveyModdalActions from '../UserSurvey/userSurveyActions';
import SearchResultFilters from './deaSearchResultFilters';
import AnimatedLoadingIcon from '../lib/ui/loading';
import { searchParamsDefaultProps, searchParamsPropType } from './sharedlib';
import { getFriendlyErrorMessage, isFilterMismatchError, isNoResultsError } from './searchErrorMessages';
import IconSet from '../lib/iconSet';
import searchStructuredData from '../lib/searchStructuredData/search';
import UserSurveyModal from '../UserSurvey/userSurveyModal';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';
import { genes } from '../data/genes';
import { metabolites } from '../data/metabolites';
import { proteins } from '../data/proteins';
import { humanGenes } from '../data/human_genes';
import { humanMetabolites } from '../data/human_metabolites';
import { humanProteins } from '../data/human_proteins';
import { ratAcuteGenes } from '../data/rat_acute_genes';
import { ratAcuteMetabolites } from '../data/rat_acute_metabolites';
import { ratAcuteProteins } from '../data/rat_acute_proteins';
import DifferentialAbundanceSummary from './components/differentialAbundanceSummary';

import '@styles/search.scss';

export function SearchPage({
  profile = {},
  searchResults = {},
  scope = 'all',
  searching = false,
  searchError = '',
  searchParams = { ...searchParamsDefaultProps },
  changeParam,
  changeResultFilter,
  handleSearch,
  resetSearch,
  downloadResults = {},
  downloading = false,
  downloadError = '',
  handleSearchDownload,
  includeEpigenomics = false,
  toggleEpigenomics,
}) {
  const [multiSelections, setMultiSelections] = useState([]);
  const inputRef = useRef(null);
  const showUserSurveyModal = useSelector(
    (state) => state.userSurvey.showUserSurveyModal,
  );
  const surveyId = useSelector((state) => state.userSurvey.surveyId);

  const userType = profile.user_metadata && profile.user_metadata.userType;

  const includesPrecawg =
    Array.isArray(searchParams.study) && searchParams.study.includes('precawg');
  const includesPass1b06 =
    Array.isArray(searchParams.study) && searchParams.study.includes('pass1b06');
  const includesPass1a06 =
    Array.isArray(searchParams.study) && searchParams.study.includes('pass1a06');

  useEffect(() => {
    if (showUserSurveyModal) {
      const userSurveyModalRef = document.querySelector('body');
      userSurveyModalRef.classList.add('modal-open');
    }
  }, [showUserSurveyModal]);

  // Memoize unified results to avoid recalculating on every render
  const unifiedResults = useMemo(() => {
    if (!searchResults?.result?.headers || !searchResults?.result?.data) {
      return [];
    }

    const keys = searchResults.result.headers;
    return searchResults.result.data.map((row) => {
      const newObj = {};
      row.forEach((value, index) => {
        newObj[keys[index]] = value;
      });
      return newObj;
    });
  }, [searchResults?.result?.headers, searchResults?.result?.data]);

  // Helper to concatenate arrays of objects and remove duplicates by 'id' property
  function mergeAndDedupeById(...arrays) {
    const combined = arrays.flat();
    return [...new Map(combined.map((item) => [item.id, item])).values()];
  }

  // get options based on selected search context
  // for automatic suggestions in the primary search input field
  function getOptions() {
    if ((includesPass1b06 && includesPrecawg && includesPass1a06) || (userType && userType === 'internal')) {
      switch (searchParams.ktype) {
        case 'gene':
          return mergeAndDedupeById(genes, ratAcuteGenes, humanGenes);
        case 'metab':
          return mergeAndDedupeById(metabolites, ratAcuteMetabolites, humanMetabolites);
        case 'protein':
          return mergeAndDedupeById(proteins, ratAcuteProteins, humanProteins);
        default:
          return [];
      }
    }
    if ((includesPass1b06 && includesPrecawg) || (!userType || userType === 'external')) {
      switch (searchParams.ktype) {
        case 'gene':
          return mergeAndDedupeById(genes, humanGenes);
        case 'metab':
          return mergeAndDedupeById(metabolites, humanMetabolites);
        case 'protein':
          return mergeAndDedupeById(proteins, humanProteins);
        default:
          return [];
      }
    }
    return [];
  }

  // render placeholder text in primary search input field
  function renderPlaceholder() {
    if (searchParams.ktype === 'protein') {
      return 'Example: global ischemia-induced protein 11, 17-beta-hydroxysteroid dehydrogenase 13';
    }
    if (searchParams.ktype === 'metab') {
      return 'Example: amino acids and peptides, aminobutyric acid';
    }
    return 'Example: bag3, myom2, prag1, smad3, vegfa';
  }

  // Transform input values
  // Keep react-bootstrap-typeahead state array as is
  // Convert manually entered gene/protein/metabolite string input to array
  function formatSearchInput() {
    const newArr = [];
    // react-bootstrap-typeahead state array has values
    if (multiSelections.length) {
      multiSelections.forEach((item) => newArr.push(item.id));
      return newArr;
    }
    // Handle manually entered gene/protein/metabolite string input
    // convert formatted string to array using Typeahead ref
    const inputValue = inputRef.current?.getInput()?.value;
    if (inputValue && inputValue.length) {
      // Match terms enclosed in double quotes or not containing commas
      const terms = inputValue.match(/("[^"]+"|[^, ]+)/g);
      if (!terms) return [];
      // Remove double quotes from terms that are enclosed and trim any extra spaces
      return terms.map((term) => term.replace(/"/g, '').trim());
    }
    return newArr;
  }

  // Clear the Typeahead input
  const clearSearchTermInput = () => {
    inputRef.current?.clear();
  };

  // Handle server-side pagination changes
  // Re-fetches data with updated size and start params
  const handlePaginationChange = ({ size: newSize, start: newStart }) => {
    const updatedParams = {
      ...searchParams,
      size: newSize,
      start: newStart,
    };
    handleSearch(updatedParams, searchParams.keys, 'filters', userType);
  };

  return (
    <div className="searchPage px-3 px-md-4 mb-3 w-100">
      <Helmet>
        <html lang="en" />
        <title>Search Differential Abundance Data - MoTrPAC Data Hub</title>
        <script type="application/ld+json">
          {JSON.stringify(searchStructuredData)}
        </script>
      </Helmet>
      <form id="searchForm" name="searchForm">
        <PageTitle title="Summary-level results" />
        <div className="search-content-container">
          <DifferentialAbundanceSummary userType={userType} />
          <div className="search-form-container mt-3 mb-4 border shadow-sm rounded px-4 pt-2 pb-3">
            <div className="search-summary-toggle-container row">
              <a
                className="btn btn-link show-collapse-summary-link mx-auto"
                role="button"
                data-toggle="collapse"
                href="#collapseDifferentialAbundanceSummary"
                aria-expanded="false"
                aria-controls="collapseDifferentialAbundanceSummary"
              >
                <span className="material-icons">drag_handle</span>
              </a>
            </div>
            <div className="es-search-ui-container d-flex align-items-center w-100 mt-3 pb-2">
              <RadioButton
                changeParam={changeParam}
                ktype={searchParams.ktype}
                resetSearch={resetSearch}
                clearInput={clearSearchTermInput}
                setMultiSelections={setMultiSelections}
              />
              <div className="search-box-input-group d-flex align-items-center flex-grow-1">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text search-icon">
                      <img src={searchParams.ktype === 'gene' ? IconSet.DNA : (searchParams.ktype === 'protein' ? IconSet.Protein : IconSet.Metabolite)} alt="" />
                    </div>
                  </div>
                  <Typeahead
                    id="dea-search-typeahead-multiple"
                    labelKey="id"
                    multiple
                    onChange={setMultiSelections}
                    options={getOptions()}
                    placeholder={renderPlaceholder()}
                    selected={multiSelections}
                    minLength={2}
                    ref={inputRef}
                  />
                </div>
                <div className="search-button-group d-flex justify-content-end ml-4">
                  <button
                    type="submit"
                    className="btn btn-primary search-submit"
                    onClick={(e) => {
                      e.preventDefault();
                      const inputValue = inputRef.current?.getInput()?.value;
                      const hasInput = (multiSelections && multiSelections.length)
                        || (inputValue && inputValue.length);
                      handleSearch(
                        searchParams,
                        hasInput ? formatSearchInput() : searchParams.keys,
                        'all',
                        userType,
                      );
                      // track event in Google Analytics 4
                      trackEvent(
                        'Differential Abundance Search',
                        'keyword_search',
                        profile && profile.userid
                          ? profile.userid.substring(profile.userid.indexOf('|') + 1)
                          : 'anonymous',
                        hasInput ? formatSearchInput() : searchParams.keys,
                      );
                    }}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary search-reset ml-2"
                    onClick={() => {
                      clearSearchTermInput();
                      resetSearch('all');
                      setMultiSelections([]);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="search-body-container mt-4 mb-2">
            {searching && <AnimatedLoadingIcon isFetching={searching} />}
            {!searching && searchError ? (
              <div className="alert alert-danger">
                <strong>
                  <i className="bi bi-exclamation-triangle-fill mr-2" />
                  Search Error
                </strong>
                <p className="mb-0 mt-2">{getFriendlyErrorMessage(searchError, scope).friendlyMessage}</p>
                {getFriendlyErrorMessage(searchError, scope).suggestion && (
                  <p className="mb-0 mt-1 small">{getFriendlyErrorMessage(searchError, scope).suggestion}</p>
                )}
              </div>
            ) : null}
            {!searching
              && !searchResults.data
              && searchResults.errors
              && scope === 'all' ? (
                <div className="alert alert-warning search-error-alert">
                  <strong>
                    <i className="bi bi-info-circle-fill mr-2" />
                    {isFilterMismatchError(searchResults.errors)
                      ? 'No Data Available'
                      : 'Search Notice'}
                  </strong>
                  <p className="mb-0 mt-2">
                    {getFriendlyErrorMessage(searchResults.errors, scope).friendlyMessage}
                  </p>
                  {getFriendlyErrorMessage(searchResults.errors, scope).suggestion && (
                    <p className="mb-0 mt-1 small">
                      {getFriendlyErrorMessage(searchResults.errors, scope).suggestion}
                    </p>
                  )}
                </div>
              ) : null}
            {!searching && !searchResults.data && searchResults.total === 0 && scope === 'all' ? (
              <div className="alert alert-warning search-error-alert">
                <strong>
                  <i className="bi bi-search mr-2" />
                  No Matches Found
                </strong>
                <p className="mb-0 mt-2">
                  Your search did not return any results.
                </p>
                <p className="mb-0 mt-1 small">
                  Try using different keywords or check the spelling of your search terms.
                </p>
              </div>
              ) : null}
            {!searching
              && (searchResults.result
                || ((searchResults.errors || searchResults.total === 0) && scope === 'filters')) ? (
                  <div className="search-results-wrapper-container row">
                    <div className="search-sidebar-container col-md-3">
                      <SearchResultFilters
                        searchParams={searchParams}
                        changeResultFilter={changeResultFilter}
                        handleSearch={handleSearch}
                        resetSearch={resetSearch}
                        profile={profile}
                        includeEpigenomics={includeEpigenomics}
                        toggleEpigenomics={toggleEpigenomics}
                      />
                    </div>
                    {/* render unified search results across multiple studies */}
                    <div className="da-search-results-content-container tabbed-content col-md-9">
                      <div className="tab-content mt-3">
                        {unifiedResults.length ? (
                          <SearchResultsTable
                            unifiedResults={unifiedResults}
                            searchParams={searchParams}
                            handleSearchDownload={handleSearchDownload}
                            total={searchResults.total || 0}
                            size={searchParams.size}
                            start={searchResults.start || 0}
                            onPaginationChange={handlePaginationChange}
                          />
                        ) : (
                          scope === 'filters' && (
                            <FilterResultsEmptyState
                              error={searchResults.errors}
                              total={searchResults.total}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
              ) : null}
            <ResultsDownloadModal
              downloadPath={downloadResults.path}
              downloadError={downloadError}
              downloading={downloading}
              profile={profile}
            />
          </div>
        </div>
        <UserSurveyModal
          userID={profile && profile.email ? profile.email : (surveyId ? surveyId : 'anonymous')}
          dataContext="search_results"
        />
      </form>
    </div>
  );
}

/**
 * Empty state shown when filter selections return no results
 */
function FilterResultsEmptyState({ error, total }) {
  // Expected empty: no error, or known "no results" errors, or total is 0
  const isExpectedEmpty = !error || total === 0 || isNoResultsError(error) || isFilterMismatchError(error);

  return (
    <div className="filter-error-message mt-5 p-3 alert alert-warning">
      {isExpectedEmpty ? (
        <>
          <h5 className="mb-2">
            <i className="bi bi-exclamation-diamond-fill mr-2" />
            No matches found for the selected filters
          </h5>
          <p className="mb-0">
            Try adjusting your filter selections or refer to the
            {' '}
            <Link to="/summary">Summary Table</Link>
            {' '}
            to see what data is available.
          </p>
        </>
      ) : (
        <>
          <p className="mb-2">
            <i className="bi bi-exclamation-circle mr-2" />
            <strong>Unable to retrieve results</strong>
          </p>
          <p className="mb-0 small text-muted">
            {getFriendlyErrorMessage(error, 'filters').friendlyMessage}
          </p>
        </>
      )}
    </div>
  );
}

FilterResultsEmptyState.propTypes = {
  error: PropTypes.string,
  total: PropTypes.number,
};

function RadioButtonComponent({ ktype, keyType, elId, label, eventHandler }) {
  return (
    <div className="form-check form-check-inline">
      <input
        className="form-check-input"
        type="radio"
        name="ktype"
        id={elId}
        value={keyType}
        checked={ktype === keyType}
        onChange={(e) => eventHandler(e)}
      />
      <label className="form-check-label" htmlFor={elId}>
        {label}
      </label>
    </div>
  );
}

RadioButtonComponent.propTypes = {
  ktype: PropTypes.string,
  keyType: PropTypes.string.isRequired,
  elId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  eventHandler: PropTypes.func.isRequired,
};

// Radio buttons for selecting the search context
function RadioButton({
  changeParam,
  ktype,
  resetSearch,
  clearInput,
  setMultiSelections,
}) {
  const radioButtonOptions = [
    {
      keyType: 'gene',
      id: 'inlineRadioGene',
      label: 'Gene symbol',
    },
    {
      keyType: 'protein',
      id: 'inlineRadioProtein',
      label: 'Protein name',
    },
    {
      keyType: 'metab',
      id: 'inlineRadioMetab',
      label: 'Metabolite name',
    },
  ];

  const handleRadioChange = (e) => {
    resetSearch('all');
    clearInput();
    setMultiSelections([]);
    changeParam('ktype', e.target.value);
  };

  return (
    <div className="search-context">
      {radioButtonOptions.map((item) => (
        <RadioButtonComponent
          key={item.id}
          ktype={ktype}
          keyType={item.keyType}
          elId={item.id}
          label={item.label}
          eventHandler={handleRadioChange}
        />
      ))}
    </div>
  );
}

RadioButton.propTypes = {
  changeParam: PropTypes.func,
  ktype: PropTypes.string,
  resetSearch: PropTypes.func.isRequired,
  clearInput: PropTypes.func.isRequired,
  setMultiSelections: PropTypes.func.isRequired,
};

// Render modal message
function ResultsDownloadLink({
  downloadPath = '', downloadError = '', profile = {},
}) {
  const dispatch = useDispatch();

  // track event when user clicks download link
  function handleSearchResultsDownload() {
    // update store to show that user has downloaded data
    dispatch(surveyModdalActions.userDownloadedData());
    // track event in Google Analytics 4
    trackEvent(
      'Data Download',
      'search_results',
      profile && profile.userid
        ? profile.userid.substring(profile.userid.indexOf('|') + 1)
        : 'anonymous',
      resultDownloadFilePath,
    );
  }

  const searchServiceHost = import.meta.env.VITE_ES_PROXY_HOST;

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
          href={`${searchServiceHost}/${resultDownloadFilePath}`}
          download
          onClick={handleSearchResultsDownload}
        >
          Click this link to download the search results.
        </a>
      ) : null}
    </span>
  );
}

ResultsDownloadLink.propTypes = {
  downloadPath: PropTypes.string,
  downloadError: PropTypes.string,
  profile: PropTypes.shape({
    userid: PropTypes.string,
  }),
};

// Render modal
function ResultsDownloadModal({
  downloadPath = '',
  downloadError = '',
  downloading = false,
  profile = {},
}) {
  const dispatch = useDispatch();

  // get states from store
  const surveySubmitted = useSelector(
    (state) => state.userSurvey.surveySubmitted,
  );
  const downloadedData = useSelector(
    (state) => state.userSurvey.downloadedData,
  );

  // show modal if user downloaded data and has not submitted survey
  function handleSearchResultsDownloadModalClose() {
    if (downloadedData && !surveySubmitted) {
      setTimeout(() => {
        dispatch(surveyModdalActions.toggleUserSurveyModal(true));
      }, 1000);
    }
  }

  return (
    <div
      className="modal fade data-download-modal"
      id="dataDownloadModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="dataDownloadModalLabel"
      aria-hidden="true"
      data-backdrop="static"
      data-keyboard="false"
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
              onClick={handleSearchResultsDownloadModalClose}
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
              onClick={handleSearchResultsDownloadModalClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ResultsDownloadModal.propTypes = {
  downloadPath: PropTypes.string,
  downloadError: PropTypes.string,
  downloading: PropTypes.bool,
  profile: PropTypes.shape({
    userid: PropTypes.string,
  }),
};
/* End: Download modal */

SearchPage.propTypes = {
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
  searchResults: PropTypes.shape({
    result: PropTypes.shape({
      headers: PropTypes.arrayOf(PropTypes.string),
      data: PropTypes.arrayOf(PropTypes.array),
    }),
    uniqs: PropTypes.object,
    total: PropTypes.number,
    errors: PropTypes.string,
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
  includeEpigenomics: PropTypes.bool,
  toggleEpigenomics: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.search,
  allFiles: state.browseData.allFiles,
});

const mapDispatchToProps = (dispatch) => ({
  changeParam: (field, value) =>
    dispatch(SearchActions.changeParam(field, value)),
  changeResultFilter: (field, value, bound) =>
    dispatch(SearchActions.changeResultFilter(field, value, bound)),
  handleSearch: (params, geneInputValue, scope, userType) =>
    dispatch(SearchActions.handleSearch(params, geneInputValue, scope, userType)),
  resetSearch: (scope) => dispatch(SearchActions.searchReset(scope)),
  handleSearchDownload: (params, analysis) =>
    dispatch(SearchActions.handleSearchDownload(params, analysis)),
  toggleEpigenomics: (enabled) =>
    dispatch(SearchActions.toggleEpigenomics(enabled)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
