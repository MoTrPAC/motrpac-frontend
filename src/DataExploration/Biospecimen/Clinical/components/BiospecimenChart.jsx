import React, { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  getColorForTissue,
  getColorForTimepoint,
  getLabelForTimepoint,
  chartConfigFactory,
  VISIT_CODE_TO_PHASE,
  TISSUE_CODE_TO_NAME,
  TISSUE_TYPES,
  INTERVENTION_PHASES,
  TIMEPOINT_TYPES,
  TIMEPOINT_CONFIG,
  CHART_AXIS_OPTIONS,
  DEFAULT_CHART_AXIS,
} from '../constants/plotOptions';

// Ensure Highcharts is properly initialized
if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    lang: {
      thousandsSep: ','
    }
  });
}

/**
 * Interactive Biospecimen Bar Chart component
 * Features:
 * - Configurable x-axis: can group by intervention phase or timepoint
 * - Vertical grouped/stacked bar chart depending on axis mode
 * - Click-to-drill-down functionality
 * - Assay information in tooltips
 */
const BiospecimenChart = ({ data, loading, error, onBarClick, axisMode = DEFAULT_CHART_AXIS }) => {
  // Chart reference for proper cleanup
  const chartRef = useRef(null);

  // Cleanup chart instance on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chart) {
        try {
          chartRef.current.chart.destroy();
        } catch (e) {
          console.warn('Error destroying chart:', e);
        }
      }
    };
  }, []);

  // Transform data for chart - supports both axis modes
  const chartData = useMemo(() => {
    if (!data || !data.length) return null;

    const isTimepoint = axisMode === CHART_AXIS_OPTIONS.TIMEPOINT;
    
    // Group data by intervention phase, tissue, and timepoint
    const groups = {};

    data.forEach((record) => {
      const visitCode = record.visit_code;
      const tissue = record.sample_group_code;
      const timepoint = record.timepoint;
      const assays = record.raw_assays_with_results || '';

      // Map visit codes to intervention phases using constants
      const phase = VISIT_CODE_TO_PHASE[visitCode];
      // Map tissue codes to readable names using constants
      const tissueName = TISSUE_CODE_TO_NAME[tissue];

      if (phase && tissueName && timepoint) {
        const key = `${phase}_${tissueName}_${timepoint}`;
        if (!groups[key]) {
          groups[key] = {
            phase,
            tissue: tissueName,
            timepoint,
            samples: [],
            assayTypes: new Set(),
          };
        }
        groups[key].samples.push(record);

        // Track assay types
        if (assays) {
          assays.split(',').forEach((assay) => {
            if (assay.trim()) groups[key].assayTypes.add(assay.trim());
          });
        }
      }
    });

    let series, categories;

    if (isTimepoint) {
      // Grouping by timepoint: X-axis = timepoints, Series = tissues (aggregated across phases)
      series = TISSUE_TYPES.map((tissue) => ({
        name: tissue,
        color: getColorForTissue(tissue),
        data: TIMEPOINT_TYPES.map((timepoint) => {
          // Sum all phases for this tissue and timepoint
          const totalSamples = INTERVENTION_PHASES.reduce((sum, phase) => {
            const key = `${phase}_${tissue}_${timepoint}`;
            const group = groups[key];
            return sum + (group ? group.samples.length : 0);
          }, 0);

          // Collect all samples and assay types for this tissue and timepoint across phases
          const allSamples = [];
          const allAssayTypes = new Set();
          
          INTERVENTION_PHASES.forEach((phase) => {
            const key = `${phase}_${tissue}_${timepoint}`;
            const group = groups[key];
            if (group) {
              allSamples.push(...group.samples);
              group.assayTypes.forEach(assay => allAssayTypes.add(assay));
            }
          });

          return {
            y: totalSamples,
            phase: null, // No specific phase when aggregated
            tissue,
            timepoint,
            samples: allSamples,
            assayTypes: Array.from(allAssayTypes),
          };
        }),
      }));

      categories = TIMEPOINT_TYPES.map(t => getLabelForTimepoint(t));
    } else {
      // Grouping by intervention phase: X-axis = phases, Series = tissues, Stack by timepoint
      series = TISSUE_TYPES.map((tissue) => ({
        name: tissue,
        color: getColorForTissue(tissue),
        data: INTERVENTION_PHASES.map((phase) => {
          // Sum all timepoints for this phase and tissue
          const totalSamples = TIMEPOINT_TYPES.reduce((sum, timepoint) => {
            const key = `${phase}_${tissue}_${timepoint}`;
            const group = groups[key];
            return sum + (group ? group.samples.length : 0);
          }, 0);

          // Collect all samples and assay types for this phase and tissue
          const allSamples = [];
          const allAssayTypes = new Set();
          
          TIMEPOINT_TYPES.forEach((timepoint) => {
            const key = `${phase}_${tissue}_${timepoint}`;
            const group = groups[key];
            if (group) {
              allSamples.push(...group.samples);
              group.assayTypes.forEach(assay => allAssayTypes.add(assay));
            }
          });

          return {
            y: totalSamples,
            phase,
            tissue,
            timepoint: null, // No specific timepoint when grouped by phase
            samples: allSamples,
            assayTypes: Array.from(allAssayTypes),
          };
        }),
      }));

      categories = INTERVENTION_PHASES;
    }

    // Filter out series with no data
    const filteredSeries = series.filter(s => 
      s.data.some(d => d.y > 0)
    );

    return { 
      series: filteredSeries, 
      categories,
      groups,
      axisMode
    };
  }, [data, axisMode]);

  // Chart configuration using factory function for consistency
  // Memoized with optimized dependencies
  const chartOptions = useMemo(() => {
    if (!chartData || !data) return null;

    const isTimepoint = axisMode === CHART_AXIS_OPTIONS.TIMEPOINT;
    const axisLabel = isTimepoint ? 'exercise timepoint' : 'intervention phase';

    const config = chartConfigFactory.createBiospecimenChart({
      title: `Biospecimen Sample Distribution by ${axisLabel}`,
      subtitle: `${data.length.toLocaleString()} samples • Grouped by ${axisLabel} • Click for details`,
      onBarClick,
      series: chartData.series,
      categories: chartData.categories,
      axisMode,
    });
    
    // Debug log to ensure proper Highcharts config
    console.log('Chart config:', config);
    return config;
  }, [chartData, data, onBarClick, axisMode]);

  // Render different states based on conditions
  if (loading) {
    return (
      <div className="card h-100">
        <div className="card-body">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading biospecimen data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card h-100">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            <h6 className="alert-heading">Error Loading Data</h6>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.length) {
    return (
      <div className="card h-100">
        <div className="card-body">
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox" style={{ fontSize: '3rem' }} />
            <h6 className="mt-3">No Data Found</h6>
            <p>Try adjusting your filter criteria to see results.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        {chartOptions && Object.keys(chartOptions).length > 0 && (
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={chartOptions}
            immutable={false}
          />
        )}
        {(!chartOptions || Object.keys(chartOptions).length === 0) && (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Preparing chart...</span>
            </div>
            <p className="mt-2">Setting up chart configuration...</p>
          </div>
        )}
      </div>
    </div>
  );
};

BiospecimenChart.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onBarClick: PropTypes.func.isRequired,
  axisMode: PropTypes.string,
};

export default BiospecimenChart;
