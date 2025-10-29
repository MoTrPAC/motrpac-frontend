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
      const phase = VISIT_CODE_TO_PHASE[visitCode];

      // Only require phase - tissue and timepoint are not needed for this chart
      if (!phase) return;

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

  // Calculate participant counts by race
  const participantByRace = useMemo(() => {
    if (!data || !data.length) return null;

    // Helper function to derive race category from boolean indicator fields
    const getRaceCategory = (record) => {
      // Map boolean fields to race categories
      if (record.aablack_psca === '1' || record.aablack_psca === 1 || record.aablack_psca === true) {
        return 'African American/Black';
      }
      if (record.asian_psca === '1' || record.asian_psca === 1 || record.asian_psca === true) {
        return 'Asian';
      }
      if (record.hawaii_psca === '1' || record.hawaii_psca === 1 || record.hawaii_psca === true) {
        return 'Hawaiian/Pacific Islander';
      }
      if (record.natamer_psca === '1' || record.natamer_psca === 1 || record.natamer_psca === true) {
        return 'Native American';
      }
      if (record.cauc_psca === '1' || record.cauc_psca === 1 || record.cauc_psca === true) {
        return 'Caucasian';
      }
      if (record.raceoth_psca === '1' || record.raceoth_psca === 1 || record.raceoth_psca === true) {
        return 'Other';
      }
      if (record.raceref_psca === '1' || record.raceref_psca === 1 || record.raceref_psca === true) {
        return 'Unknown';
      }
      return null; // No race indicator found
    };

    const uniqueParticipants = new Map();
    data.forEach((record) => {
      if (record.pid) {
        const raceCategory = getRaceCategory(record);
        if (raceCategory) {
          uniqueParticipants.set(record.pid, raceCategory);
        }
      }
    });

    const raceGroups = [
      'African American/Black',
      'Asian',
      'Hawaiian/Pacific Islander',
      'Native American',
      'Caucasian',
      'Other',
      'Unknown'
    ];
    const raceCounts = {};
    raceGroups.forEach(group => raceCounts[group] = 0);

    uniqueParticipants.forEach((race) => {
      if (raceCounts.hasOwnProperty(race)) {
        raceCounts[race]++;
      }
    });

    return {
      categories: raceGroups,
      data: raceGroups.map(group => raceCounts[group]),
    };
  }, [data]);

  // Calculate participant counts by BMI group
  const participantByBMI = useMemo(() => {
    if (!data || !data.length) return null;

    // Helper function to categorize BMI value into group
    const getBMIGroup = (bmi) => {
      const bmiValue = parseFloat(bmi);
      if (isNaN(bmiValue)) return null;
      if (bmiValue < 25) return '0-25';
      if (bmiValue < 30) return '25-30';
      return '30+';
    };

    const uniqueParticipants = new Map();
    data.forEach((record) => {
      if (record.pid && record.bmi) {
        const bmiGroup = getBMIGroup(record.bmi);
        if (bmiGroup) {
          uniqueParticipants.set(record.pid, bmiGroup);
        }
      }
    });

    const bmiGroups = ['0-25', '25-30', '30+'];
    const bmiCounts = {};
    bmiGroups.forEach(group => bmiCounts[group] = 0);

    uniqueParticipants.forEach((bmiGroup) => {
      if (bmiCounts.hasOwnProperty(bmiGroup)) {
        bmiCounts[bmiGroup]++;
      }
    });

    const colors = ['#2ecc71', '#f39c12', '#e74c3c']; // Green, Orange, Red
    return bmiGroups.map((group, index) => ({
      name: `BMI ${group}`,
      y: bmiCounts[group],
      color: colors[index],
    }));
  }, [data]);

  // Calculate participant counts by ethnicity
  const participantByEthnicity = useMemo(() => {
    if (!data || !data.length) return null;

    // Helper function to derive ethnicity category from latino_psca field
    const getEthnicityCategory = (record) => {
      const latinoValue = record.latino_psca;
      // Check for value 1 (Latino/Hispanic/Spanish)
      if (latinoValue === '1' || latinoValue === 1) {
        return 'Latino, Hispanic, or Spanish origin/ethnicity';
      }
      // Check for value 0 (Not Latino/Hispanic/Spanish)
      if (latinoValue === '0' || latinoValue === 0) {
        return 'Not Latino, Hispanic, or Spanish origin/ethnicity';
      }
      // Check for value -7 (Refused/Unknown)
      if (latinoValue === '-7' || latinoValue === -7) {
        return 'Refused/Unknown';
      }
      return null;
    };

    const uniqueParticipants = new Map();
    data.forEach((record) => {
      if (record.pid) {
        const ethnicityCategory = getEthnicityCategory(record);
        if (ethnicityCategory) {
          uniqueParticipants.set(record.pid, ethnicityCategory);
        }
      }
    });

    const ethnicityCounts = {
      'Latino, Hispanic, or Spanish origin/ethnicity': 0,
      'Not Latino, Hispanic, or Spanish origin/ethnicity': 0,
      'Refused/Unknown': 0,
    };

    uniqueParticipants.forEach((ethnicity) => {
      if (ethnicityCounts.hasOwnProperty(ethnicity)) {
        ethnicityCounts[ethnicity]++;
      }
    });

    return [
      { 
        name: 'Latino, Hispanic, or Spanish', 
        y: ethnicityCounts['Latino, Hispanic, or Spanish origin/ethnicity'], 
        color: '#16a085' 
      },
      { 
        name: 'Not Latino, Hispanic, or Spanish', 
        y: ethnicityCounts['Not Latino, Hispanic, or Spanish origin/ethnicity'], 
        color: '#95a5a6' 
      },
      { 
        name: 'Refused/Unknown', 
        y: ethnicityCounts['Refused/Unknown'], 
        color: '#bdc3c7' 
      },
    ];
  }, [data]);

  // Calculate participant counts by randomized group
  const participantByRandomGroup = useMemo(() => {
    if (!data || !data.length) return null;

    // Helper function to derive randomized group from random_group_code and enroll_random_group_code
    const getRandomizedGroup = (record) => {
      const randomGroupCode = record.random_group_code;
      const enrollRandomGroupCode = record.enroll_random_group_code;

      // Control group
      if (randomGroupCode === 'ADUControl' || randomGroupCode === 'PEDControl') {
        return 'Control';
      }

      // Endurance group
      if (
        randomGroupCode === 'ADUEndur' ||
        randomGroupCode === 'ATHEndur' ||
        randomGroupCode === 'PEDEndur' ||
        enrollRandomGroupCode === 'PEDEndur' ||
        enrollRandomGroupCode === 'PEDEnrollEndur'
      ) {
        return 'Endurance';
      }

      // Resistance group
      if (randomGroupCode === 'ADUResist' || randomGroupCode === 'ATHResist') {
        return 'Resistance';
      }

      return null;
    };

    const uniqueParticipants = new Map();
    data.forEach((record) => {
      if (record.pid) {
        const group = getRandomizedGroup(record);
        if (group) {
          uniqueParticipants.set(record.pid, group);
        }
      }
    });

    const randomGroups = ['Control', 'Endurance', 'Resistance'];
    const groupCounts = {};
    randomGroups.forEach(group => groupCounts[group] = 0);

    uniqueParticipants.forEach((group) => {
      if (groupCounts.hasOwnProperty(group)) {
        groupCounts[group]++;
      }
    });

    return {
      categories: randomGroups,
      data: randomGroups.map(group => groupCounts[group]),
    };
  }, [data]);

  // Transform data for chart - separate charts for Pre and Post phases
  const chartData = useMemo(() => {
    if (!data || !data.length) return null;

    // Collect all unique assay types and group data
    const assayData = {};

    data.forEach((record) => {
      const visitCode = record.visit_code;
      const phase = VISIT_CODE_TO_PHASE[visitCode];

      // Only require phase - tissue and timepoint are not needed for this chart
      if (!phase) return;

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

  // Bar chart configuration for race distribution
  const raceBarChartOptions = useMemo(() => {
    if (!participantByRace) return null;

    return {
      chart: {
        type: 'column',
        height: 300,
      },
      title: {
        text: 'Race Distribution',
        style: { fontSize: '14px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: participantByRace.categories,
        title: {
          text: 'Race',
          style: { fontSize: '12px', fontWeight: 'bold' }
        },
        labels: {
          rotation: -45,
          style: { fontSize: '10px' }
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
          color: '#3498db',
        }
      },
      series: [{
        name: 'Participants',
        data: participantByRace.data,
      }],
      credits: { enabled: false },
    };
  }, [participantByRace]);

  // Pie chart configuration for BMI group distribution
  const bmiPieChartOptions = useMemo(() => {
    if (!participantByBMI) return null;

    return {
      chart: {
        type: 'pie',
        height: 300,
      },
      title: {
        text: 'BMI Group Distribution',
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
        data: participantByBMI,
      }],
      credits: { enabled: false },
    };
  }, [participantByBMI]);

  // Pie chart configuration for ethnicity distribution
  const ethnicityPieChartOptions = useMemo(() => {
    if (!participantByEthnicity) return null;

    return {
      chart: {
        type: 'pie',
        height: 300,
      },
      title: {
        text: 'Ethnicity Distribution',
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
        data: participantByEthnicity,
      }],
      credits: { enabled: false },
    };
  }, [participantByEthnicity]);

  // Bar chart configuration for randomized group distribution
  const randomGroupBarChartOptions = useMemo(() => {
    if (!participantByRandomGroup) return null;

    return {
      chart: {
        type: 'column',
        height: 300,
      },
      title: {
        text: 'Randomized Group Distribution',
        style: { fontSize: '14px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: participantByRandomGroup.categories,
        title: {
          text: 'Randomized Group',
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
          color: '#e67e22',
        }
      },
      series: [{
        name: 'Participants',
        data: participantByRandomGroup.data,
      }],
      credits: { enabled: false },
    };
  }, [participantByRandomGroup]);

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
            <div className="row mt-4">
              <div className="col-md-6">
                {/* Bar chart of participant count in each race group */}
                {raceBarChartOptions ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={raceBarChartOptions}
                    immutable={false}
                  />
                ) : (
                  <div className="text-center py-3 text-muted">
                    <p>No data available</p>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                {/* Pie chart of participant count in each BMI group */}
                {bmiPieChartOptions ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={bmiPieChartOptions}
                    immutable={false}
                  />
                ) : (
                  <div className="text-center py-3 text-muted">
                    <p>No data available</p>
                  </div>
                )}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                {/* Pie chart of participant count in each ethnic group */}
                {ethnicityPieChartOptions ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={ethnicityPieChartOptions}
                    immutable={false}
                  />
                ) : (
                  <div className="text-center py-3 text-muted">
                    <p>No data available</p>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                {/* Bar chart of participant count in each randomized group */}
                {randomGroupBarChartOptions ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={randomGroupBarChartOptions}
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
              Biospecimen sample counts (per currently available data)
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
