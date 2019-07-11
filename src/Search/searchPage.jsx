import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import SearchForm from './searchForm';
import SearchActions from './searchActions';
import SearchResults from './searchResults';
import history from '../App/history';

/**
 * Conditionally renders the search page with different UIs
 * 1. the advanced search form by default
 * 2. the search results if the request has a response
 * 3. an error message if the request fails for some reason
 *
 * @returns {object} JSX representation of search page elements.
 */
export function SearchPage({
  advSearchParams,
  searchPayload,
  searchQueryString,
  searchError,
  isSearchFetching,
  quickSearchPayload,
  quickSearchError,
  isQuickSearchFetching,
  handleSearchFormChange,
  addSearchParam,
  removeSearchParam,
  handleSearchFormSubmit,
  resetSearchForm,
  getSearchForm,
  isAuthenticated,
}) {
  // Send users back to homepage if not authenticated
  if (!isAuthenticated) {
    return (<Redirect to="/" />);
  }

  const urlSearchParams = new URLSearchParams(window.location.search);

  const isFetching = isSearchFetching || isQuickSearchFetching;
  let errMsg;
  let payload;
  if (searchError && searchError.length) {
    errMsg = searchError;
  } else if (quickSearchError && quickSearchError.length) {
    errMsg = quickSearchError;
  }
  if (searchPayload && Object.keys(searchPayload).length) {
    payload = searchPayload;
  } else if (quickSearchPayload && Object.keys(quickSearchPayload).length) {
    payload = quickSearchPayload;
  }

  function backToSearch() {
    getSearchForm();
  }
  // Button to return to previous page
  function SearchBackButton() {
    return (
      <button className="backButton d-inline-flex" onClick={backToSearch} type="button">
        <span className="material-icons align-self-center">arrow_back</span>
      </button>
    );
  }

  function backToSummary() {
    history.goBack();
  }

  // Button to return to previous page
  function SummaryBackButton() {
    return (
      <button className="backButton d-inline-flex" onClick={backToSummary} type="button">
        <span className="material-icons align-self-center">arrow_back</span>
      </button>
    );
  }

  // Render error message if there is one
  if (!isFetching && errMsg && errMsg.length) {
    return (
      <div className="col-md-9 ml-sm-auto col-lg-10 px-4 searchPage">
        <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom page-heading">
          <div className="page-title">
            <h3>Error</h3>
          </div>
        </div>
        <div className="advanced-search-content-container mt-3">
          <div className="adv-search-example-searches">
            <p className="text-left">
              Please&nbsp;
              <Link to="/search" className="search-link">try</Link>
              &nbsp;again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render search results if response is returned
  if (!isFetching && payload && Object.keys(payload).length) {
    return (
      <div className="col-md-9 ml-sm-auto col-lg-10 px-4 searchPage">
        <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom page-heading">
          <SearchBackButton />
          <div className="page-title">
            <h3>Search Results</h3>
          </div>
        </div>
        <div className="advanced-search-content-container mt-3">
          <SearchResults results={payload} />
        </div>
      </div>
    );
  }

  // Render results if request comes from tissue analysis table
  if (urlSearchParams && urlSearchParams.has('action') && urlSearchParams.get('action') === 'samples') {
    // Convert params array to object
    const urlSearchParamsObj = {
      action: urlSearchParams.get('action'),
      tissue: urlSearchParams.get('tissue'),
      phase: urlSearchParams.get('phase'),
      study: urlSearchParams.get('study'),
      experiment: urlSearchParams.get('experiment'),
      site: urlSearchParams.get('site'),
    };

    return (
      <div className="col-md-9 ml-sm-auto col-lg-10 px-4 searchPage">
        <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom page-heading">
          <SummaryBackButton />
          <div className="page-title">
            <h3>Tissue Sample Results</h3>
          </div>
        </div>
        <div className="advanced-search-content-container mt-3">
          <SearchResults urlSearchParamsObj={urlSearchParamsObj} />
        </div>
      </div>
    );
  }

  // Render advanced search form by default
  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 searchPage">
      <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom page-heading">
        <div className="page-title">
          <h3>Advanced Search</h3>
        </div>
      </div>
      <div className="advanced-search-content-container mt-3">
        <div className="adv-search-example-searches">
          <p className="text-left">
            Example searches:&nbsp;
            <Link to="/search?assay=rna-seq" className="example-search-link">rna-seq</Link>
            <Link to="/search?tissue=liver" className="example-search-link">liver</Link>
            <Link to="/search?species=rat" className="example-search-link">rat</Link>
          </p>
        </div>
        <SearchForm
          advSearchParams={advSearchParams}
          queryString={searchQueryString}
          handleSearchFormChange={handleSearchFormChange}
          addSearchParam={addSearchParam}
          removeSearchParam={removeSearchParam}
          resetSearchForm={resetSearchForm}
          handleSearchFormSubmit={handleSearchFormSubmit}
        />
      </div>
    </div>
  );
}

SearchPage.propTypes = {
  advSearchParams: PropTypes.arrayOf(PropTypes.shape({
    term: PropTypes.string,
    value: PropTypes.string,
    operator: PropTypes.string,
  })).isRequired,
  searchPayload: PropTypes.shape({
    data: PropTypes.object,
  }),
  searchQueryString: PropTypes.string,
  searchError: PropTypes.string,
  isSearchFetching: PropTypes.bool,
  quickSearchPayload: PropTypes.shape({
    data: PropTypes.object,
  }),
  quickSearchError: PropTypes.string,
  isQuickSearchFetching: PropTypes.bool,
  handleSearchFormChange: PropTypes.func.isRequired,
  addSearchParam: PropTypes.func.isRequired,
  removeSearchParam: PropTypes.func.isRequired,
  handleSearchFormSubmit: PropTypes.func.isRequired,
  resetSearchForm: PropTypes.func.isRequired,
  getSearchForm: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

SearchPage.defaultProps = {
  searchPayload: {},
  searchQueryString: '',
  searchError: '',
  isSearchFetching: false,
  quickSearchPayload: {},
  quickSearchError: '',
  isQuickSearchFetching: false,
};

const mapStateToProps = state => ({
  ...(state.search),
  ...(state.quickSearch),
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  handleSearchFormChange: (index, field, e) => dispatch(SearchActions.searchFormChange(index, field, e)),
  addSearchParam: () => dispatch(SearchActions.searchFormAddParam()),
  removeSearchParam: index => dispatch(SearchActions.searchFormRemoveParam(index)),
  handleSearchFormSubmit: params => dispatch(SearchActions.handleSearchFormSubmit(params)),
  resetSearchForm: () => dispatch(SearchActions.searchFormReset()),
  getSearchForm: () => dispatch(SearchActions.getSearchForm()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
