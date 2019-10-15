import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the search result filters
 *
 * @returns {object} JSX representation of search result content.
 */
function SearchResultFilters({ results }) {
  return (
    <div className="card search-result-filters">
      <div className="card-body">
        <div className="search-result-filters-content">
          <ul className="list-group list-group-flush">
            <li className="list-group-item active">
              <div className="search-result-filters-title">Status</div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="category-item">Pending Q.C.</span>
              <span className="badge badge-secondary badge-pill">0</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="category-item">Internally Available</span>
              <span className="badge badge-primary badge-pill">{results.length}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="category-item">Publicly Available</span>
              <span className="badge badge-success badge-pill">{results.length}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

SearchResultFilters.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    ref: PropTypes.string,
    item: PropTypes.object,
  })).isRequired,
};

export default SearchResultFilters;
