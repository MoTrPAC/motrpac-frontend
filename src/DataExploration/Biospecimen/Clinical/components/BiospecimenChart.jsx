import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Tooltip } from 'react-tooltip';
import {
  parseAssayTypes,
  VISIT_CODE_TO_PHASE,
  INTERVENTION_PHASES,
} from '../constants/plotOptions';
import { getAssayName, getAssayNames } from '../utils/assayCodeMapping';
import {
  getRaceCategory,
  getRandomizedGroup,
  getBMIGroup,
  getEthnicityCategory,
  AGE_GROUPS,
  RACE_GROUPS,
  BMI_GROUPS,
  RANDOMIZED_GROUPS,
} from '../utils/demographicUtils';

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

  // Calculate fixed maximums for all demographic charts in a single pass (performance optimization)
  const { fixedMaxAgeGroupCount, fixedMaxRaceCount, fixedMaxRandomGroupCount } = useMemo(() => {
    if (!allData || !allData.length) {
      return { fixedMaxAgeGroupCount: 0, fixedMaxRaceCount: 0, fixedMaxRandomGroupCount: 0 };
    }

    // Store unique participants with their demographics (single Map per PID)
    const participantDemographics = new Map();

    allData.forEach((record) => {
      if (record.pid && !participantDemographics.has(record.pid)) {
        participantDemographics.set(record.pid, {
          age: record.dmaqc_age_groups,
          race: getRaceCategory(record),
          randomGroup: getRandomizedGroup(record),
        });
      }
    });

    // Initialize count objects using imported constants
    const ageCounts = {};
    AGE_GROUPS.forEach(group => ageCounts[group] = 0);
    
    const raceCounts = {};
    RACE_GROUPS.forEach(group => raceCounts[group] = 0);
    
    const randomGroupCounts = {};
    RANDOMIZED_GROUPS.forEach(group => randomGroupCounts[group] = 0);

    // Count participants in each category
    participantDemographics.forEach(({ age, race, randomGroup }) => {
      if (age && ageCounts.hasOwnProperty(age)) ageCounts[age]++;
      if (race && raceCounts.hasOwnProperty(race)) raceCounts[race]++;
      if (randomGroup && randomGroupCounts.hasOwnProperty(randomGroup)) randomGroupCounts[randomGroup]++;
    });

    return {
      fixedMaxAgeGroupCount: Math.max(...Object.values(ageCounts)),
      fixedMaxRaceCount: Math.max(...Object.values(raceCounts)),
      fixedMaxRandomGroupCount: Math.max(...Object.values(randomGroupCounts)),
    };
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

    const ageCounts = {};
    AGE_GROUPS.forEach(group => ageCounts[group] = 0);

    uniqueParticipants.forEach((ageGroup) => {
      if (ageCounts.hasOwnProperty(ageGroup)) {
        ageCounts[ageGroup]++;
      }
    });

    // Keep all age groups for smooth animation (bars animate to 0 instead of disappearing)
    return {
      categories: AGE_GROUPS,
      data: AGE_GROUPS.map(group => ageCounts[group]),
    };
  }, [data]);

  // Calculate participant counts by race
  const participantByRace = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    data.forEach((record) => {
      if (record.pid) {
        const raceCategory = getRaceCategory(record);
        if (raceCategory) {
          uniqueParticipants.set(record.pid, raceCategory);
        }
      }
    });

    const raceCounts = {};
    RACE_GROUPS.forEach(group => raceCounts[group] = 0);

    uniqueParticipants.forEach((race) => {
      if (raceCounts.hasOwnProperty(race)) {
        raceCounts[race]++;
      }
    });

    // Keep all race groups for smooth animation (bars animate to 0 instead of disappearing)
    return {
      categories: RACE_GROUPS,
      data: RACE_GROUPS.map(group => raceCounts[group]),
    };
  }, [data]);

  // Calculate participant counts by BMI group
  const participantByBMI = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    data.forEach((record) => {
      if (record.pid && record.bmi) {
        const bmiGroup = getBMIGroup(record.bmi);
        if (bmiGroup) {
          uniqueParticipants.set(record.pid, bmiGroup);
        }
      }
    });

    const bmiCounts = {};
    BMI_GROUPS.forEach(group => bmiCounts[group] = 0);

    uniqueParticipants.forEach((bmiGroup) => {
      if (bmiCounts.hasOwnProperty(bmiGroup)) {
        bmiCounts[bmiGroup]++;
      }
    });

    const colors = ['#3498db', '#2ecc71', '#f39c12', '#e67e22', '#e74c3c']; // Blue, Green, Yellow-Orange, Orange, Red
    return BMI_GROUPS.map((group, index) => ({
      name: group,
      y: bmiCounts[group],
      color: colors[index],
    }));
  }, [data]);

  // Calculate participant counts by ethnicity
  const participantByEthnicity = useMemo(() => {
    if (!data || !data.length) return null;

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

    const uniqueParticipants = new Map();
    data.forEach((record) => {
      if (record.pid) {
        const group = getRandomizedGroup(record);
        if (group) {
          uniqueParticipants.set(record.pid, group);
        }
      }
    });

    const groupCounts = {};
    RANDOMIZED_GROUPS.forEach(group => groupCounts[group] = 0);

    uniqueParticipants.forEach((group) => {
      if (groupCounts.hasOwnProperty(group)) {
        groupCounts[group]++;
      }
    });

    // Keep all groups for smooth animation (bars animate to 0 instead of disappearing)
    return {
      categories: RANDOMIZED_GROUPS,
      data: RANDOMIZED_GROUPS.map(group => groupCounts[group]),
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

    const categories = sortedAssays.map(a => getAssayName(a.name));

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
        pointFormat: '<b>{point.y}</b> participants ({point.percentage:.1f}%)<br/><em style="font-size: 10px;">Click to view samples</em>'
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
          point: {
            events: {
              click: function () {
                if (onBarClick) {
                  // Filter data to samples matching this sex
                  const sexSamples = data.filter(record => record.sex === this.name);
                  onBarClick({
                    point: {
                      category: this.name,
                      y: sexSamples.length,
                      samples: sexSamples,
                      demographicType: 'Sex',
                    }
                  });
                }
              }
            }
          }
        }
      },
      series: [{
        name: 'Participants',
        data: participantBySex,
      }],
      credits: { enabled: false },
    };
  }, [participantBySex, data, onBarClick]);

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
        max: fixedMaxAgeGroupCount, // Fixed max for consistent scale across filter changes
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
        pointFormat: '<b>{point.y}</b> participants<br/><em style="font-size: 10px;">Click to view samples</em>'
      },
      plotOptions: {
        column: {
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: { fontSize: '10px' }
          },
          color: '#9b59b6',
          point: {
            events: {
              click: function () {
                if (onBarClick) {
                  const ageGroup = participantByAgeGroup.categories[this.index];
                  // Filter data to samples matching this age group
                  const ageSamples = data.filter(record => record.dmaqc_age_groups === ageGroup);
                  onBarClick({
                    point: {
                      category: ageGroup,
                      y: ageSamples.length,
                      samples: ageSamples,
                      demographicType: 'Age Group',
                    }
                  });
                }
              }
            }
          }
        }
      },
      series: [{
        name: 'Participants',
        data: participantByAgeGroup.data,
      }],
      credits: { enabled: false },
    };
  }, [participantByAgeGroup, fixedMaxAgeGroupCount, data, onBarClick]);

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
        max: fixedMaxRaceCount, // Fixed max for consistent scale across filter changes
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
        pointFormat: '<b>{point.y}</b> participants<br/><em style="font-size: 10px;">Click to view samples</em>'
      },
      plotOptions: {
        column: {
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: { fontSize: '10px' }
          },
          color: '#3498db',
          point: {
            events: {
              click: function () {
                if (onBarClick) {
                  const raceCategory = participantByRace.categories[this.index];
                  // Filter data to samples matching this race
                  const raceSamples = data.filter(record => getRaceCategory(record) === raceCategory);
                  onBarClick({
                    point: {
                      category: raceCategory,
                      y: raceSamples.length,
                      samples: raceSamples,
                      demographicType: 'Race',
                    }
                  });
                }
              }
            }
          }
        }
      },
      series: [{
        name: 'Participants',
        data: participantByRace.data,
      }],
      credits: { enabled: false },
    };
  }, [participantByRace, fixedMaxRaceCount, data, onBarClick]);

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
        pointFormat: '<b>{point.y}</b> participants ({point.percentage:.1f}%)<br/><em style="font-size: 10px;">Click to view samples</em>'
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
          point: {
            events: {
              click: function () {
                if (onBarClick) {
                  // Use the group name directly (e.g., "18.5-24.9")
                  const bmiGroup = this.name;
                  // Filter data to samples matching this BMI group
                  const bmiSamples = data.filter(record => getBMIGroup(record.bmi) === bmiGroup);
                  onBarClick({
                    point: {
                      category: this.name,
                      y: bmiSamples.length,
                      samples: bmiSamples,
                      demographicType: 'BMI Group',
                    }
                  });
                }
              }
            }
          }
        }
      },
      series: [{
        name: 'Participants',
        data: participantByBMI,
      }],
      credits: { enabled: false },
    };
  }, [participantByBMI, data, onBarClick]);

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
        pointFormat: '<b>{point.y}</b> participants ({point.percentage:.1f}%)<br/><em style="font-size: 10px;">Click to view samples</em>'
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
          point: {
            events: {
              click: function () {
                if (onBarClick) {
                  // Map display name to full ethnicity category for filtering
                  const ethnicityMap = {
                    'Latino, Hispanic, or Spanish': 'Latino, Hispanic, or Spanish origin/ethnicity',
                    'Not Latino, Hispanic, or Spanish': 'Not Latino, Hispanic, or Spanish origin/ethnicity',
                    'Refused/Unknown': 'Refused/Unknown',
                  };
                  const fullEthnicityName = ethnicityMap[this.name] || this.name;
                  // Filter data to samples matching this ethnicity
                  const ethnicitySamples = data.filter(record => getEthnicityCategory(record) === fullEthnicityName);
                  onBarClick({
                    point: {
                      category: this.name,
                      y: ethnicitySamples.length,
                      samples: ethnicitySamples,
                      demographicType: 'Ethnicity',
                    }
                  });
                }
              }
            }
          }
        }
      },
      series: [{
        name: 'Participants',
        data: participantByEthnicity,
      }],
      credits: { enabled: false },
    };
  }, [participantByEthnicity, data, onBarClick]);

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
        max: fixedMaxRandomGroupCount, // Fixed max for consistent scale across filter changes
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
        pointFormat: '<b>{point.y}</b> participants<br/><em style="font-size: 10px;">Click to view samples</em>'
      },
      plotOptions: {
        column: {
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: { fontSize: '10px' }
          },
          color: '#e67e22',
          point: {
            events: {
              click: function () {
                if (onBarClick) {
                  const groupCategory = participantByRandomGroup.categories[this.index];
                  // Filter data to samples matching this randomized group
                  const groupSamples = data.filter(record => getRandomizedGroup(record) === groupCategory);
                  onBarClick({
                    point: {
                      category: groupCategory,
                      y: groupSamples.length,
                      samples: groupSamples,
                      demographicType: 'Randomized Group',
                    }
                  });
                }
              }
            }
          }
        }
      },
      series: [{
        name: 'Participants',
        data: participantByRandomGroup.data,
      }],
      credits: { enabled: false },
    };
  }, [participantByRandomGroup, fixedMaxRandomGroupCount, data, onBarClick]);

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
          // Convert assay codes to human-readable names
          const assayList = point.assayTypes && point.assayTypes.length > 0
            ? getAssayNames(point.assayTypes).join(', ')
            : 'N/A';
          
          return `
            <div style="padding: 8px;">
              <strong>Assay:</strong> ${getAssayName(point.assay)}<br/>
              <strong>Phase:</strong> ${point.phase}<br/>
              <strong>Samples:</strong> ${point.y.toLocaleString()}<br/>
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
      <div className="card-container col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <span className="mr-2">Participants</span>
              <i 
                className="bi bi-info-circle-fill text-secondary" 
                style={{ cursor: 'pointer' }}
                data-tooltip-id="participants-info-tooltip"
                data-tooltip-content="Participant distributions by different demographics"
              />
              <Tooltip 
                id="participants-info-tooltip" 
                style={{ fontSize: '0.95rem', maxWidth: '250px' }}
              />
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
      <div className="card-container col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <span className="mr-2">Biospecimen sample counts (per currently available data)</span>
              <i 
                className="bi bi-info-circle-fill text-secondary" 
                style={{ cursor: 'pointer' }}
                data-tooltip-id="biospecimen-sample-count-info-tooltip"
                data-tooltip-content="Biospecimens associated with participants by assays"
              />
              <Tooltip 
                id="biospecimen-sample-count-info-tooltip" 
                style={{ fontSize: '0.95rem', maxWidth: '250px' }}
              />
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
