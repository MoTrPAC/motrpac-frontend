import React from 'react';
import PropTypes from 'prop-types';
import {
  commonSearchFilters,
  rangeSearchFilters,
  tissueList,
  assayList,
} from '../lib/searchFilters';
import { searchParamsPropType } from './sharedlib';

function SearchResultFilters({
  searchParams,
  changeResultFilter,
  handleSearch,
  resetSearch,
}) {
  // FIXME - this is a hack to get the search filters such as tissue and assay
  // to render accordingly to the ktype (gene, protein, metabolite)
  function customizeTissueList() {
    if (searchParams.ktype === 'protein') {
      return tissueList.filter((t) =>
        t.filter_value.match(
          /^(cortex|gastrconemius|heart|kidney|lung|liver|white adipose)$/
        )
      );
    }
    if (searchParams.ktype === 'metab') {
      return tissueList.filter((t) => t.filter_value !== 'blood rna');
    }
    return tissueList;
  }

  function customizeAssayList() {
    if (searchParams.ktype === 'gene') {
      return assayList.filter((t) =>
        t.filter_value.match(
          /^(transcript-rna-seq|immunoassay|prot-pr|prot-ph|prot-ac|prot-ub)$/
        )
      );
    }
    if (searchParams.ktype === 'protein') {
      return assayList.filter((t) =>
        t.filter_value.match(/^(prot-pr|prot-ph|prot-ac|prot-ub)$/)
      );
    }
    if (searchParams.ktype === 'metab') {
      return assayList.filter(
        (t) =>
          !t.filter_value.match(
            /^(transcript-rna-seq|immunoassay|prot-pr|prot-ph|prot-ac|prot-ub)$/
          )
      );
    }
    return assayList;
  }

  commonSearchFilters.find(
    (f) => f.keyName === 'tissue'
  ).filters = customizeTissueList();

  commonSearchFilters.find(
    (f) => f.keyName === 'assay'
  ).filters = customizeAssayList();

  const commonSearchResultFilters = commonSearchFilters.map((item) => (
    <div key={item.name} className="card filter-module mb-4">
      <div className="card-header font-weight-bold d-flex align-item-center justify-content-between">
        <div className="card-header-label">{item.name}</div>
        <a
          className="btn btn-link filters-collapsible-btn p-0"
          data-toggle="collapse"
          href={`#filters-${item.keyName}`}
          role="button"
          aria-expanded="true"
          aria-controls={`filters-${item.keyName}`}
        >
          <span className="material-icons">more_horiz</span>
        </a>
      </div>
      <div className="collapse show" id={`filters-${item.keyName}`}>
        <div className="card-body">
          {item.filters.map((filter) => {
            const isActiveFilter =
              searchParams.filters[item.keyName] &&
              searchParams.filters[item.keyName].indexOf(filter.filter_value) >
                -1;
            return (
              <button
                key={filter.filter_label}
                type="button"
                className={`btn filterBtn ${
                  isActiveFilter ? 'activeFilter' : ''
                }`}
                onClick={() =>
                  changeResultFilter(item.keyName, filter.filter_value, null)
                }
              >
                {filter.filter_label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ));

  const rangeSearchResultFilters = rangeSearchFilters.map((item) => (
    <div key={item.name} className="card filter-module mb-4">
      {/* filter header content */}
      <div className="card-header font-weight-bold d-flex align-item-center justify-content-between">
        <div className="card-header-label">{item.name}</div>
        <a
          className="btn btn-link filters-collapsible-btn p-0"
          data-toggle="collapse"
          href={`#filters-${item.keyName}`}
          role="button"
          aria-expanded="true"
          aria-controls={`filters-${item.keyName}`}
        >
          <span className="material-icons">more_horiz</span>
        </a>
      </div>
      {/* filter body content */}
      <div className="collapse show" id={`filters-${item.keyName}`}>
        <div className="card-body">
          <div className="d-flex align-items-center p-1 range-filter-form-controls">
            <input
              className="form-control custom-filter mr-2"
              value={
                searchParams.filters[item.keyName].length
                  ? searchParams.filters[item.keyName][0]
                  : ''
              }
              type="number"
              step="0.01"
              min="-5"
              max="5"
              onChange={(e) =>
                changeResultFilter(item.keyName, e.target.value, 'min')
              }
            />
            <span>to</span>
            <input
              className="form-control custom-filter ml-2"
              value={
                searchParams.filters[item.keyName].length
                  ? searchParams.filters[item.keyName][1]
                  : ''
              }
              type="number"
              step="0.01"
              min="-5"
              max="5"
              onChange={(e) =>
                changeResultFilter(item.keyName, e.target.value, 'max')
              }
            />
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="search-result-filter-group mb-4">
      <div className="search-result-filter-group-header d-flex justify-content-between align-items-center mb-2">
        <div>Narrow results using filters below.</div>
        <button
          type="button"
          className="btn btn-link"
          onClick={() => resetSearch('filters')}
        >
          Reset filters
        </button>
      </div>
      {commonSearchResultFilters}
      {rangeSearchResultFilters}
      <div className="submit-search-filters-button text-right">
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={(e) => {
            e.preventDefault();
            handleSearch(searchParams, 'filters');
          }}
        >
          Update results
        </button>
      </div>
    </div>
  );
}

SearchResultFilters.propTypes = {
  searchParams: PropTypes.shape({ ...searchParamsPropType }).isRequired,
  changeResultFilter: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
};

export default SearchResultFilters;
