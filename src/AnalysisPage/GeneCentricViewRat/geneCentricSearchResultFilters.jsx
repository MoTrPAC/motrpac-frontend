import React from 'react';
import PropTypes from 'prop-types';
import {
  geneCentricSearchFilters,
  tissueList,
  assayList,
} from '../../lib/searchFilters';
import { geneSearchParamsPropType } from './sharedlib';

function GeneCentricSearchResultFilters({
  geneSearchParams,
  handleGeneCentricSearch,
  geneSearchChangeFilter,
  geneSearchInputValue,
  hasResultFilters,
}) {
  // FIXME - this is a hack to get the search filters such as tissue and assay
  // to render accordingly to the ktype (gene)
  function customizeTissueList() {
    return tissueList.filter((t) => t.filter_value !== 'plasma');
  }

  function customizeAssayList() {
    return assayList.filter((t) =>
      t.filter_value.match(
        /^(transcript-rna-seq|prot-pr|prot-ph|prot-ac|prot-ub)$/
      )
    );
  }

  geneCentricSearchFilters.find((f) => f.keyName === 'tissue').filters =
    customizeTissueList();

  geneCentricSearchFilters.find((f) => f.keyName === 'assay').filters =
    customizeAssayList();

  const commonSearchResultFilters = geneCentricSearchFilters.map((item) => (
    <div key={item.name} className="card filter-module mb-4">
      <div className="card-header font-weight-bold d-flex align-item-center justify-content-between">
        <div className="card-header-label">{item.name}</div>
      </div>
      <div className="collapse show" id={`filters-${item.keyName}`}>
        <div className="card-body">
          {item.filters.map((filter) => {
            const isActiveFilter =
              geneSearchParams.filters[item.keyName] &&
              geneSearchParams.filters[item.keyName].indexOf(
                filter.filter_value
              ) > -1;
            const resultCount =
              hasResultFilters &&
              hasResultFilters[item.keyName] &&
              Object.keys(hasResultFilters[item.keyName]).length &&
              hasResultFilters[item.keyName][filter.filter_value.toLowerCase()];
            return (
              <button
                key={filter.filter_label}
                type="button"
                className={`btn filterBtn ${
                  isActiveFilter ? 'activeFilter' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  geneSearchChangeFilter(item.keyName, filter.filter_value);
                }}
                disabled={!resultCount}
              >
                {filter.filter_label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ));

  return (
    <div className="search-result-filter-group mb-4">
      <div className="search-result-filter-group-header d-flex justify-content-between align-items-center mb-2">
        <div>Narrow results using filters below.</div>
      </div>
      {commonSearchResultFilters}
      <div className="submit-search-filters-button text-right">
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            handleGeneCentricSearch(
              geneSearchParams,
              geneSearchInputValue,
              'filters'
            );
          }}
        >
          Update results
        </button>
      </div>
    </div>
  );
}

GeneCentricSearchResultFilters.propTypes = {
  geneSearchParams: PropTypes.shape({ ...geneSearchParamsPropType }).isRequired,
  handleGeneCentricSearch: PropTypes.func.isRequired,
  geneSearchChangeFilter: PropTypes.func.isRequired,
  geneSearchInputValue: PropTypes.string.isRequired,
  hasResultFilters: PropTypes.shape({
    assay: PropTypes.object,
    tissue: PropTypes.object,
  }),
};

GeneCentricSearchResultFilters.defaultProps = {
  hasResultFilters: {},
};

export default GeneCentricSearchResultFilters;
