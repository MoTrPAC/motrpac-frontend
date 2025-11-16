import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useBiospecimenData, useFilteredBiospecimenData } from '../hooks/useBiospecimenData';
import { useAdvancedPagination } from '../hooks/useAdvancedPagination';
import BiospecimenFilters from './BiospecimenFilters';
import BiospecimenChart from './BiospecimenChart';
import PaginationControls from './PaginationControls';
import {
  DEFAULT_FILTERS,
  FILTER_OPTIONS,
} from '../constants/plotOptions';
import { transformTissueCode, transformTrancheCode, transformCASReceived } from '../utils/dataTransformUtils';
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

  // Reset table pagination when selectedBar changes
  useEffect(() => {
    if (selectedBar) {
      tablePagination.resetPagination();
    }
  }, [selectedBar, tablePagination]);

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

  // Custom export function for drill-down table data
  // Optimized with helper function for row formatting and centralized transforms
  const exportDrillDownData = useCallback(() => {
    if (!selectedBar?.samples) return;
    
    // CSV header
    const header = 'Vial Label,Participant ID,Tranche,Visit Code,Randomized Group,Tissue,Sex,Age Group,Timepoint,BMI,Temp Sample Profile,CAS Received\n';
    
    // Format a single row with all transformations
    const formatRow = (sample) => [
      sample.vial_label || '',
      sample.pid || '',
      transformTrancheCode(sample.tranche) || '',
      sample.visit_code || '',
      sample.random_group_code || '',
      transformTissueCode(sample.sample_group_code) || '',
      sample.sex || '',
      sample.dmaqc_age_groups || '',
      sample.timepoint || '',
      roundNumbers(sample.bmi, 1) || '',
      sample.temp_samp_profile || '',
      transformCASReceived(sample.received_cas),
    ].join(',');
    
    // Generate CSV content
    const rows = selectedBar.samples.map(formatRow).join('\n');
    const csvContent = header + rows;
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `biospecimen_drilldown_${selectedBar.tissue || 'data'}_${selectedBar.phase || selectedBar.timepoint || selectedBar.assay || 'export'}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  }, [selectedBar]);

  // Handle bar click for drill-down
  // Optimized to extract only necessary data from event
  const handleBarClick = useCallback((event) => {
    const { point } = event;
    
    const barData = {
      phase: point.phase,
      tissue: point.tissue,
      timepoint: point.timepoint,
      assay: point.assay,
      samples: point.samples || [],
      count: point.y || 0,
      assayTypes: point.assayTypes,
      demographicType: point.demographicType,
      category: point.category,
    };
    
    setSelectedBar(barData);
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
          />
        </div>

        {/* Chart - Right Side */}
        <div className="col-lg-10">
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

          {/* Chart - only show when data is loaded */}
          {!loading && !error && allData.length > 0 && (
            <>
              <BiospecimenChart
                data={filteredData}
                allData={allData}
                loading={false} // Data is already loaded
                error={null}
                onBarClick={handleBarClick}
                activeFilters={filters}
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
                  {selectedBar.demographicType ? (
                    // Demographic chart clicked (sex, age, race, BMI, ethnicity, randomized group)
                    <>{selectedBar.demographicType}: {selectedBar.category} ({selectedBar.count} samples)</>
                  ) : (
                    // Biospecimen chart clicked (assay/phase/timepoint)
                    <>{selectedBar.tissue} {selectedBar.phase && ` - ${selectedBar.phase}`}
                    {selectedBar.timepoint && ` - ${selectedBar.timepoint}`}
                    {selectedBar.assay && ` - ${selectedBar.assay}`} ({selectedBar.count} samples)</>
                  )}
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
                <PaginationControls 
                  pagination={tablePagination}
                  onExport={exportDrillDownData}
                />
                
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
                        <tr key={`${sample.vial_label}-${index}`}>
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
                              {transformCASReceived(sample.received_cas)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination controls - bottom */}
                <PaginationControls 
                  pagination={tablePagination}
                  onExport={exportDrillDownData}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveBiospecimenChart;