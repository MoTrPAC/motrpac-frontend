import React from 'react';
import PropTypes from 'prop-types';
import SearchResultFilters from './searchResultFilters';
import SampleSearchResultTable from './sampleSearchResultTable';

/**
 * Renders the search results
 *
 * @returns {object} JSX representation of search result content.
 */
function SearchResults({ results, urlSearchParamsObj }) {
  if (urlSearchParamsObj && Object.keys(urlSearchParamsObj).length) {
    return (
      <div className="sample-search-results-container">
        <div className="sample-search-results">
          <SampleSearchResultTable params={urlSearchParamsObj} />
        </div>
      </div>
    );
  }

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
  urlSearchParamsObj: PropTypes.shape({
    action: PropTypes.string,
    tissue: PropTypes.string,
    phase: PropTypes.string,
    study: PropTypes.string,
    experiment: PropTypes.string,
    site: PropTypes.string,
  }),
};

SearchResults.defaultProps = {
  results: {},
  urlSearchParamsObj: {},
};

export default SearchResults;
