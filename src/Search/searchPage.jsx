import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import SearchForm from './searchForm';
import SearchActions from './searchActions';
import SearchResults from './searchResults';

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
  isAuthenticated,
}) {
  // Send users back to homepage if not authenticated
  if (!isAuthenticated) {
    return (<Redirect to="/" />);
  }

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

  // Render error message if there is one
  if (!isFetching && errMsg && errMsg.length) {
    return (
      <div className="col-md-9 ml-sm-auto col-lg-10 px-4 searchPage">
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>Error</h3>
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
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>Search Results</h3>
        </div>
        <div className="advanced-search-content-container mt-3">
          <SearchResults results={payload} />
        </div>
      </div>
    );
  }

  // Render advanced search form by default
  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 searchPage">
      <div className="page-title pt-3 pb-2 border-bottom">
        <h3>Advanced Search</h3>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
