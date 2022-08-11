import React from 'react';
import PropTypes from 'prop-types';
import browseDataFilters from '../lib/browseDataFilters';

function BrowseDataFilter({ activeFilters, onChangeFilter, onResetFilters }) {
  const filters = browseDataFilters.map((item) => (
    <div key={item.name} className="card filter-module mb-4">
      <div className="card-header font-weight-bold d-flex align-items-center">
        <div>{item.name}</div>
        {item.keyName === 'category' && (
          <div className="data-filter-info-icon-wrapper d-flex align-items-center">
            <i className="material-icons data-filter-info-icon ml-1">info</i>
            <span className="tooltip-on-right" id="data-filter-info-tooltip">
              <span>
                <strong>Analysis</strong> - Differential analysis and normalized
                data tables.
                <br />
                <strong>Results</strong> - Quantitative results,
                experimental/sample metadata, and QA/QC reports.
              </span>
              <i />
            </span>
          </div>
        )}
      </div>
      <div className="card-body">
        {item.filters.map((filter) => {
          const isActiveFilter =
            activeFilters[item.keyName] &&
            activeFilters[item.keyName].indexOf(filter) > -1;
          return (
            <button
              key={filter}
              type="button"
              className={`btn filterBtn ${
                isActiveFilter ? 'activeFilter' : ''
              }`}
              onClick={() => onChangeFilter(item.keyName, filter)}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  ));
  return (
    <div className="col-md-3 browse-data-filter-group">
      <div className="browse-data-filter-group-header d-flex justify-content-between align-items-center mb-2">
        <div>Narrow results using filters below.</div>
        <button type="button" className="btn btn-link" onClick={onResetFilters}>
          Reset filters
        </button>
      </div>
      {filters}
    </div>
  );
}
BrowseDataFilter.propTypes = {
  activeFilters: PropTypes.shape({
    tissue_name: PropTypes.arrayOf(PropTypes.string),
    assay: PropTypes.arrayOf(PropTypes.string),
    omics: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.arrayOf(PropTypes.string),
  }),
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};
BrowseDataFilter.defaultProps = {
  activeFilters: {
    assay: [],
    omics: [],
    tissue_name: [],
    category: [],
  },
};

export default BrowseDataFilter;
