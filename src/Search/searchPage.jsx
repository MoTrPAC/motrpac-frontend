import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import history from '../App/history';
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
  payload,
  queryString,
  message,
  isFetching,
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

  // Update window location with query string
  if (queryString && queryString.length) {
    history.push(`/search?q=${queryString}`);
  }

  // Render error message if there is one
  if (!isFetching && message && message.length) {
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
  payload: PropTypes.shape({
    data: PropTypes.object,
  }),
  queryString: PropTypes.string,
  message: PropTypes.string,
  isFetching: PropTypes.bool,
  handleSearchFormChange: PropTypes.func.isRequired,
  addSearchParam: PropTypes.func.isRequired,
  removeSearchParam: PropTypes.func.isRequired,
  handleSearchFormSubmit: PropTypes.func.isRequired,
  resetSearchForm: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

SearchPage.defaultProps = {
  payload: {},
  queryString: '',
  message: '',
  isFetching: false,
};

const mapStateToProps = state => ({
  ...(state.search),
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  handleSearchFormChange: (index, field, e) => dispatch(SearchActions.searchFormChange(index, field, e)),
  addSearchParam: () => dispatch(SearchActions.searchFormAddParam()),
  removeSearchParam: index => dispatch(SearchActions.searchFormRemoveParam(index)),
  handleSearchFormSubmit: () => dispatch(SearchActions.handleSearchFormSubmit()),
  resetSearchForm: () => dispatch(SearchActions.searchFormReset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
