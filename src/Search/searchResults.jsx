import React from 'react';
import PropTypes from 'prop-types';
import SearchResultFilters from './searchResultFilters';

/**
 * Renders the search results
 *
 * @returns {object} JSX representation of search result content.
 */
function SearchResults({ results }) {
  return (
    <div className="d-flex search-results-container">
      <div className="search-result-filters-container">
        <SearchResultFilters results={results} />
      </div>
      <div className="search-results-content-container">
        Data received.
      </div>
    </div>
  );
}

SearchResults.propTypes = {
  results: PropTypes.shape({
    data: PropTypes.object,
  }),
};

SearchResults.defaultProps = {
  results: {},
};

export default SearchResults;
