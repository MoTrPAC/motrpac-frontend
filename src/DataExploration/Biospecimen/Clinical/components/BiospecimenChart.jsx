import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Tooltip } from 'react-tooltip';
import {
  parseAssayTypes,
  VISIT_CODE_TO_PHASE,
  INTERVENTION_PHASES,
  TISSUE_COLORS,
  TISSUE_TYPES,
} from '../constants/plotOptions';
import { getAssayShortName, getAssayFullName, getAssayFullNames } from '../utils/assayCodeMapping';
import { getTissueName } from '../utils/tissueUtils';
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
import { getStudyName, STUDY_GROUPS } from '../utils/studyUtils';

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
 * - Tissue-based stacked bars when tissue filters are active
 */
const BiospecimenChart = ({ data, allData, loading, error, onBarClick, activeFilters }) => {
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
  const { fixedMaxAgeGroupCount, fixedMaxRaceCount, fixedMaxRandomGroupCount, fixedMaxStudyCount } = useMemo(() => {
    if (!allData || !allData.length) {
      return { fixedMaxAgeGroupCount: 0, fixedMaxRaceCount: 0, fixedMaxRandomGroupCount: 0, fixedMaxStudyCount: 0 };
    }

    // Store unique participants with their demographics (single Map per PID)
    const participantDemographics = new Map();

    allData.forEach((record) => {
      if (record.pid && !participantDemographics.has(record.pid)) {
        participantDemographics.set(record.pid, {
          age: record.dmaqc_age_groups,
          race: getRaceCategory(record),
          randomGroup: getRandomizedGroup(record),
          study: getStudyName(record.study),
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
    
    const studyCounts = {};
    STUDY_GROUPS.forEach(group => studyCounts[group] = 0);

    // Count participants in each category
    participantDemographics.forEach(({ age, race, randomGroup, study }) => {
      if (age && ageCounts.hasOwnProperty(age)) ageCounts[age]++;
      if (race && raceCounts.hasOwnProperty(race)) raceCounts[race]++;
      if (randomGroup && randomGroupCounts.hasOwnProperty(randomGroup)) randomGroupCounts[randomGroup]++;
      if (study && studyCounts.hasOwnProperty(study)) studyCounts[study]++;
    });

    return {
      fixedMaxAgeGroupCount: Math.max(...Object.values(ageCounts)),
      fixedMaxRaceCount: Math.max(...Object.values(raceCounts)),
      fixedMaxRandomGroupCount: Math.max(...Object.values(randomGroupCounts)),
      fixedMaxStudyCount: Math.max(...Object.values(studyCounts)),
    };
  }, [allData]);

  // Calculate participant counts by sex
  const participantBySex = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    const samplesBySex = { Male: [], Female: [] };
    
    data.forEach((record) => {
      if (record.pid && record.sex) {
        if (!uniqueParticipants.has(record.pid)) {
          uniqueParticipants.set(record.pid, record.sex);
        }
        // Guard against unexpected sex values
        if (samplesBySex[record.sex]) {
          samplesBySex[record.sex].push(record);
        }
      }
    });

    const sexCounts = { Male: 0, Female: 0 };
    uniqueParticipants.forEach((sex) => {
      if (sex === 'Male') sexCounts.Male++;
      else sexCounts.Female++;
    });

    return [
      { name: 'Male', y: sexCounts.Male, color: '#4e79a7', samples: samplesBySex.Male },
      { name: 'Female', y: sexCounts.Female, color: '#e15759', samples: samplesBySex.Female },
    ];
  }, [data]);

  // Calculate participant counts by age group
  const participantByAgeGroup = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    const samplesByAgeGroup = {};
    AGE_GROUPS.forEach(group => samplesByAgeGroup[group] = []);
    
    data.forEach((record) => {
      if (record.pid && record.dmaqc_age_groups) {
        if (!uniqueParticipants.has(record.pid)) {
          uniqueParticipants.set(record.pid, record.dmaqc_age_groups);
        }
        // Guard against unexpected age group values
        if (samplesByAgeGroup[record.dmaqc_age_groups]) {
          samplesByAgeGroup[record.dmaqc_age_groups].push(record);
        }
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
      data: AGE_GROUPS.map(group => ({
        y: ageCounts[group],
        samples: samplesByAgeGroup[group], // Attach samples to each data point
      })),
    };
  }, [data]);

  // Calculate participant counts by race
  const participantByRace = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    const samplesByRace = {};
    RACE_GROUPS.forEach(group => samplesByRace[group] = []);
    
    data.forEach((record) => {
      if (record.pid) {
        const raceCategory = getRaceCategory(record);
        if (raceCategory) {
          if (!uniqueParticipants.has(record.pid)) {
            uniqueParticipants.set(record.pid, raceCategory);
          }
          // Guard against unexpected race category values
          if (samplesByRace[raceCategory]) {
            samplesByRace[raceCategory].push(record);
          }
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
      data: RACE_GROUPS.map(group => ({
        y: raceCounts[group],
        samples: samplesByRace[group], // Attach samples to each data point
      })),
    };
  }, [data]);

  // Calculate participant counts by BMI group
  const participantByBMI = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    const samplesByBMIGroup = {};
    BMI_GROUPS.forEach(group => samplesByBMIGroup[group] = []);

    data.forEach((record) => {
      if (record.pid && record.bmi) {
        const bmiGroup = getBMIGroup(record.bmi);
        if (bmiGroup) {
          if (!uniqueParticipants.has(record.pid)) {
            uniqueParticipants.set(record.pid, bmiGroup);
          }
          // Guard against unexpected BMI group values
          if (samplesByBMIGroup[bmiGroup]) {
            samplesByBMIGroup[bmiGroup].push(record);
          }
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
      samples: samplesByBMIGroup[group], // Attach samples directly to data point
    }));
  }, [data]);

  // Calculate participant counts by ethnicity
  const participantByEthnicity = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    const samplesByEthnicity = {
      'Latino, Hispanic, or Spanish origin/ethnicity': [],
      'Not Latino, Hispanic, or Spanish origin/ethnicity': [],
      'Refused/Unknown': [],
    };
    
    data.forEach((record) => {
      if (record.pid) {
        const ethnicityCategory = getEthnicityCategory(record);
        if (ethnicityCategory) {
          if (!uniqueParticipants.has(record.pid)) {
            uniqueParticipants.set(record.pid, ethnicityCategory);
          }
          // Guard against unexpected ethnicity category values
          if (samplesByEthnicity[ethnicityCategory]) {
            samplesByEthnicity[ethnicityCategory].push(record);
          }
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
        color: '#16a085',
        samples: samplesByEthnicity['Latino, Hispanic, or Spanish origin/ethnicity'],
      },
      { 
        name: 'Not Latino, Hispanic, or Spanish', 
        y: ethnicityCounts['Not Latino, Hispanic, or Spanish origin/ethnicity'], 
        color: '#95a5a6',
        samples: samplesByEthnicity['Not Latino, Hispanic, or Spanish origin/ethnicity'],
      },
      { 
        name: 'Refused/Unknown', 
        y: ethnicityCounts['Refused/Unknown'], 
        color: '#bdc3c7',
        samples: samplesByEthnicity['Refused/Unknown'],
      },
    ];
  }, [data]);

  // Calculate participant counts by randomized group
  const participantByRandomGroup = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    const samplesByGroup = {};
    RANDOMIZED_GROUPS.forEach(group => samplesByGroup[group] = []);
    
    data.forEach((record) => {
      if (record.pid) {
        const group = getRandomizedGroup(record);
        if (group) {
          if (!uniqueParticipants.has(record.pid)) {
            uniqueParticipants.set(record.pid, group);
          }
          // Guard against unexpected randomized group values
          if (samplesByGroup[group]) {
            samplesByGroup[group].push(record);
          }
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
      data: RANDOMIZED_GROUPS.map(group => ({
        y: groupCounts[group],
        samples: samplesByGroup[group], // Attach samples to each data point
      })),
    };
  }, [data]);

  // Calculate participant counts by study
  const participantByStudy = useMemo(() => {
    if (!data || !data.length) return null;

    const uniqueParticipants = new Map();
    const samplesByStudy = {};
    STUDY_GROUPS.forEach(group => samplesByStudy[group] = []);
    
    data.forEach((record) => {
      if (record.pid) {
        const study = getStudyName(record.study);
        if (study) {
          if (!uniqueParticipants.has(record.pid)) {
            uniqueParticipants.set(record.pid, study);
          }
          // Guard against unexpected study values
          if (samplesByStudy[study]) {
            samplesByStudy[study].push(record);
          }
        }
      }
    });

    const studyCounts = {};
    STUDY_GROUPS.forEach(group => studyCounts[group] = 0);

    uniqueParticipants.forEach((study) => {
      if (studyCounts.hasOwnProperty(study)) {
        studyCounts[study]++;
      }
    });

    // Keep all groups for smooth animation (bars animate to 0 instead of disappearing)
    return {
      categories: STUDY_GROUPS,
      data: STUDY_GROUPS.map(group => ({
        y: studyCounts[group],
        samples: samplesByStudy[group], // Attach samples to each data point
      })),
    };
  }, [data]);

  // Transform data for chart - separate charts for Pre and Post phases
  // Always displays tissue-based stacked bars
  const chartData = useMemo(() => {
    if (!data || !data.length) return null;

    // Determine which tissues to show in the chart
    // If no tissue filters are active (length 0), show all tissues (default behavior)
    // Otherwise, show only the selected tissues
    const selectedTissues = activeFilters?.tissue?.length > 0 
      ? activeFilters.tissue 
      : TISSUE_TYPES;

    // Always maintain consistent tissue order: Adipose, Blood, Muscle
    const orderedSelectedTissues = TISSUE_TYPES.filter(t => selectedTissues.includes(t));

    // Collect all unique assay types and group data by tissue
    const assayData = {};

    data.forEach((record) => {
      const visitCode = record.visit_code;
      const phase = VISIT_CODE_TO_PHASE[visitCode];

      if (!phase) return;

      const assays = parseAssayTypes(record.raw_assays_with_results);
      const tissueName = getTissueName(record.sample_group_code);
      
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
              byTissue: {},
            };
          });
        }

        const phaseData = assayData[assay].byPhase[phase];

        // Always track tissue-specific data for stacking
        if (tissueName) {
          if (!phaseData.byTissue[tissueName]) {
            phaseData.byTissue[tissueName] = {
              count: 0,
              samples: [],
              assayTypes: new Set(),
            };
          }
          phaseData.byTissue[tissueName].count++;
          phaseData.byTissue[tissueName].samples.push(record);
          phaseData.byTissue[tissueName].assayTypes.add(assay);
        }

        phaseData.count++;
        phaseData.samples.push(record);
        phaseData.assayTypes.add(assay);
        assayData[assay].total++;
      });
    });

    // Sort assays by total count (descending)
    const sortedAssays = Object.values(assayData)
      .sort((a, b) => b.total - a.total);

    const categories = sortedAssays.map(a => getAssayShortName(a.name));

    // Create separate chart data for Pre-Intervention and Post-Intervention phases
    // Always use stacked series by tissue in consistent order
    const chartsData = INTERVENTION_PHASES.map((phase) => {
      // Create stacked series - one per selected tissue, in consistent order
      // Zero-count data points are set to null so Highcharts doesn't render them
      const series = orderedSelectedTissues
        .map(tissueName => {
          const dataPoints = sortedAssays.map(assay => {
            const phaseData = assay.byPhase[phase];
            const tissueData = phaseData?.byTissue?.[tissueName];
            const count = tissueData ? tissueData.count : 0;
            
            return {
              // Use null for zero values so Highcharts doesn't render them
              y: count === 0 ? null : count,
              phase,
              assay: assay.name,
              tissue: tissueName,
              samples: tissueData ? tissueData.samples : [],
              assayTypes: tissueData ? Array.from(tissueData.assayTypes) : [],
            };
          });
          
          return {
            name: tissueName,
            color: TISSUE_COLORS[tissueName],
            data: dataPoints,
          };
        });
        
      return { phase, categories, series };
    });

    return chartsData;
  }, [data, activeFilters]);

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
                if (onBarClick && this.samples) {
                  onBarClick({
                    point: {
                      category: this.name,
                      y: this.samples.length,
                      samples: this.samples,
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
  }, [participantBySex, onBarClick]);

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
                if (onBarClick && this.samples) {
                  const ageGroup = participantByAgeGroup.categories[this.index];
                  onBarClick({
                    point: {
                      category: ageGroup,
                      y: this.samples.length,
                      samples: this.samples,
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
  }, [participantByAgeGroup, fixedMaxAgeGroupCount, onBarClick]);

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
                if (onBarClick && this.samples) {
                  const raceCategory = participantByRace.categories[this.index];
                  onBarClick({
                    point: {
                      category: raceCategory,
                      y: this.samples.length,
                      samples: this.samples,
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
  }, [participantByRace, fixedMaxRaceCount, onBarClick]);

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
                if (onBarClick && this.samples) {
                  onBarClick({
                    point: {
                      category: this.name,
                      y: this.samples.length,
                      samples: this.samples,
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
  }, [participantByBMI, onBarClick]);

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
                if (onBarClick && this.samples) {
                  onBarClick({
                    point: {
                      category: this.name,
                      y: this.samples.length,
                      samples: this.samples,
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
  }, [participantByEthnicity, onBarClick]);

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
                if (onBarClick && this.samples) {
                  const groupCategory = participantByRandomGroup.categories[this.index];
                  onBarClick({
                    point: {
                      category: groupCategory,
                      y: this.samples.length,
                      samples: this.samples,
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
  }, [participantByRandomGroup, fixedMaxRandomGroupCount, onBarClick]);

  // Bar chart configuration for study distribution
  const studyBarChartOptions = useMemo(() => {
    if (!participantByStudy) return null;

    return {
      chart: {
        type: 'column',
        height: 300,
      },
      title: {
        text: 'Study Distribution',
        style: { fontSize: '14px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: participantByStudy.categories,
        title: {
          text: 'Study',
          style: { fontSize: '12px', fontWeight: 'bold' }
        },
        labels: {
          style: { fontSize: '11px' },
          rotation: -45,
          align: 'right'
        }
      },
      yAxis: {
        min: 0,
        max: fixedMaxStudyCount, // Fixed max for consistent scale across filter changes
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
          color: '#16a085',
          point: {
            events: {
              click: function () {
                if (onBarClick && this.samples) {
                  const studyCategory = participantByStudy.categories[this.index];
                  onBarClick({
                    point: {
                      category: studyCategory,
                      y: this.samples.length,
                      samples: this.samples,
                      demographicType: 'Study',
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
        data: participantByStudy.data,
      }],
      credits: { enabled: false },
    };
  }, [participantByStudy, fixedMaxStudyCount, onBarClick]);

  // Chart configurations for both Pre and Post phases
  // Always display stacked bars by tissue
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
        text: 'Click bars for sample details',
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
          y: 30,
          style: { fontSize: '12px', fontWeight: 'bold' }
        },
        labels: {
          style: { fontSize: '11px' }
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          fontSize: '11px'
        }
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const point = this.point;
          // Convert assay codes to human-readable names
          const assayList = point.assayTypes && point.assayTypes.length > 0
            ? getAssayFullNames(point.assayTypes).join(', ')
            : 'N/A';
          
          return `
            <div style="padding: 8px;">
              <strong>Assay:</strong> ${getAssayFullName(point.assay)}<br/>
              <strong>Tissue:</strong> ${point.tissue}<br/>
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
            formatter: function() {
              // Don't show label for null values (used to hide zero-count segments)
              return this.y === null ? null : this.y;
            },
            style: { fontSize: '10px' }
          },
          groupPadding: 0.1,
          pointPadding: 0.05,
        },
        series: {
          stacking: 'normal',
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                if (onBarClick && this.samples) {
                  onBarClick({ 
                    point: {
                      ...this,
                      tissue: this.tissue || this.series.name
                    }
                  });
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
            <div className="row mt-4">
              <div className="col-md-6">
                {/* Bar chart of participant count in each study */}
                {studyBarChartOptions ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={studyBarChartOptions}
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
  activeFilters: PropTypes.object,
};

export default BiospecimenChart;
