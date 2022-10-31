import React, { useState } from 'react';
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
  enabledFilters,
}) {
  const [inputError, setInputError] = useState(false);
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
          /^(transcript-rna-seq|epigen-atac-seq|epigen-rrbs|immunoassay|prot-pr|prot-ph|prot-ac|prot-ub)$/
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
            /^(transcript-rna-seq|epigen-atac-seq|epigen-rrbs|immunoassay|prot-pr|prot-ph|prot-ac|prot-ub|prot-ub-protein-corrected)$/
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
            const isDisabledFilter =
              enabledFilters[item.keyName] &&
              Object.keys(enabledFilters[item.keyName]).length &&
              !enabledFilters[item.keyName][filter.filter_value.toLowerCase()];
            return (
              <button
                key={filter.filter_label}
                type="button"
                className={`btn filterBtn ${
                  isActiveFilter ? 'activeFilter' : ''
                }`}
                onClick={() => {
                  if (isDisabledFilter) return false;
                  changeResultFilter(item.keyName, filter.filter_value, null);
                }}
                disabled={isDisabledFilter}
              >
                {filter.filter_label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ));

  // Handler to validate range filter input via onBlur event
  function handleInputValidation(e) {
    e.preventDefault();
    if (e.target.value.length && isNaN(e.target.value)) {
      e.target.classList.add('error');
      setInputError(true);
    } else {
      if (e.target.classList.contains('error'))
        e.target.classList.remove('error');
      setInputError(false);
    }
  }

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
              className={`form-control mr-2 custom-filter range-filter-input ${item.keyName}-min`}
              value={searchParams.filters[item.keyName].min}
              type="text"
              onChange={(e) => {
                setInputError(false);
                changeResultFilter(item.keyName, e.target.value, 'min');
              }}
              onBlur={(e) => handleInputValidation(e)}
            />
            <span>to</span>
            <input
              className={`form-control ml-2 custom-filter range-filter-input ${item.keyName}-max`}
              value={searchParams.filters[item.keyName].max}
              type="text"
              onChange={(e) => {
                setInputError(false);
                changeResultFilter(item.keyName, e.target.value, 'max');
              }}
              onBlur={(e) => handleInputValidation(e)}
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
        {inputError && (
          <div className="input-error-notify mb-2">
            Please correct input values above.
          </div>
        )}
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={(e) => {
            e.preventDefault();
            handleSearch(searchParams, 'filters');
          }}
          disabled={inputError}
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
  enabledFilters: PropTypes.shape({
    assay: PropTypes.object,
    comparison_group: PropTypes.object,
    sex: PropTypes.object,
    tissue: PropTypes.object,
  }),
};

SearchResultFilters.defaultProps = {
  enabledFilters: {},
};

export default SearchResultFilters;
