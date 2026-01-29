import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import {
  defaultOmeList,
  optionalOmeList,
  studyList,
  sexList,
  tissues,
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
  profile = {},
  includeEpigenomics = false,
  toggleEpigenomics,
}) {
  const [inputError, setInputError] = useState(false);
  const [isAutoSearching, setIsAutoSearching] = useState(false);

  // Ref to track initial mount - prevent auto-search on first render
  const isInitialMount = useRef(true);
  // Ref to store the debounce timer
  const debounceTimerRef = useRef(null);
  // Ref to store the previous fingerprint to prevent infinite loops
  const previousFingerprintRef = useRef(null);

  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Create a fingerprint of button filters (excludes range filters)
  // This is used to detect changes that should trigger auto-search
  const buttonFilterFingerprint = JSON.stringify({
    study: searchParams.study || [],
    omics: searchParams.omics || [],
    tissue: searchParams.filters?.tissue || [],
    assay: searchParams.filters?.assay || [],
    sex: searchParams.filters?.sex || [],
    timepoint: searchParams.filters?.timepoint || [],
  });

  // Debounced auto-search when button filters change
  useEffect(() => {
    // Skip auto-search on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousFingerprintRef.current = buttonFilterFingerprint;
      return;
    }

    // Skip if fingerprint hasn't actually changed (prevents infinite loops)
    if (previousFingerprintRef.current === buttonFilterFingerprint) {
      return;
    }

    // Update the previous fingerprint
    previousFingerprintRef.current = buttonFilterFingerprint;

    // Don't auto-search if there's an input error (from range filters)
    if (inputError) {
      return;
    }

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set visual feedback that search will happen
    setIsAutoSearching(true);

    // Debounce the search by 600ms to allow for multiple quick selections
    debounceTimerRef.current = setTimeout(() => {
      handleSearch(searchParams, searchParams.keys, 'filters', userType);
      setIsAutoSearching(false);

      // Track auto-search event in Google Analytics 4
      trackEvent(
        'Differential Abundance Search',
        'search_filters_auto',
        profile && profile.userid
          ? profile.userid.substring(profile.userid.indexOf('|') + 1)
          : 'anonymous',
        searchParams.keys,
      );
    }, 600);

    // Cleanup timer on unmount or when dependencies change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonFilterFingerprint]);

  // Customize tissue list based on user type and ktype
  function customizeTissueList() {
    // If study isn't set yet, still show tissues

    // Internal users see all tissues; external users don't see aorta (pass1a06 tissue)
    const isInternal = userType && userType === 'internal';
    let tissueList = isInternal ? [...tissues] : tissues.filter((t) => t.filter_value !== 'aorta');

    // Filter tissues based on ktype (gene, protein, metabolite)
    switch (searchParams.ktype) {
      case 'gene':
        // Plasma not available for transcriptomics/epigenomics
        return tissueList.filter((t) => t.filter_value !== 'plasma');
      case 'protein':
        // Only specific tissues available for proteomics
        return tissueList.filter((t) =>
          /^(cortex|gastrocnemius|heart|kidney|lung|liver|white adipose|adipose|blood|muscle)$/.test(t.filter_value)
        );
      case 'metab':
        // Blood RNA not available for metabolomics
        return tissueList.filter((t) => t.filter_value !== 'blood rna');
      default:
        return tissueList;
    }
  }

  const defaultTimepoints = [...timepointListRatEndurance, ...timepointListHuman];

  const studySearchFilters = [
    {
      keyName: 'study',
      name: 'Study',
      // Internal users always see all study buttons; external users never see pass1a06
      filters: (userType && userType === 'internal') ? studyList : studyList.filter((s) => s.filter_value !== 'pass1a06'),
    },
  ];

  // Helper function to render ome filter button
  const renderOmeFilterButton = (filter, isOptional = false) => {
    const paramKey = filter.filter_param; // 'omics' or 'assay'
    const isActiveFilter =
      paramKey === 'omics'
        ? searchParams.omics?.includes(filter.filter_value)
        : searchParams.filters?.assay?.includes(filter.filter_value);

    // Simplified: Always enabled, except epigenomics filters require the toggle
    const isDisabled = isOptional && !includeEpigenomics;

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
        {filter.species && (
          <span className={`filter-species-tag ml-1 badge ${filter.species === 'rat' ? 'badge-rat' : 'badge-human'}`}>
            {filter.species === 'rat' ? 'R' : 'H'}
          </span>
        )}
      </button>
    );
  };

  // Ome filter panel with default and optional (epigenomics) filters
  const omeSearchResultFilters = (
    <div className="card filter-module mb-3">
      <div className="card-header font-weight-bold">
        <div className="card-header-label">
          <span>Ome</span>
          <i
            className="bi bi-info-circle-fill ml-2 text-secondary"
            data-tooltip-id="ome-filter-tooltip"
            data-tooltip-html="<span>H = Human, R = Rat</span>"
            data-tooltip-place="right"
          />
          <Tooltip id="ome-filter-tooltip" />
        </div>
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
              onChange={(e) => toggleEpigenomics?.(e.target.checked)}
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
      tooltip: '<span>H = Human, R = Rat</span>',
    },
    {
      keyName: 'sex',
      name: 'Sex Stratum',
      filters: sexList,
      tooltip: '<span>Filter by sex-stratified results. Unstratified<br />results are indicated by "None".<br />H = Human, R = Rat</span>',
    }
  ];

  // Get all timepoints based on user type
  // Internal users see all timepoints; external users see default (endurance + human) only
  const isInternal = userType && userType === 'internal';
  const allTimepoints = isInternal
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

    return (
      <button
        key={filter.filter_label}
        type="button"
        className={`btn filterBtn ${isActiveFilter ? 'activeFilter' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          changeResultFilter('timepoint', filter.filter_value, null);
        }}
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
            data-tooltip-html="<span>H = Human, R = Rat</span>"
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
        <div className="card-header-label">
          <span>{item.name}</span>
          <i
            className="bi bi-info-circle-fill ml-2 text-secondary"
            data-tooltip-id="study-filter-tooltip"
            data-tooltip-html="<span>The human data included here are<br />limited to a subset of sedentary adults<br />who underwent an acute exercise bout<br />prior to study suspension for Covid-19.<br />H = Human, R = Rat</span>"
            data-tooltip-place="right"
          />
          <Tooltip id="study-filter-tooltip" />
        </div>
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

  const commonSearchResultFilters = commonSearchFilters.map((item) => (
    <div key={item.name} className="card filter-module mb-3">
      <div className="card-header font-weight-bold">
        <div className="card-header-label">
          <span>{item.name}</span>
          <i
            className="bi bi-info-circle-fill ml-2 text-secondary"
            data-tooltip-id={`${item.keyName}-filter-tooltip`}
            data-tooltip-html={item.tooltip}
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

  return (
    <div className="search-result-filter-group mb-4">
      <div className="search-result-filter-group-header d-flex justify-content-between align-items-center mb-3">
        <div className="font-weight-bold d-flex align-items-center">
          Filter results:
          {isAutoSearching && (
            <span className="auto-search-indicator ml-2">
              <span className="spinner-border spinner-border-sm text-secondary" role="status" aria-hidden="true" />
            </span>
          )}
        </div>
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
            disabled={inputError || isAutoSearching}
          >
            Update results
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => resetSearch('filters')}
            disabled={isAutoSearching}
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
    </div>
  );
}

SearchResultFilters.propTypes = {
  searchParams: PropTypes.shape({
    ...searchParamsPropType,
    ktype: PropTypes.string,
    keys: PropTypes.arrayOf(PropTypes.string),
    study: PropTypes.arrayOf(PropTypes.string),
    omics: PropTypes.arrayOf(PropTypes.string),
    filters: PropTypes.shape({
      assay: PropTypes.arrayOf(PropTypes.string),
      tissue: PropTypes.arrayOf(PropTypes.string),
      timepoint: PropTypes.arrayOf(PropTypes.string),
      sex: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  changeResultFilter: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
  includeEpigenomics: PropTypes.bool,
  toggleEpigenomics: PropTypes.func.isRequired,
};

export default SearchResultFilters;
