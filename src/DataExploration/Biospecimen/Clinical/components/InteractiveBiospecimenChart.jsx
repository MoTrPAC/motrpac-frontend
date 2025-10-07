import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useBiospecimenData, useFilteredBiospecimenData } from '../hooks/useBiospecimenData';
import { useAdvancedPagination } from '../hooks/useAdvancedPagination';
import BiospecimenFilters from './BiospecimenFilters';
import BiospecimenChart from './BiospecimenChart';
import {
  DEFAULT_FILTERS,
  FILTER_OPTIONS,
  CHART_AXIS_OPTIONS,
  CHART_AXIS_LABELS,
  DEFAULT_CHART_AXIS,
} from '../constants/plotOptions';
import roundNumbers from '../../../../lib/utils/roundNumbers';

import '@styles/biospecimenSummary.scss';

/**
 * Main Interactive Biospecimen Visualization component
 * Simplified approach: Load all data once, filter client-side for instant performance
 */
const InteractiveBiospecimenChart = () => {
  // Filter state management with default selections from constants
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Selected bar state for drill-down
  const [selectedBar, setSelectedBar] = useState(null);

  // Chart axis mode state
  const [axisMode, setAxisMode] = useState(DEFAULT_CHART_AXIS);

  // Load all data once (simplified approach)
  const { allData, loading, error, refresh } = useBiospecimenData();

  // Client-side filtering (instant, no API calls)
  const filteredData = useFilteredBiospecimenData(allData, filters);

  // Pagination for drill-down table
  const tablePagination = useAdvancedPagination(selectedBar?.samples || [], {
    initialPageSize: 20,
    enableUrlSync: false,
    enableAnalytics: false,
    maxPagesToShow: 5,
    debounceDelay: 100,
  });

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear any selected bar state to prevent stale references
      setSelectedBar(null);
    };
  }, []);

  // Reset table pagination when selectedBar changes
  useEffect(() => {
    if (selectedBar) {
      tablePagination.resetPagination();
    }
  }, [selectedBar, tablePagination.resetPagination]);

  // Static filter options from constants - memoized to prevent recreating object
  const filterOptions = useMemo(() => FILTER_OPTIONS, []);

  // Handle checkbox filter changes (all filters now use checkboxes)
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

  // Handle axis mode change
  const handleAxisModeChange = useCallback((newAxisMode) => {
    setAxisMode(newAxisMode);
    setSelectedBar(null); // Clear selection when changing axis mode
  }, []);

  // Custom export function for drill-down table data
  const exportDrillDownData = useCallback(() => {
    if (!selectedBar || !selectedBar.samples) return;
    
    const header = 'Vial Label,Participant ID,Tranche,Visit Code,Randomized Group,Tissue,Sex,Age Group,Timepoint,BMI,Temp Sample Profile,CAS Received\n';
    const rows = selectedBar.samples.map(sample => 
      `${sample.vial_label || ''},${sample.pid || ''},${transformTrancheCode(sample.tranche) || ''},${sample.visit_code || ''},${sample.random_group_code || ''},${transformTissueCode(sample.sample_group_code) || ''},${sample.sex || ''},${sample.dmaqc_age_groups || ''},${sample.timepoint || ''},${roundNumbers(sample.bmi, 1) || ''},${sample.temp_samp_profile || ''},${Number(sample.received_cas) === 1 ? 'Yes' : 'No'}`
    ).join('\n');
    const csvData = 'data:text/csv;charset=utf-8,' + header + rows;
    const encodedUri = encodeURI(csvData);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `biospecimen_drilldown_${selectedBar.tissue}_${selectedBar.phase || selectedBar.timepoint || selectedBar.assay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedBar]);

  // Handle bar click for drill-down
  const handleBarClick = useCallback((event) => {
    const point = event.point;
    setSelectedBar({
      phase: point.phase,
      tissue: point.tissue,
      timepoint: point.timepoint,
      assay: point.assay, // New field for assay mode
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
          />
        </div>

        {/* Chart - Right Side */}
        <div className="col-lg-9">
          {/* Show loading state during initial data load */}
          {loading && (
            <div className="card mb-3 border-info">
              <div className="card-body text-center py-4">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <h5 className="text-muted mb-2">Loading biospecimen data...</h5>
                <p className="text-muted mb-0">Please wait while we fetch all available data.</p>
              </div>
            </div>
          )}

          {/* Show error state */}
          {error && (
            <div className="card mb-3 border-danger">
              <div className="card-body text-center py-4">
                <h5 className="text-danger mb-3">
                  <i className="bi bi-exclamation-triangle mr-2" />
                  Error Loading Data
                </h5>
                <p className="text-muted mb-3">{error}</p>
                <button className="btn btn-outline-primary" onClick={refresh}>
                  <i className="bi bi-arrow-clockwise mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Chart controls and chart - only show when data is loaded */}
          {!loading && !error && allData.length > 0 && (
            <>
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
                    {/*
                    <div className="col-auto ml-auto">
                      <small className="text-muted">
                        Showing {filteredData.length.toLocaleString()} of {allData.length.toLocaleString()} samples
                      </small>
                    </div>
                    */}
                  </div>
                </div>
              </div>

              <BiospecimenChart
                data={filteredData}
                loading={false} // Data is already loaded
                error={null}
                onBarClick={handleBarClick}
                axisMode={axisMode}
              />
            </>
          )}
        </div>
      </div>

      {/* Drill-down table when a bar is clicked */}
      {selectedBar && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-table mr-2" />
                  {selectedBar.tissue} {selectedBar.phase && ` - ${selectedBar.phase}`}
                  {selectedBar.timepoint && ` - ${selectedBar.timepoint}`}
                  {selectedBar.assay && ` - ${selectedBar.assay}`} ({selectedBar.count} samples)
                </h5>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setSelectedBar(null)}
                >
                  <i className="bi bi-x" />
                </button>
              </div>
              <div className="card-body">
                {/* Pagination controls - top */}
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mt-3 p-3 bg-light rounded">
                  <div className="d-flex align-items-center mb-2 mb-lg-0">
                    <span className="text-muted small mr-3">
                      <strong>
                        {tablePagination.startIndex.toLocaleString()} - {tablePagination.endIndex.toLocaleString()}
                      </strong>
                      {' of '}
                      <strong>{tablePagination.totalItems.toLocaleString()}</strong>
                      {' samples'}
                    </span>
                    
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={exportDrillDownData}
                      title="Export all drill-down data to CSV"
                    >
                      <i className="bi bi-download mr-1" />
                      Export
                    </button>
                  </div>

                  {tablePagination.totalPages > 1 && (
                    <div className="d-flex align-items-center mb-2 mb-lg-0">
                      <nav aria-label="Drill-down table pagination">
                        <ul className="pagination pagination-sm mb-0">
                          <li className={`page-item ${!tablePagination.hasPreviousPage ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={tablePagination.goToFirstPage}
                              disabled={!tablePagination.hasPreviousPage || tablePagination.isNavigating}
                              aria-label="First page"
                            >
                              <i className="bi bi-chevron-double-left" />
                            </button>
                          </li>

                          <li className={`page-item ${!tablePagination.hasPreviousPage ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={tablePagination.goToPreviousPage}
                              disabled={!tablePagination.hasPreviousPage || tablePagination.isNavigating}
                              aria-label="Previous page"
                            >
                              <i className="bi bi-chevron-left" />
                            </button>
                          </li>

                          {tablePagination.getPageNumbers().map((page, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                page === tablePagination.currentPage ? 'active' : ''
                              } ${page === '...' ? 'disabled' : ''}`}
                            >
                              {page === '...' ? (
                                <span className="page-link">...</span>
                              ) : (
                                <button
                                  className="page-link"
                                  onClick={() => tablePagination.goToPage(page)}
                                  disabled={tablePagination.isNavigating}
                                  aria-label={`Go to page ${page}`}
                                  aria-current={page === tablePagination.currentPage ? 'page' : undefined}
                                >
                                  {page}
                                </button>
                              )}
                            </li>
                          ))}

                          <li className={`page-item ${!tablePagination.hasNextPage ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={tablePagination.goToNextPage}
                              disabled={!tablePagination.hasNextPage || tablePagination.isNavigating}
                              aria-label="Next page"
                            >
                              <i className="bi bi-chevron-right" />
                            </button>
                          </li>

                          <li className={`page-item ${!tablePagination.hasNextPage ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={tablePagination.goToLastPage}
                              disabled={!tablePagination.hasNextPage || tablePagination.isNavigating}
                              aria-label="Last page"
                            >
                              <i className="bi bi-chevron-double-right" />
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}

                  <div className="d-flex align-items-center">
                    {tablePagination.isNavigating && (
                      <div className="spinner-border spinner-border-sm text-primary mr-3" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    
                    <div className="d-flex align-items-center text-muted small">
                      <span className="mr-2">Show:</span>
                      <select
                        className="form-control form-control-sm"
                        style={{ width: 'auto' }}
                        value={tablePagination.itemsPerPage}
                        onChange={(e) => tablePagination.changePageSize(parseInt(e.target.value))}
                        disabled={tablePagination.isNavigating}
                      >
                        {[10, 20, 50, 100].map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                      <span className="ml-2">per page</span>
                    </div>
                  </div>
                </div>
                
                <div className="biospecimen-lookup-table table-responsive mt-3">
                  <table className="table table-striped table-hover table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">Vial Label</th>
                        <th scope="col">Participant ID</th>
                        <th scope="col">Tranche</th>
                        <th scope="col">Visit Code</th>
                        <th scope="col">Randomized Group</th>
                        <th scope="col">Tissue</th>
                        <th scope="col">Sex</th>
                        <th scope="col">Age Group</th>
                        <th scope="col">Timepoint</th>
                        <th scope="col">BMI</th>
                        <th scope="col">Temp Sample Profile</th>
                        <th scope="col">CAS Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tablePagination.currentPageData.map((sample, index) => (
                        <tr key={index}>
                          <td className="vial-label text-dark">{sample.vial_label}</td>
                          <td>{sample.pid}</td>
                          <td>
                            <span className="badge badge-secondary">{transformTrancheCode(sample.tranche)}</span>
                          </td>
                          <td>{sample.visit_code || 'N/A'}</td>
                          <td>{sample.random_group_code || 'N/A'}</td>
                          <td>{transformTissueCode(sample.sample_group_code)}</td>
                          <td>
                            <span className={`badge ${sample.sex === 'Male' ? 'badge-info' : 'badge-warning'}`}>
                              {sample.sex}
                            </span>
                          </td>
                          <td>{sample.dmaqc_age_groups || 'N/A'}</td>
                          <td>{sample.timepoint || 'N/A'}</td>
                          <td>{roundNumbers(sample.bmi, 1)}</td>
                          <td>{sample.temp_samp_profile || 'N/A'}</td>
                          <td>
                            <span className="badge badge-success">
                              {Number(sample.received_cas) === 1 ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination controls - bottom */}
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mt-3 p-3 bg-light rounded">
                  <div className="d-flex align-items-center mb-2 mb-lg-0">
                    <span className="text-muted small mr-3">
                      <strong>
                        {tablePagination.startIndex.toLocaleString()} - {tablePagination.endIndex.toLocaleString()}
                      </strong>
                      {' of '}
                      <strong>{tablePagination.totalItems.toLocaleString()}</strong>
                      {' samples'}
                    </span>
                    
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={exportDrillDownData}
                      title="Export all drill-down data to CSV"
                    >
                      <i className="bi bi-download mr-1" />
                      Export
                    </button>
                  </div>

                  {tablePagination.totalPages > 1 && (
                    <div className="d-flex align-items-center mb-2 mb-lg-0">
                      <nav aria-label="Drill-down table pagination">
                        <ul className="pagination pagination-sm mb-0">
                          <li className={`page-item ${!tablePagination.hasPreviousPage ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={tablePagination.goToFirstPage}
                              disabled={!tablePagination.hasPreviousPage || tablePagination.isNavigating}
                              aria-label="First page"
                            >
                              <i className="bi bi-chevron-double-left" />
                            </button>
                          </li>

                          <li className={`page-item ${!tablePagination.hasPreviousPage ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={tablePagination.goToPreviousPage}
                              disabled={!tablePagination.hasPreviousPage || tablePagination.isNavigating}
                              aria-label="Previous page"
                            >
                              <i className="bi bi-chevron-left" />
                            </button>
                          </li>

                          {tablePagination.getPageNumbers().map((page, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                page === tablePagination.currentPage ? 'active' : ''
                              } ${page === '...' ? 'disabled' : ''}`}
                            >
                              {page === '...' ? (
                                <span className="page-link">...</span>
                              ) : (
                                <button
                                  className="page-link"
                                  onClick={() => tablePagination.goToPage(page)}
                                  disabled={tablePagination.isNavigating}
                                  aria-label={`Go to page ${page}`}
                                  aria-current={page === tablePagination.currentPage ? 'page' : undefined}
                                >
                                  {page}
                                </button>
                              )}
                            </li>
                          ))}

                          <li className={`page-item ${!tablePagination.hasNextPage ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={tablePagination.goToNextPage}
                              disabled={!tablePagination.hasNextPage || tablePagination.isNavigating}
                              aria-label="Next page"
                            >
                              <i className="bi bi-chevron-right" />
                            </button>
                          </li>

                          <li className={`page-item ${!tablePagination.hasNextPage ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={tablePagination.goToLastPage}
                              disabled={!tablePagination.hasNextPage || tablePagination.isNavigating}
                              aria-label="Last page"
                            >
                              <i className="bi bi-chevron-double-right" />
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}

                  <div className="d-flex align-items-center">
                    {tablePagination.isNavigating && (
                      <div className="spinner-border spinner-border-sm text-primary mr-3" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    
                    <div className="d-flex align-items-center text-muted small">
                      <span className="mr-2">Show:</span>
                      <select
                        className="form-control form-control-sm"
                        style={{ width: 'auto' }}
                        value={tablePagination.itemsPerPage}
                        onChange={(e) => tablePagination.changePageSize(parseInt(e.target.value))}
                        disabled={tablePagination.isNavigating}
                      >
                        {[10, 20, 50, 100].map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                      <span className="ml-2">per page</span>
                    </div>
                  </div>
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

// transform tissue code to human-readable values
function transformTissueCode(code) {
  const tissueMap = {
    'BLO': 'Blood',
    'MUS': 'Muscle',
    'ADI': 'Adipose',
  };
  return tissueMap[code] || code;
}

function transformTrancheCode(code) {
  const trancheMap = {
    'TR00': 'Tranche 0',
    'TR01': 'Tranche 1',
    'TR02': 'Tranche 2',
    'TR03': 'Tranche 3',
    'TR04': 'Tranche 4',
  };
  return trancheMap[code] || code;
}