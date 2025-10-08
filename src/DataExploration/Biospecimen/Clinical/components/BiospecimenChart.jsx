import React, { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  parseAssayTypes,
  VISIT_CODE_TO_PHASE,
  TISSUE_CODE_TO_NAME,
  INTERVENTION_PHASES,
} from '../constants/plotOptions';

// Ensure Highcharts is properly initialized
if (typeof Highcharts === 'object' && Highcharts.setOptions) {
  try {
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    });
  } catch (error) {
    console.warn('Error setting Highcharts options:', error);
  }
}

/**
 * Interactive Biospecimen Bar Chart component
 * Features:
 * - Horizontal bar chart with phases on x-axis and assays on y-axis
 * - Bars sorted by total count (longest at top, shortest at bottom)
 * - Click-to-drill-down functionality
 * - Assay information in tooltips
 */
const BiospecimenChart = ({ data, loading, error, onBarClick }) => {
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

  // Transform data for chart - separate charts for Pre and Post phases
  const chartData = useMemo(() => {
    if (!data || !data.length) return null;

    // Collect all unique assay types and group data
    const assayData = {};
    let maxCount = 0;

    data.forEach((record) => {
      const visitCode = record.visit_code;
      const tissue = record.sample_group_code;
      const timepoint = record.timepoint;
      const phase = VISIT_CODE_TO_PHASE[visitCode];
      const tissueName = TISSUE_CODE_TO_NAME[tissue];

      if (!phase || !tissueName || !timepoint) return;

      const assays = parseAssayTypes(record.raw_assays_with_results);
      
      assays.forEach(assay => {
        if (!assayData[assay]) {
          assayData[assay] = {
            name: assay,
            total: 0,
            byPhase: {},
          };
          INTERVENTION_PHASES.forEach(p => {
            assayData[assay].byPhase[p] = {
              count: 0,
              samples: [],
              assayTypes: new Set(),
            };
          });
        }

        assayData[assay].byPhase[phase].count++;
        assayData[assay].byPhase[phase].samples.push(record);
        assayData[assay].byPhase[phase].assayTypes.add(assay);
        assayData[assay].total++;
        
        // Track maximum count for fixed y-axis scale
        if (assayData[assay].byPhase[phase].count > maxCount) {
          maxCount = assayData[assay].byPhase[phase].count;
        }
      });
    });

    // Sort assays by total count (descending)
    const sortedAssays = Object.values(assayData)
      .sort((a, b) => b.total - a.total);

    const categories = sortedAssays.map(a => a.name);

    // Create separate chart data for Pre-Intervention and Post-Intervention phases
    const chartsData = INTERVENTION_PHASES.map((phase, index) => ({
      phase,
      categories,
      maxCount,
      series: [{
        name: phase,
        color: index === 0 ? '#4e79a7' : '#e15759', // Blue for Pre, Red for Post
        data: sortedAssays.map(assay => {
          const phaseData = assay.byPhase[phase];
          return {
            y: phaseData ? phaseData.count : 0,
            phase,
            assay: assay.name,
            samples: phaseData ? phaseData.samples : [],
            assayTypes: phaseData ? Array.from(phaseData.assayTypes) : [],
          };
        }),
      }],
    }));

    return chartsData;
  }, [data]);

  // Chart configurations for both Pre and Post phases
  const chartOptionsArray = useMemo(() => {
    if (!chartData || !data) return null;

    return chartData.map(({ phase, categories, maxCount, series }) => ({
        chart: {
          type: 'bar',
          height: Math.max(400, categories.length * 40 + 100),
          marginBottom: 80,
        },
      title: {
        text: phase,
        align: 'center',
        style: { fontSize: '16px', fontWeight: 'bold' }
      },
      subtitle: {
        text: 'Click bars for details',
        align: 'center',
        style: { fontSize: '12px', fontStyle: 'italic', color: '#666' }
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Assay',
          style: { fontSize: '12px', fontWeight: 'bold' }
        },
        labels: {
          style: { fontSize: '11px' }
        }
      },
      yAxis: {
        min: 0,
        max: maxCount,
        allowDecimals: false,
        title: {
          text: 'Sample Count',
          y: 15,
          style: { fontSize: '12px', fontWeight: 'bold' }
        },
        labels: {
          style: { fontSize: '11px' }
        }
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const point = this.point;
          const assayList = point.assayTypes && point.assayTypes.length > 0
            ? point.assayTypes.join(', ')
            : 'N/A';
          
          return `
            <div style="padding: 8px;">
              <strong>${point.assay}</strong><br/>
              <strong>Phase:</strong> ${point.phase}<br/>
              <strong>Samples:</strong> ${point.y.toLocaleString()}<br/>
              <strong>Assays:</strong> ${assayList}<br/>
              <em style="color: #666; font-size: 11px;">Click to view details</em>
            </div>
          `;
        }
      },
      plotOptions: {
        bar: {
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: { fontSize: '10px' }
          },
          groupPadding: 0.1,
          pointPadding: 0.05,
        },
        series: {
          stacking: undefined,
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                if (onBarClick && this.samples) {
                  onBarClick({ point: this });
                }
              }
            }
          }
        }
      },
      series: series,
      credits: { enabled: false },
      exporting: { 
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
          }
        }
      },
    }));
  }, [chartData, data, onBarClick]);

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
        {chartOptionsArray && chartOptionsArray.length === 2 ? (
          <div className="row">
            <div className="col-md-6">
              {/* Pre-intervention sample counts by assay bar chart */}
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptionsArray[0]}
                immutable={false}
              />
            </div>
            <div className="col-md-6">
              {/* Post-intervention sample counts by assay bar chart */}
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptionsArray[1]}
                immutable={false}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Preparing charts...</span>
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
};

export default BiospecimenChart;
