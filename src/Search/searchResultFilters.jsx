import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the search result filters
 *
 * @returns {object} JSX representation of search result content.
 */
function SearchResultFilters({ results }) {
  return (
    <div className="search-result-filters">
      A categorized list of filters
    </div>
  );
}

SearchResultFilters.propTypes = {
  results: PropTypes.shape({
    data: PropTypes.object,
  }).isRequired,
};

export default SearchResultFilters;
