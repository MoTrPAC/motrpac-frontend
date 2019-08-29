import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import lunr from 'lunr';
import SearchForm from './searchForm';
import SearchActions from './searchActions';
import SearchResults from './searchResults';
import history from '../App/history';
import AnimatedLoadingIcon from '../lib/ui/loading';

const mergedPass1aGetMetadata = require('../data/merged_pass1a_get_metadata');

const searchDocuments = [...mergedPass1aGetMetadata];

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
  quickSearchQueryString,
  quickSearchError,
  isQuickSearchFetching,
  handleSearchFormChange,
  addSearchParam,
  removeSearchParam,
  handleSearchFormSubmit,
  handlePredefinedSearch,
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

  const getAdvancedSearchForm = () => {
    resetSearchForm();
    getSearchForm();
  };

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
              <Link to="/search" className="search-link" onClick={getAdvancedSearchForm}>try</Link>
              &nbsp;again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render search results if response is returned
  if (!isFetching && payload && Object.keys(payload).length) {
    // Temp implementation to mock searches
    // using 'lunr' for client-side indexing
    /**
     * lunr implementation begins
     */
    const idx = lunr(function () {
      this.ref('vial_label');
      this.field('Species');
      this.field('Tissue');
      this.field('GET_site');
      this.field('BID');
      this.field('Assay');

      searchDocuments.forEach((doc) => {
        this.add(doc);
      }, this)
    });

    let query = '';
    const fieldMapping = {
      all: '',
      species: 'Species',
      tissue: 'Tissue',
      site: 'GET_site',
      biospecimenid: 'BID',
      assay: 'Assay',
    };

    if (!Object.keys(searchPayload).length && Object.keys(quickSearchPayload).length) {
      query = `${decodeURIComponent(quickSearchQueryString)}*`;
    } else if (Object.keys(searchPayload).length && !Object.keys(quickSearchPayload).length) {
      advSearchParams.forEach((param) => {
        const logical = param.operator && param.operator === 'AND' ? '+' : '';
        const field = fieldMapping[param.term];
        const value = `${decodeURIComponent(param.value)}*`;
        const search = !field ? `${logical}${value}` : `${logical}${field}:${value}`;
        query += `${search} `;
      });
    }

    const lunrSearches = idx.search(query.trim());

    const lunrResutls = lunrSearches.map(match => ({
      ref: match.ref,
      item: searchDocuments.find(item => item.vial_label === match.ref),
    }));
    /**
     * lunr implementation ends
     */

    return (
      <div className="col-md-9 ml-sm-auto col-lg-10 px-4 searchPage">
        <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom page-heading">
          {!quickSearchQueryString ? <SearchBackButton /> : null}
          <div className="page-title">
            <h3>Search Results</h3>
          </div>
        </div>
        <div className="advanced-search-content-container mt-3">
          {lunrResutls.length
            ? (
              <SearchResults lunrResutls={lunrResutls} advSearchParams={advSearchParams} quickSearchQueryString={quickSearchQueryString} />
            )
            : (
              <p className="text-left">
                No matches found. Please&nbsp;
                <Link to="/search" className="search-link" onClick={getAdvancedSearchForm}>try</Link>
                &nbsp;again.
              </p>
            )
          }
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

  // Render animated loading widget if data fetching is in progress
  if (isFetching && (searchQueryString.length || quickSearchQueryString.length)) {
    return (
      <div className="col-md-9 ml-sm-auto col-lg-10 px-4 searchPage">
        <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom page-heading">
          <SearchBackButton />
          <div className="page-title">
            <h3>Search Results</h3>
          </div>
        </div>
        <div className="advanced-search-content-container mt-3">
          <AnimatedLoadingIcon isFetching={isFetching} />
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
            <Link
              to="/search?q=(assay:rna-seq)"
              className="example-search-link"
              onClick={(e) => { e.preventDefault(); handlePredefinedSearch([{ term: 'assay', value: 'rna-seq', operator: '' }]); }}
            >
              rna-seq
            </Link>
            <Link
              to="/search?q=(tissue:liver)"
              className="example-search-link"
              onClick={(e) => { e.preventDefault(); handlePredefinedSearch([{ term: 'tissue', value: 'liver', operator: '' }]); }}
            >
              liver
            </Link>
            <Link
              to="/search?q=(species:rat)"
              className="example-search-link"
              onClick={(e) => { e.preventDefault(); handlePredefinedSearch([{ term: 'species', value: 'rat', operator: '' }]); }}
            >
              rat
            </Link>
          </p>
        </div>
        <div className="alert alert-warning alert-dismissible fade show warning-note d-flex align-items-center" role="alert">
          <span className="material-icons">info</span>
          <span className="warning-note-text">
            Only the GET data is available for searching in this release.
          </span>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
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
  quickSearchQueryString: PropTypes.string,
  quickSearchError: PropTypes.string,
  isQuickSearchFetching: PropTypes.bool,
  handleSearchFormChange: PropTypes.func.isRequired,
  addSearchParam: PropTypes.func.isRequired,
  removeSearchParam: PropTypes.func.isRequired,
  handleSearchFormSubmit: PropTypes.func.isRequired,
  handlePredefinedSearch: PropTypes.func.isRequired,
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
  quickSearchQueryString: '',
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
  handlePredefinedSearch: params => dispatch(SearchActions.handlePredefinedSearch(params)),
  resetSearchForm: () => dispatch(SearchActions.searchFormReset()),
  getSearchForm: () => dispatch(SearchActions.getSearchForm()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
