import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import {
  defaultOmeList,
  optionalOmeList,
  studyList,
  sexList,
  rangeSearchFilters,
  tissues,
  assayListGene,
  assayListProtein,
  assayListMetabolite,
  timepointListRatEndurance,
  timepointListRatAcute,
  timepointListHuman,
} from '../lib/searchFilters';
import { searchParamsPropType } from './sharedlib';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

function SearchResultFilters({
  searchParams,
  changeResultFilter,
  handleSearch,
  resetSearch,
  hasResultFilters = {},
  profile = {},
  includeEpigenomics = false,
  toggleEpigenomics,
}) {
  const [inputError, setInputError] = useState(false);

  const userType = profile.user_metadata && profile.user_metadata.userType;

  const includesPrecawg = searchParams.study.includes('precawg');
  const includesPass1b06 = searchParams.study.includes('pass1b06');
  const includesPass1a06 = searchParams.study.includes('pass1a06');

  // FIXME - this is a hack to get the search filters such as tissue and assay
  // to render accordingly to the ktype (gene, protein, metabolite)
  function customizeTissueList() {
    let tissueList = [];
    // Exclude PASS1A06 aorta tissue for external users
    const tissuesExternal = tissues.filter((t) => t.filter_value !== 'aorta');
    // Determine tissue list based on selected studies
    if (!Array.isArray(searchParams.study)) {
      return [];
    }

    // All three studies selected
    // Or precawg and Pass1b06 selected (exclude aorta from rat tissues)
    // Or single study or other combinations
    if ((includesPrecawg && includesPass1b06 && includesPass1a06) || (userType && userType === 'internal' && !searchParams.study.length)) {
      tissueList = [...tissues];
    } else if ((includesPrecawg && includesPass1b06) || (!userType || userType === 'external' && !searchParams.study.length)) {
      tissueList = [...tissuesExternal];
    } else if (!searchParams.study.length) {
      // No study selected - show all tissues based on user type
      // Default - no study selected
      if (userType && userType === 'internal') {
        tissueList = [...tissues];
      } else {
        tissueList = [...tissuesExternal];
      }
    } else {
      tissueList = [];
    }

    // rat plasma not available in epigen and transcript
    if (searchParams.ktype === 'gene') {
      return tissueList.filter((t) =>
        !t.filter_value.match(/^(plasma)$/),
      );
    }
    // rats and human tissues available in proteomics
    if (searchParams.ktype === 'protein') {
      return tissueList.filter((t) =>
        t.filter_value.match(
          /^(cortex|gastrocnemius|heart|kidney|lung|liver|white adipose|adipose|blood|muscle)$/,
        ),
      );
    }
    // rat blood rna not available in metabolomics
    if (searchParams.ktype === 'metab') {
      return tissueList.filter((t) => t.filter_value !== 'blood rna');
    }
    
    return tissueList;
  }

  const defaultTimepoints = [...timepointListRatEndurance, ...timepointListHuman];

  const studySearchFilters = [
    {
      keyName: 'study',
      name: 'Study',
      filters: includesPass1a06 ? studyList : studyList.filter((s) => s.filter_value !== 'pass1a06'),
    },
  ];

  // Helper function to render ome filter button
  const renderOmeFilterButton = (filter, isOptional = false) => {
    const paramKey = filter.filter_param; // 'omics' or 'assay'
    const isActiveFilter =
      paramKey === 'omics'
        ? searchParams.omics?.includes(filter.filter_value)
        : searchParams.filters?.assay?.includes(filter.filter_value);

    const resultCount =
      hasResultFilters?.[paramKey] &&
      Object.keys(hasResultFilters[paramKey]).length &&
      hasResultFilters[paramKey][filter.filter_value.toLowerCase()];

    // Optional (epigenomics) filters: disabled only when epigenomics toggle is off
    // Default filters: disabled based on result count
    const isDisabled = isOptional ? !includeEpigenomics : !resultCount;

    return (
      <button
        key={filter.filter_label}
        type="button"
        className={`btn filterBtn ${isActiveFilter ? 'activeFilter' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          changeResultFilter(paramKey, filter.filter_value, null);

          if (paramKey === 'assay' && filter.filter_ome) {
            const isSelecting = !isActiveFilter;
            const omeAlreadyInArray = searchParams.omics?.includes(filter.filter_ome);

            if (isSelecting && !omeAlreadyInArray) {
              changeResultFilter('omics', filter.filter_ome, null);
            } else if (!isSelecting && omeAlreadyInArray) {
              const allOmeFilters = [...defaultOmeList, ...optionalOmeList];
              const otherAssaysWithSameOme = allOmeFilters.filter(
                (f) =>
                  f.filter_param === 'assay' &&
                  f.filter_ome === filter.filter_ome &&
                  f.filter_value !== filter.filter_value &&
                  searchParams.filters?.assay?.includes(f.filter_value)
              );
              if (otherAssaysWithSameOme.length === 0) {
                changeResultFilter('omics', filter.filter_ome, null);
              }
            }
          }
        }}
        disabled={isDisabled}
      >
        {filter.filter_label}
      </button>
    );
  };

  // Ome filter panel with default and optional (epigenomics) filters
  const omeSearchResultFilters = (
    <div className="card filter-module mb-3">
      <div className="card-header font-weight-bold">
        <div className="card-header-label">Ome</div>
      </div>
      <div className="card-body-container" id="filters-ome">
        <div className="card-body">
          {/* Default ome filters */}
          {defaultOmeList.map((filter) => renderOmeFilterButton(filter, false))}

          {/* Divider and epigenomics section */}
          <hr className="my-2 mx-1" />
          <div className="form-group form-check mb-2 mx-1">
            <input
              type="checkbox"
              className="form-check-input"
              id="includeEpigenomicsCheckbox"
              checked={includeEpigenomics}
              onChange={(e) => toggleEpigenomics(e.target.checked)}
            />
            <label
              className="form-check-label"
              htmlFor="includeEpigenomicsCheckbox"
            >
              Include Epigenomics
            </label>
          </div>
          {/* Optional epigenomics filters - always visible but disabled unless toggled */}
          {optionalOmeList.map((filter) => renderOmeFilterButton(filter, true))}
        </div>
      </div>
    </div>
  );

  const commonSearchFilters = [
    {
      keyName: 'tissue',
      name: 'Tissue',
      filters: customizeTissueList(),
      tooltip: 'H = Human tissue, R = Rat tissue',
    },
    {
      keyName: 'sex',
      name: 'Sex Stratum',
      filters: sexList,
      tooltip: 'Filter by sex-stratified results. Unstratified results are indicated by "None".',
    }
  ];

  // Get all timepoints based on selected studies
  const allTimepoints = includesPrecawg && includesPass1b06 && includesPass1a06
    ? [...defaultTimepoints, ...timepointListRatAcute]
    : defaultTimepoints;

  // Group timepoints by intervention
  const groupedTimepoints = allTimepoints.reduce((acc, timepoint) => {
    const intervention = timepoint.intervention || 'other';
    if (!acc[intervention]) {
      acc[intervention] = [];
    }
    acc[intervention].push(timepoint);
    return acc;
  }, {});

  // Labels for intervention groups
  const interventionLabels = {
    'training': 'Training',
    'acute exercise': 'Acute Exercise',
  };

  // Helper function to render timepoint filter buttons
  const renderTimepointFilterButton = (filter) => {
    const isActiveFilter =
      searchParams.filters?.timepoint &&
      searchParams.filters.timepoint.includes(filter.filter_value);
    const resultCount =
      hasResultFilters?.timepoint &&
      Object.keys(hasResultFilters.timepoint).length &&
      hasResultFilters.timepoint[filter.filter_value.toLowerCase()];
    return (
      <button
        key={filter.filter_label}
        type="button"
        className={`btn filterBtn ${isActiveFilter ? 'activeFilter' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          changeResultFilter('timepoint', filter.filter_value, null);
        }}
        disabled={!resultCount}
      >
        {filter.filter_label}
        {filter.species && (
          <span className={`filter-species-tag ml-1 badge ${filter.species === 'rat' ? 'badge-rat' : 'badge-human'}`}>
            {filter.species === 'rat' ? 'R' : 'H'}
          </span>
        )}
      </button>
    );
  };

  // Render timepoint filters grouped by intervention
  const timepointSearchResultFilters = (
    <div className="card filter-module mb-3">
      <div className="card-header font-weight-bold">
        <div className="card-header-label">
          <span>Timepoint</span>
          <i
            className="bi bi-info-circle-fill ml-2 text-secondary"
            data-tooltip-id="timepoint-filter-tooltip"
            data-tooltip-content="H = Human tissue, R = Rat tissue"
            data-tooltip-place="right"
          />
          <Tooltip id="timepoint-filter-tooltip" />
        </div>
      </div>
      <div className="card-body-container" id="filters-timepoint">
        <div className="card-body">
          {Object.entries(groupedTimepoints).map(([intervention, timepoints]) => (
            <div key={intervention} className="timepoint-group">
              <div className="timepoint-group-label text-muted font-weight-bold small mt-2 mb-1 mx-1">
                {interventionLabels[intervention] || intervention}
              </div>
              {timepoints.map((filter) => renderTimepointFilterButton(filter))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const studySearchResultFilters = studySearchFilters.map((item) => (
    <div key={item.name} className="card filter-module mb-3">
      <div className="card-header font-weight-bold">
        <div className="card-header-label">{item.name}</div>
      </div>
      <div className="card-body-container" id={`filters-${item.keyName}`}>
        <div className="card-body">
          {item.filters.map((filter) => {
            const isActiveFilter =
              searchParams[item.keyName] &&
              searchParams[item.keyName].indexOf(filter.filter_value) > -1;
            return (
              <button
                key={filter.filter_label}
                type="button"
                className={`btn filterBtn ${
                  isActiveFilter ? 'activeFilter' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  changeResultFilter(item.keyName, filter.filter_value, null);
                }}
              >
                {filter.filter_label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ));

  const commonSearchResultFilters = commonSearchFilters.map((item) => (
    <div key={item.name} className="card filter-module mb-3">
      <div className="card-header font-weight-bold">
        <div className="card-header-label">
          <span>{item.name}</span>
          <i
            className="bi bi-info-circle-fill ml-2 text-secondary"
            data-tooltip-id={`${item.keyName}-filter-tooltip`}
            data-tooltip-content={item.tooltip}
            data-tooltip-place="right"
          />
          <Tooltip id={`${item.keyName}-filter-tooltip`} />
        </div>
      </div>
      <div className="card-body-container" id={`filters-${item.keyName}`}>
        <div className="card-body">
          {item.filters.map((filter) => {
            const isActiveFilter =
              searchParams.filters?.[item.keyName] &&
              searchParams.filters[item.keyName].indexOf(filter.filter_value) >
                -1;
            const resultCount =
              hasResultFilters?.[item.keyName] &&
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
                  changeResultFilter(item.keyName, filter.filter_value, null);
                }}
                disabled={!resultCount}
              >
                {filter.filter_label}
                {filter.species && (
                  <span className={`filter-species-tag ml-1 badge ${filter.species === 'rat' ? 'badge-rat' : 'badge-human'}`}>
                    {filter.species === 'rat' ? 'R' : 'H'}
                  </span>
                )}
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
      </div>
      {/* filter body content */}
      <div className="card-body-container" id={`filters-${item.keyName}`}>
        <div className="card-body">
          <div className="d-flex align-items-center p-1 range-filter-form-controls">
            <input
              className={`form-control mr-2 custom-filter range-filter-input ${item.keyName}-min`}
              value={searchParams.filters?.[item.keyName]?.min ?? ''}
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
              value={searchParams.filters?.[item.keyName]?.max ?? ''}
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
      <div className="search-result-filter-group-header d-flex justify-content-between align-items-center mb-3">
        <div className="font-weight-bold">Filter results:</div>
        <div className="search-result-filter-submit-buttons">
          <button
            type="button"
            className="btn btn-primary btn-sm mr-2"
            onClick={(e) => {
              e.preventDefault();
              handleSearch(searchParams, searchParams.keys, 'filters', userType);
              // track event in Google Analytics 4
              trackEvent(
                'Differential Abundance Search',
                'search_filters',
                profile && profile.userid
                  ? profile.userid.substring(profile.userid.indexOf('|') + 1)
                  : 'anonymous',
                searchParams.keys,
              );
            }}
            disabled={inputError}
          >
            Update results
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => resetSearch('filters')}
          >
            Reset filters
          </button>
        </div>
      </div>
      {inputError && (
        <div className="input-error-notify mb-2">
          Please correct input values above.
        </div>
      )}
      {studySearchResultFilters}
      {omeSearchResultFilters}
      {commonSearchResultFilters}
      {timepointSearchResultFilters}
      {rangeSearchResultFilters}
    </div>
  );
}

SearchResultFilters.propTypes = {
  searchParams: PropTypes.shape({ ...searchParamsPropType }).isRequired,
  changeResultFilter: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  hasResultFilters: PropTypes.shape({
    tissue: PropTypes.object,
    assay: PropTypes.object,
    timepoint: PropTypes.object,
    sex: PropTypes.object,
  }),
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
  includeEpigenomics: PropTypes.bool,
  toggleEpigenomics: PropTypes.func.isRequired,
};

export default SearchResultFilters;
