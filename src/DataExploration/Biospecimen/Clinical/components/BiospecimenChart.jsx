import React, { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  getColorForTissue,
  chartConfigFactory,
  VISIT_CODE_TO_PHASE,
  TISSUE_CODE_TO_NAME,
  TISSUE_TYPES,
  INTERVENTION_PHASES,
} from '../constants/plotOptions';

/**
 * Interactive Biospecimen Bar Chart component
 * Features:
 * - Vertical grouped bar chart: Pre/Post intervention × Tissue types
 * - Click-to-drill-down functionality
 * - Assay information in tooltips
 */
const BiospecimenChart = ({ data, loading, error, onBarClick }) => {
  // Chart reference for proper cleanup
  const chartRef = useRef(null);
  // Transform data for chart - optimized memoization with proper dependencies
  const chartData = useMemo(() => {
    if (!data.length) return null;

    // Group data by intervention phase and tissue
    const groups = {};

    data.forEach((record) => {
      const visitCode = record.visit_code;
      const tissue = record.sample_group_code;
      const assays = record.raw_assays_with_results || '';

      // Map visit codes to intervention phases using constants
      const phase = VISIT_CODE_TO_PHASE[visitCode];
      // Map tissue codes to readable names using constants
      const tissueName = TISSUE_CODE_TO_NAME[tissue];

      if (phase && tissueName) {
        const key = `${phase}_${tissueName}`;
        if (!groups[key]) {
          groups[key] = {
            phase,
            tissue: tissueName,
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

    // Create series data using constants for consistency
    const series = TISSUE_TYPES.map((tissue) => ({
      name: tissue,
      data: INTERVENTION_PHASES.map((phase) => {
        const key = `${phase}_${tissue}`;
        const group = groups[key];
        return {
          y: group ? group.samples.length : 0,
          phase,
          tissue,
          samples: group ? group.samples : [],
          assayTypes: group ? Array.from(group.assayTypes) : [],
          color: getColorForTissue(tissue),
        };
      }),
      color: getColorForTissue(tissue),
    }));

    return { series, phases: INTERVENTION_PHASES, groups };
  }, [data]);

  // Chart configuration using factory function for consistency
  // Memoized with optimized dependencies
  const chartOptions = useMemo(() => {
    if (!chartData) return null;

    return chartConfigFactory.createBiospecimenChart({
      title: 'Biospecimen Sample Distribution',
      subtitle: `${data.length.toLocaleString()} samples • Click bars for detailed breakdown`,
      onBarClick,
      series: chartData.series,
      categories: chartData.phases,
    });
  }, [chartData, data.length, onBarClick]);

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

  if (!data.length) {
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

  return (
    <div className="card h-100">
      <div className="card-body">
        {chartOptions && (
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={chartOptions}
            immutable={false}
          />
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
};

export default BiospecimenChart;
