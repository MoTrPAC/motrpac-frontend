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
const BiospecimenChart = ({ data, allData, loading, error, onBarClick }) => {
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

  // Calculate fixed maximum from ALL unfiltered data (only once)
  const fixedMaxCount = useMemo(() => {
    if (!allData || !allData.length) return 0;

    const assayData = {};
    let maxCount = 0;

    allData.forEach((record) => {
      const visitCode = record.visit_code;
      const tissue = record.sample_group_code;
      const timepoint = record.timepoint;
      const phase = VISIT_CODE_TO_PHASE[visitCode];
      const tissueName = TISSUE_CODE_TO_NAME[tissue];

      if (!phase || !tissueName || !timepoint) return;

      const assays = parseAssayTypes(record.raw_assays_with_results);
      
      assays.forEach(assay => {
        if (!assayData[assay]) {
          assayData[assay] = { byPhase: {} };
          INTERVENTION_PHASES.forEach(p => {
            assayData[assay].byPhase[p] = { count: 0 };
          });
        }

        assayData[assay].byPhase[phase].count++;
        
        if (assayData[assay].byPhase[phase].count > maxCount) {
          maxCount = assayData[assay].byPhase[phase].count;
        }
      });
    });

    return maxCount;
  }, [allData]);

  // Calculate participant counts by sex
  const participantBySex = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    data.forEach((record) => {
      if (record.pid && record.sex) {
        uniqueParticipants.set(record.pid, record.sex);
      }
    });

    const sexCounts = { Male: 0, Female: 0 };
    uniqueParticipants.forEach((sex) => {
      if (sex === 'Male') sexCounts.Male++;
      else if (sex === 'Female') sexCounts.Female++;
    });

    return [
      { name: 'Male', y: sexCounts.Male, color: '#4e79a7' },
      { name: 'Female', y: sexCounts.Female, color: '#e15759' },
    ];
  }, [data]);

  // Calculate participant counts by age group
  const participantByAgeGroup = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    data.forEach((record) => {
      if (record.pid && record.dmaqc_age_groups) {
        uniqueParticipants.set(record.pid, record.dmaqc_age_groups);
      }
    });

    const ageGroups = ['10-13', '14-17', '18-39', '40-59', '60+'];
    const ageCounts = {};
    ageGroups.forEach(group => ageCounts[group] = 0);

    uniqueParticipants.forEach((ageGroup) => {
      if (ageCounts.hasOwnProperty(ageGroup)) {
        ageCounts[ageGroup]++;
      }
    });

    return {
      categories: ageGroups,
      data: ageGroups.map(group => ageCounts[group]),
    };
  }, [data]);

  // Transform data for chart - separate charts for Pre and Post phases
  const chartData = useMemo(() => {
    if (!data || !data.length) return null;

    // Collect all unique assay types and group data
    const assayData = {};

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

  // Pie chart configuration for sex distribution
  const sexPieChartOptions = useMemo(() => {
    if (!participantBySex) return null;

    return {
      chart: {
        type: 'pie',
        height: 300,
      },
      title: {
        text: 'Sex Distribution',
        style: { fontSize: '14px', fontWeight: 'bold' }
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> participants ({point.percentage:.1f}%)'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}',
            style: { fontSize: '11px' },
            distance: 10,
            connectorWidth: 1,
          },
          showInLegend: false,
        }
      },
      series: [{
        name: 'Participants',
        data: participantBySex,
      }],
      credits: { enabled: false },
    };
  }, [participantBySex]);

  // Bar chart configuration for age group distribution
  const ageBarChartOptions = useMemo(() => {
    if (!participantByAgeGroup) return null;

    return {
      chart: {
        type: 'column',
        height: 300,
      },
      title: {
        text: 'Age Group Distribution',
        style: { fontSize: '14px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: participantByAgeGroup.categories,
        title: {
          text: 'Age Group',
          style: { fontSize: '12px', fontWeight: 'bold' }
        },
        labels: {
          style: { fontSize: '11px' }
        }
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        title: {
          text: 'Participant Count',
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
        pointFormat: '<b>{point.y}</b> participants'
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: { fontSize: '10px' }
          },
          color: '#9b59b6',
        }
      },
      series: [{
        name: 'Participants',
        data: participantByAgeGroup.data,
      }],
      credits: { enabled: false },
    };
  }, [participantByAgeGroup]);

  // Chart configurations for both Pre and Post phases
  const chartOptionsArray = useMemo(() => {
    if (!chartData || !data) return null;

    return chartData.map(({ phase, categories, series }) => ({
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
        max: fixedMaxCount,
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
  }, [chartData, data, fixedMaxCount, onBarClick]);

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
    <div className="charts-container row">
      <div className="card-containner col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              Participants
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                {/* Pie chart of participant count in each sex */}
                {sexPieChartOptions ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={sexPieChartOptions}
                    immutable={false}
                  />
                ) : (
                  <div className="text-center py-3 text-muted">
                    <p>No data available</p>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                {/* Bar chart of participant count in each age group */}
                {ageBarChartOptions ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={ageBarChartOptions}
                    immutable={false}
                  />
                ) : (
                  <div className="text-center py-3 text-muted">
                    <p>No data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-containner col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              Biospecimen Sample Counts
            </h5>
          </div>
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
      </div>
    </div>
  );
};

BiospecimenChart.propTypes = {
  data: PropTypes.array.isRequired,
  allData: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onBarClick: PropTypes.func.isRequired,
};

export default BiospecimenChart;
