import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useBiospecimenData } from '../hooks/useBiospecimenData';
import BiospecimenFilters from './BiospecimenFilters';
import BiospecimenChart from './BiospecimenChart';
import {
  DEFAULT_FILTERS,
  FILTER_OPTIONS,
  RANDOMIZED_GROUP_MAPPING,
  filterUtils,
} from '../constants/plotOptions';

/**
 * Main Interactive Biospecimen Visualization component
 * Features:
 * - Side-by-side: Filters box on left, chart on right
 * - Modular component structure
 * - Click-to-drill-down table functionality
 */
const InteractiveBiospecimenChart = () => {
  // Filter state management with default selections from constants
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Selected bar state for drill-down
  const [selectedBar, setSelectedBar] = useState(null);

  // Convert filter arrays to API format (comma-separated strings)
  // Memoized with proper dependencies to prevent unnecessary recalculations
  const apiFilters = useMemo(() => {
    const filters_obj = {};

    // Only include sex filter if not all options are selected (user has made a selection)
    if (
      filters.sex.length > 0 &&
      filters.sex.length < FILTER_OPTIONS.sexOptions.length
    ) {
      filters_obj.sex = filters.sex.join(',');
    }

    // Only include age groups filter if not all options are selected (user has made a selection)
    if (
      filters.dmaqc_age_groups.length > 0 &&
      filters.dmaqc_age_groups.length < FILTER_OPTIONS.ageGroupOptions.length
    ) {
      filters_obj.dmaqc_age_groups = filters.dmaqc_age_groups.join(',');
    }

    // Always include randomized group with proper mapping from constants
    if (
      filters.random_group_code &&
      RANDOMIZED_GROUP_MAPPING[filters.random_group_code]
    ) {
      filters_obj.random_group_code =
        RANDOMIZED_GROUP_MAPPING[filters.random_group_code];
    }

    return filters_obj;
  }, [filters.sex, filters.dmaqc_age_groups, filters.random_group_code]);

  // Load filtered data
  const { data, loading, error } = useBiospecimenData(apiFilters);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear any selected bar state to prevent stale references
      setSelectedBar(null);
    };
  }, []);

  // Static filter options from constants - memoized to prevent recreating object
  const filterOptions = useMemo(() => FILTER_OPTIONS, []);

  // Handle checkbox filter changes (sex, age groups)
  // Optimized with stable callback to prevent unnecessary rerenders
  const handleCheckboxChange = useCallback((filterType, value, checked) => {
    setFilters((prev) => {
      const currentValues = prev[filterType];
      if (checked) {
        // Check if value already exists to prevent duplicates
        if (currentValues.includes(value)) return prev;
        return {
          ...prev,
          [filterType]: [...currentValues, value],
        };
      } else {
        // Only update if value actually exists
        if (!currentValues.includes(value)) return prev;
        return {
          ...prev,
          [filterType]: currentValues.filter((v) => v !== value),
        };
      }
    });
    setSelectedBar(null);
  }, []);

  // Handle radio button filter change (random_group_code)
  const handleRadioChange = useCallback((value) => {
    setFilters((prev) => ({
      ...prev,
      random_group_code: value,
    }));
    setSelectedBar(null);
  }, []);

  // Reset filters to default selections using utility function
  const handleResetFilters = useCallback(() => {
    setFilters(filterUtils.resetToDefaults());
    setSelectedBar(null);
  }, []);

  // Handle bar click for drill-down
  const handleBarClick = useCallback((event) => {
    const point = event.point;
    setSelectedBar({
      phase: point.phase,
      tissue: point.tissue,
      samples: point.samples,
      count: point.y,
      assayTypes: point.assayTypes,
    });
  }, []);

  return (
    <div className="interactive-biospecimen-chart">
      {/* Side-by-Side Layout: Filters on Left, Chart on Right */}
      <div className="row mb-4">
        {/* Filter Controls - Left Side */}
        <div className="col-lg-3">
          <BiospecimenFilters
            filters={filters}
            filterOptions={filterOptions}
            onCheckboxChange={handleCheckboxChange}
            onRadioChange={handleRadioChange}
            onResetFilters={handleResetFilters}
            loading={loading}
          />
        </div>

        {/* Chart - Right Side */}
        <div className="col-lg-9">
          <BiospecimenChart
            data={data}
            loading={loading}
            error={error}
            onBarClick={handleBarClick}
          />
        </div>
      </div>
    </div>
  );
};

InteractiveBiospecimenChart.propTypes = {};

export default InteractiveBiospecimenChart;
