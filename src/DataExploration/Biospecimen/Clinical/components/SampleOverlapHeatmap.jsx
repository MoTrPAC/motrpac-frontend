import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsHeatmap from 'highcharts/modules/heatmap';

// Initialize Highcharts heatmap module
HighchartsHeatmap(Highcharts);

/**
 * Interactive biospecimen sample overlap heatmap visualization
 * Shows data availability across tissues, timepoints, and participant groups
 */
const SampleOverlapHeatmap = ({ data = [], loading = false, error = null }) => {
  // Define tissue mapping and timepoint ordering
  const tissueConfig = {
    MUS: { label: 'Muscle', order: 0 },
    BLO: { label: 'Blood', order: 1 },
    ADI: { label: 'Adipose', order: 2 },
  };

  const timepointConfig = {
    pre_exercise: { label: 'Pre-Exercise', order: 0 },
    during_20_min: { label: 'During 20 Min', order: 1 },
    during_40_min: { label: 'During 40 Min', order: 2 },
    post_10_min: { label: 'Post 10 Min', order: 3 },
    post_15_30_45_min: { label: 'Post 15-45 Min', order: 4 },
    'post_3.5_4_hr': { label: 'Post 3.5-4 Hour', order: 5 },
    post_24_hr: { label: 'Post 24 Hour', order: 6 },
  };

  const participantGroupConfig = {
    ADUControl: { label: 'Control', abbreviation: 'CON', order: 0 },
    ADUEndur: { label: 'Endurance Exercise', abbreviation: 'EE', order: 1 },
    ADUResist: { label: 'Resistance Exercise', abbreviation: 'RE', order: 2 },
    ATHEndur: {
      label: 'Highly Active Endurance',
      abbreviation: 'AE',
      order: 3,
    },
    ATHResist: {
      label: 'Highly Active Resistance',
      abbreviation: 'AR',
      order: 4,
    },
  };

  // Data availability types based on raw_assays_with_results patterns
  const dataTypeConfig = {
    transcriptomics: { color: '#3498db', value: 1 },
    metabolomics: { color: '#e74c3c', value: 2 },
    proteomics: { color: '#2ecc71', value: 3 },
    methylation: { color: '#e91e63', value: 4 },
    phosphoproteomics: { color: '#ff9800', value: 5 },
    atac_seq: { color: '#8d6e63', value: 6 },
    no_data: { color: '#f5f5f5', value: 0 },
  };

  // Function to determine ome type from raw_assays_with_results
  const determineOmeType = (rawAssays) => {
    if (!rawAssays || rawAssays.trim() === '') return 'no_data';

    const assays = rawAssays.toLowerCase();

    if (assays.includes('transcript')) return 'transcriptomics';
    if (assays.includes('metab-') || assays.includes('lab-'))
      return 'metabolomics';
    if (assays.includes('prot-')) return 'proteomics';
    if (assays.includes('epigen-methylcap-seq')) return 'methylation';
    if (assays.includes('epigen-atac-seq')) return 'atac_seq';

    return 'no_data';
  };

  // Transform biospecimen data into participant-level format
  const heatmapData = useMemo(() => {
    if (!data || data.length === 0) return { tissueCharts: [] };

    // Group data by tissue, timepoint, participant group, and pid
    const participantMatrix = {};
    const availableTimepoints = new Set();
    const availableGroups = new Set();
    const availableTissues = new Set();

    data.forEach((record) => {
      const tissue = record.sampleGroupCode;
      const timepoint = record.timepoint;
      const group = record.randomGroupCode;
      const pid = record.pid;
      const rawAssays = record.raw_assays_with_results;

      if (
        !tissueConfig[tissue] ||
        !timepointConfig[timepoint] ||
        !participantGroupConfig[group]
      ) {
        return; // Skip invalid records
      }

      availableTimepoints.add(timepoint);
      availableGroups.add(group);
      availableTissues.add(tissue);

      const key = `${tissue}_${timepoint}_${group}_${pid}`;

      if (!participantMatrix[key]) {
        participantMatrix[key] = {
          tissue,
          timepoint,
          group,
          pid,
          omeTypes: new Set(),
        };
      }

      // Determine ome type from raw assays
      const omeType = determineOmeType(rawAssays);
      participantMatrix[key].omeTypes.add(omeType);
    });

    // Sort arrays
    const sortedTimepoints = Array.from(availableTimepoints).sort(
      (a, b) => timepointConfig[a].order - timepointConfig[b].order,
    );

    const sortedGroups = Array.from(availableGroups).sort(
      (a, b) =>
        participantGroupConfig[a].order - participantGroupConfig[b].order,
    );

    const sortedTissues = Array.from(availableTissues).sort(
      (a, b) => tissueConfig[a].order - tissueConfig[b].order,
    );

    // Create separate chart data for each tissue
    const tissueCharts = sortedTissues.map((tissue) => {
      // Group participants by timepoint and participant group
      const cellData = {};

      Object.values(participantMatrix)
        .filter((entry) => entry.tissue === tissue)
        .forEach((entry) => {
          const cellKey = `${entry.timepoint}_${entry.group}`;
          if (!cellData[cellKey]) {
            cellData[cellKey] = [];
          }

          // Determine primary ome type (first non-no_data, or no_data if all are no_data)
          const omeTypesArray = Array.from(entry.omeTypes);
          const primaryOme =
            omeTypesArray.find((ome) => ome !== 'no_data') || 'no_data';

          cellData[cellKey].push({
            pid: entry.pid,
            omeType: primaryOme,
            allOmeTypes: omeTypesArray,
          });
        });

      // Create series data for this tissue
      const seriesData = [];

      // Create a series for each ome type
      Object.keys(dataTypeConfig).forEach((omeType) => {
        const omeData = [];

        sortedGroups.forEach((group, groupIndex) => {
          sortedTimepoints.forEach((timepoint, timepointIndex) => {
            const cellKey = `${timepoint}_${group}`;
            const participants = cellData[cellKey] || [];

            // Count participants with this ome type in this cell
            const participantsWithOme = participants.filter(
              (p) => p.omeType === omeType,
            );

            if (participantsWithOme.length > 0) {
              omeData.push({
                x: timepointIndex,
                y: groupIndex,
                value: participantsWithOme.length,
                participants: participantsWithOme,
                tissue: tissueConfig[tissue].label,
                timepoint: timepointConfig[timepoint].label,
                group: participantGroupConfig[group].abbreviation,
                omeType: omeType,
              });
            }
          });
        });

        if (omeData.length > 0) {
          seriesData.push({
            name:
              omeType.charAt(0).toUpperCase() +
              omeType.slice(1).replace('_', '-'),
            data: omeData,
            color: dataTypeConfig[omeType].color,
          });
        }
      });

      return {
        tissue: tissueConfig[tissue].label,
        series: seriesData,
        xCategories: sortedTimepoints.map((tp) => timepointConfig[tp].label),
        yCategories: sortedGroups.map(
          (grp) => participantGroupConfig[grp].abbreviation,
        ),
      };
    });

    return {
      tissueCharts,
      availableTimepoints: sortedTimepoints,
      availableGroups: sortedGroups,
    };
  }, [data]);

  // Create chart options for each tissue
  const createChartOptions = (tissueChart) => ({
    chart: {
      type: 'heatmap',
      backgroundColor: 'transparent',
      height: Math.max(300, tissueChart.yCategories.length * 60),
      spacing: [10, 10, 10, 10],
    },
    title: {
      text: `${tissueChart.tissue} Sample Overlap`,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    xAxis: {
      categories: tissueChart.xCategories,
      labels: {
        style: { fontSize: '10px' },
        rotation: -45,
      },
      lineColor: '#ccc',
      tickColor: '#ccc',
    },
    yAxis: {
      categories: tissueChart.yCategories,
      labels: {
        style: { fontSize: '11px', fontWeight: 'bold' },
      },
      reversed: true,
      lineColor: '#ccc',
      tickColor: '#ccc',
    },
    colorAxis: false, // Disable default color axis since we're using custom colors
    legend: {
      enabled: false, // We'll show a global legend instead
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ccc',
      borderRadius: 5,
      shadow: true,
      useHTML: true,
      formatter: function () {
        const point = this.point;
        const participantList =
          point.participants?.map((p) => p.pid).join(', ') || 'N/A';
        return `
          <div style="padding: 8px; max-width: 200px;">
            <strong>${point.tissue} - ${point.omeType.replace('_', ' ').toUpperCase()}</strong><br/>
            <strong>Timepoint:</strong> ${point.timepoint}<br/>
            <strong>Group:</strong> ${point.group}<br/>
            <strong>Participants:</strong> ${point.value}<br/>
            <small>PIDs: ${participantList}</small>
          </div>
        `;
      },
    },
    plotOptions: {
      heatmap: {
        dataLabels: {
          enabled: true,
          color: 'rgba(255, 255, 255, 0.8)',
          style: {
            fontSize: '9px',
            fontWeight: 'bold',
            textOutline: '1px contrast',
          },
          formatter: function () {
            return this.point.value > 0 ? this.point.value : '';
          },
        },
        borderWidth: 1,
        borderColor: '#fff',
        nullColor: '#f8f9fa',
      },
    },
    series: tissueChart.series,
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false, // Disable individual chart exports
    },
  });

  // Handle loading state
  if (loading) {
    return (
      <div className="sample-overlap-heatmap-container">
        <div className="d-flex justify-content-center align-items-center p-5">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="sr-only">Loading visualization...</span>
            </div>
            <p className="text-muted">
              Preparing sample overlap visualization...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="sample-overlap-heatmap-container">
        <div className="alert alert-warning" role="alert">
          <h5 className="alert-heading">
            <i className="bi bi-exclamation-triangle mr-2" />
            Visualization Error
          </h5>
          <p>Unable to generate sample overlap visualization: {error}</p>
        </div>
      </div>
    );
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="sample-overlap-heatmap-container">
        <div className="alert alert-info" role="alert">
          <h5 className="alert-heading">
            <i className="bi bi-info-circle mr-2" />
            No Data Available
          </h5>
          <p>Apply filters above to see the sample overlap visualization.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sample-overlap-heatmap-container">
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-grid-3x3-gap mr-2" />
              Biospecimen Sample Overlap Analysis
            </h5>
            <small className="text-muted">
              {data.length.toLocaleString()} biospecimens analyzed
            </small>
          </div>
        </div>

        <div className="card-body p-3">
          {/* Global Legend */}
          <div className="d-flex justify-content-center mb-4">
            <div className="d-flex flex-wrap align-items-center">
              <strong className="mr-3">Legend:</strong>
              {Object.entries(dataTypeConfig)
                .filter(([type]) => type !== 'no_data')
                .map(([type, config]) => (
                  <div
                    key={type}
                    className="mr-4 mb-2 d-flex align-items-center"
                  >
                    <div
                      className="mr-2"
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: config.color,
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                      }}
                    />
                    <small style={{ fontSize: '12px', fontWeight: '500' }}>
                      {type === 'atac_seq'
                        ? 'ATAC-seq'
                        : type.charAt(0).toUpperCase() +
                          type.slice(1).replace('_', ' ')}
                    </small>
                  </div>
                ))}
            </div>
          </div>

          {/* Render charts for each tissue */}
          {heatmapData.tissueCharts.map((tissueChart, index) => (
            <div key={tissueChart.tissue} className={index > 0 ? 'mt-4' : ''}>
              <HighchartsReact
                highcharts={Highcharts}
                options={createChartOptions(tissueChart)}
                immutable={false}
              />
            </div>
          ))}
        </div>

        <div className="card-footer bg-light">
          <div className="row">
            <div className="col-md-8">
              <small className="text-muted">
                <strong>Instructions:</strong> Each cell shows participants with
                data at that timepoint and group. Numbers indicate participant
                count for each ome type. Hover cells for participant details.
              </small>
            </div>
            <div className="col-md-4 text-right">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  // Export all charts as images
                  heatmapData.tissueCharts.forEach((tissue, index) => {
                    setTimeout(() => {
                      const chart = Highcharts.charts.find(
                        (c) =>
                          c &&
                          c.title.textStr === `${tissue.tissue} Sample Overlap`,
                      );
                      if (chart) {
                        chart.exportChart({
                          type: 'image/png',
                          filename: `${tissue.tissue.toLowerCase()}_sample_overlap`,
                        });
                      }
                    }, index * 500);
                  });
                }}
                title="Export all tissue charts as PNG"
              >
                <i className="bi bi-download mr-1" />
                Export Charts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SampleOverlapHeatmap.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      sampleGroupCode: PropTypes.string,
      timepoint: PropTypes.string,
      randomGroupCode: PropTypes.string,
      pid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      raw_assays_with_results: PropTypes.string,
    }),
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default SampleOverlapHeatmap;
