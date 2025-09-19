import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useBiospecimenData } from '../hooks/useBiospecimenData';
import BiospecimenFilters from './BiospecimenFilters';
import BiospecimenChart from './BiospecimenChart';
import {
  DEFAULT_FILTERS,
  FILTER_OPTIONS,
  RANDOMIZED_GROUP_MAPPING,
  CHART_AXIS_OPTIONS,
  CHART_AXIS_LABELS,
  DEFAULT_CHART_AXIS,
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

  // Chart axis mode state
  const [axisMode, setAxisMode] = useState(DEFAULT_CHART_AXIS);

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

  // Handle axis mode change
  const handleAxisModeChange = useCallback((newAxisMode) => {
    setAxisMode(newAxisMode);
    setSelectedBar(null); // Clear selection when changing axis mode
  }, []);

  // Handle bar click for drill-down
  const handleBarClick = useCallback((event) => {
    const point = event.point;
    setSelectedBar({
      phase: point.phase,
      tissue: point.tissue,
      timepoint: point.timepoint,
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
        <div className="col-lg-2">
          <BiospecimenFilters
            filters={filters}
            filterOptions={filterOptions}
            onCheckboxChange={handleCheckboxChange}
            onRadioChange={handleRadioChange}
          />
        </div>

        {/* Chart - Right Side */}
        <div className="col-lg-10">
          {/* Chart Axis Mode Toggle */}
          <div className="card mb-3">
            <div className="card-body py-2">
              <div className="row align-items-center">
                <div className="col-auto">
                  <small className="text-muted fw-bold">Chart View:</small>
                </div>
                <div className="col-auto">
                  <div className="btn-group btn-group-sm" role="group" aria-label="Chart axis mode">
                    {Object.values(CHART_AXIS_OPTIONS).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        className={`btn btn-outline-primary ${axisMode === mode ? 'active' : ''}`}
                        onClick={() => handleAxisModeChange(mode)}
                      >
                        {CHART_AXIS_LABELS[mode]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BiospecimenChart
            data={data}
            loading={loading}
            error={error}
            onBarClick={handleBarClick}
            axisMode={axisMode}
          />
        </div>
      </div>

      {/* Drill-down table when a bar is clicked */}
      {selectedBar && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <i className="bi bi-table mr-2" />
                  {selectedBar.tissue} - {selectedBar.phase}
                  {selectedBar.timepoint && ` - ${selectedBar.timepoint}`} ({selectedBar.count} samples)
                </h6>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelectedBar(null)}
                >
                  <i className="bi bi-x" />
                </button>
              </div>
              <div className="card-body">
                {selectedBar.assayTypes.length > 0 && (
                  <p className="mb-3">
                    <strong>Available Assays:</strong> {selectedBar.assayTypes.join(', ')}
                  </p>
                )}
                <div className="table-responsive">
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th>Vial Label</th>
                        <th>Tranche</th>
                        <th>Visit Code</th>
                        <th>Randomized Group</th>
                        <th>Tissue</th>
                        <th>Sex</th>
                        <th>Age Group</th>
                        <th>Timepoint</th>
                        <th>BMI</th>
                        <th>Temp Sample Profile</th>
                        <th>CAS Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBar.samples.slice(0, 100).map((sample, index) => (
                        <tr key={index}>
                          <td>{sample.vial_label || 'N/A'}</td>
                          <td>{sample.tranche || 'N/A'}</td>
                          <td>{sample.visit_code || 'N/A'}</td>
                          <td>{sample.random_group_code || 'N/A'}</td>
                          <td>{sample.sample_group_code || 'N/A'}</td>
                          <td>{sample.sex || 'N/A'}</td>
                          <td>{sample.dmaqc_age_groups || 'N/A'}</td>
                          <td>{sample.timepoint || 'N/A'}</td>
                          <td>{sample.bmi || 'N/A'}</td>
                          <td>{sample.temp_samp_profile || 'N/A'}</td>
                          <td>{sample.received_cas || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selectedBar.samples.length > 100 && (
                    <p className="text-muted small">
                      Showing first 100 of {selectedBar.samples.length} samples
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

InteractiveBiospecimenChart.propTypes = {};

export default InteractiveBiospecimenChart;
