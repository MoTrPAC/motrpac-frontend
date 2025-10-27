/**
* Color theme configuration for biospecimen visualizations
* Centralized color definitions for consistency across components
*/
// Primary tissue color mapping
export const TISSUE_COLORS = {
  'Adipose': '#FF9800', // Orange
  'Blood': '#e74c3c',   // Red
  'Muscle': '#3498db',  // Blue
};

// Timepoint color mapping for stacked visualization
export const TIMEPOINT_COLORS = {
  'pre_exercise': '#8B4513',           // SaddleBrown
  'during_20_min': '#DAA520',          // GoldenRod
  'during_40_min': '#FFA500',          // Orange
  'post_10_min': '#32CD32',            // LimeGreen
  'post_15_30_45_min': '#00CED1',      // DarkTurquoise
  'post_3.5_4_hr': '#4169E1',          // RoyalBlue
  'post_24_hr': '#9370DB',             // MediumPurple
};

// Timepoint display configuration
export const TIMEPOINT_CONFIG = {
  'pre_exercise': { label: 'Pre-Exercise', order: 0 },
  'during_20_min': { label: 'During 20 Min', order: 1 },
  'during_40_min': { label: 'During 40 Min', order: 2 },
  'post_10_min': { label: 'Post 10 Min', order: 3 },
  'post_15_30_45_min': { label: 'Post 15-45 Min', order: 4 },
  'post_3.5_4_hr': { label: 'Post 3.5-4 Hour', order: 5 },
  'post_24_hr': { label: 'Post 24 Hour', order: 6 },
};

// Available timepoints for consistency
export const TIMEPOINT_TYPES = Object.keys(TIMEPOINT_CONFIG).sort((a, b) => 
  TIMEPOINT_CONFIG[a].order - TIMEPOINT_CONFIG[b].order
);

// Assay color mapping for visualization consistency
export const ASSAY_COLORS = {
  'IMMUNO': '#e74c3c',      // Red
  'METAB': '#3498db',       // Blue
  'PROT': '#2ecc71',        // Green
  'TRNSCRPT': '#f39c12',    // Orange
  'PHOSPHOPROT': '#9b59b6', // Purple
  'EPIGEN': '#1abc9c',      // Teal
  'GENO': '#34495e',        // Dark Gray
};

// Chart axis configuration options
export const CHART_AXIS_OPTIONS = {
  INTERVENTION_PHASE: 'intervention_phase',
  TIMEPOINT: 'timepoint',
  ASSAY: 'assay'
};

// Chart axis configuration labels
export const CHART_AXIS_LABELS = {
  [CHART_AXIS_OPTIONS.INTERVENTION_PHASE]: 'Group by Intervention Phase',
  [CHART_AXIS_OPTIONS.TIMEPOINT]: 'Group by Exercise Timepoint',
  [CHART_AXIS_OPTIONS.ASSAY]: 'Group by Assay Type'
};

// Default chart axis setting
export const DEFAULT_CHART_AXIS = CHART_AXIS_OPTIONS.INTERVENTION_PHASE;

/**
* Default filter configurations for biospecimen data
* Centralized default values and filter options
*/
// Default filter state - what's selected when component first loads
export const DEFAULT_FILTERS = {
  sex: ['Male', 'Female'], // Both selected by default
  dmaqc_age_groups: ['10-13', '14-17', '18-39', '40-59', '60+'], // All selected by default
  random_group_code: ['Control', 'Endurance', 'Resistance'], // All selected by default (changed from single value to array)
  bmi_group: ['0-25', '25-30', '30+'], // All selected by default
  race: ['African American/Black', 'Asian', 'Hawaiian/Pacific Islander', 'Native American', 'Caucasian', 'Other', 'Unknown'], // All selected by default - must match exact strings
  ethnicity: ['Latino, Hispanic, or Spanish origin/ethnicity', 'Not Latino, Hispanic, or Spanish origin/ethnicity', 'Refused/Unknown'], // All selected by default - must match BiospecimenChart.jsx strings
  tissue: ['Adipose', 'Blood', 'Muscle'], // All selected by default
  ome: ['Epigenomic', 'Transcriptomic', 'Proteomic', 'Metabolomic'], // All selected by default
};

// Randomized group code mapping for API queries
export const RANDOMIZED_GROUP_MAPPING = {
  'Control': 'ADUControl,PEDControl',
  'Endurance': 'ADUEndur,ATHEndur,PEDEndur',
  'Resistance': 'ADUResist,ATHResist',
};

// Available filter options for user selection
export const FILTER_OPTIONS = {
  sexOptions: ['Male', 'Female'],
  ageGroupOptions: ['10-13', '14-17', '18-39', '40-59', '60+'],
  randomGroupOptions: ['Control', 'Endurance', 'Resistance'],
  bmiGroupOptions: ['0-25', '25-30', '30+'],
  raceOptions: ['African American/Black', 'Asian', 'Hawaiian/Pacific Islander', 'Native American', 'Caucasian', 'Other', 'Unknown'],
  ethnicityOptions: ['Latino, Hispanic, or Spanish origin/ethnicity', 'Not Latino, Hispanic, or Spanish origin/ethnicity', 'Refused/Unknown'], // Must match BiospecimenChart.jsx and DEFAULT_FILTERS
  tissueOptions: ['Adipose', 'Blood', 'Muscle'],
  omeOptions: ['Epigenomic', 'Transcriptomic', 'Proteomic', 'Metabolomic'],
};

export const BMI_GROUP_MAPPING = {
  '0-25': 'BMI 0-25',
  '25-30': 'BMI 25-30',
  '30+': 'BMI 30+',
};

/**
* Utility functions for filter management
*/
export const filterUtils = {
  // Check if any filters are active (i.e., not default)
  hasActiveFilters: (filters) => {
    const defaultFilters = DEFAULT_FILTERS;

    // Check
    return Object.keys(filters).some(key => {
      if (Array.isArray(filters[key])) {
        return filters[key].length !== defaultFilters[key].length ||
          !filters[key].every(val => defaultFilters[key].includes(val));
      }
      return filters[key] !== defaultFilters[key];
    });
  },

  // Check if filters match the default state
  isDefaultState: (filters) => {
    const defaultFilters = DEFAULT_FILTERS;

    return Object.keys(defaultFilters).every(key => {
      if (Array.isArray(filters[key])) {
        return filters[key].length === defaultFilters[key].length &&
          filters[key].every(val => defaultFilters[key].includes(val));
      }
      return filters[key] === defaultFilters[key];
    });
  },

  // Reset filters to default values
  resetToDefaults: () => {
    return {
      sex: [...DEFAULT_FILTERS.sex],
      dmaqc_age_groups: [...DEFAULT_FILTERS.dmaqc_age_groups],
      random_group_code: [...DEFAULT_FILTERS.random_group_code], // Now an array
    };
  },
};

// Helper function to get color for a tissue type
export const getColorForTissue = (tissue) => {
  return TISSUE_COLORS[tissue] || '#7f8c8d'; // Default gray if not found
};

// Helper function to get color for a timepoint
export const getColorForTimepoint = (timepoint) => {
  return TIMEPOINT_COLORS[timepoint] || '#7f8c8d'; // Default gray if not found
};

// Helper function to get label for a timepoint
export const getLabelForTimepoint = (timepoint) => {
  return TIMEPOINT_CONFIG[timepoint]?.label || timepoint;
};

// Helper function to get color for an assay type
export const getColorForAssay = (assay) => {
  return ASSAY_COLORS[assay] || '#7f8c8d'; // Default gray if not found
};

// Helper function to parse and normalize assay types from raw data
export const parseAssayTypes = (rawAssays) => {
  if (!rawAssays) return [];
  // Handle both comma and semicolon separators for flexibility
  return rawAssays.split(/[,;]/).map(assay => assay.trim()).filter(assay => assay);
};

// Mappings:
// `ADU_BAS' AND `PED_BAS' TO `Pre-Intervention'
// `ADU_PAS' AND `PED_PAS' TO `Post-Intervention'
export const VISIT_CODE_TO_PHASE = {
  'ADU_BAS': 'Pre-Intervention',
  'PED_BAS': 'Pre-Intervention',
  'ADU_PAS': 'Post-Intervention',
  'PED_PAS': 'Post-Intervention',
};

// Map tissue codes to readable names
export const TISSUE_CODE_TO_NAME = {
  'ADI': 'Adipose',
  'BLO': 'Blood',
  'MUS': 'Muscle',
};

// Define intervention phases and tissue types for consistency
export const INTERVENTION_PHASES = ['Pre-Intervention', 'Post-Intervention'];
export const TISSUE_TYPES = ['Adipose', 'Blood', 'Muscle']; // Consistent tissue types


/**
* Utility functions for caching biospecimen data
* Centralized cache key generation and management
*/
// Generate a unique cache key based on filters
export const generateCacheKey = (filters) => {
  const sortedFilters = Object.keys(filters)
    .sort()
    .reduce((sorted, key) => {
      if (filters[key] && filters[key] !== '') {
        sorted[key] = filters[key];
      }
      return sorted;
    }, {});

  return 'biospecimen-' + JSON.stringify(sortedFilters);
};
// Example usage of generateCacheKey
// const cacheKey = generateCacheKey
// console.log('Generated Cache Key:', cacheKey);

// Export chart configuration factory
export const chartConfigFactory = {
  createBiospecimenChart: ({ title, subtitle, onBarClick, series, categories, axisMode = DEFAULT_CHART_AXIS }) => {
    const isTimepoint = axisMode === CHART_AXIS_OPTIONS.TIMEPOINT;
    const isAssay = axisMode === CHART_AXIS_OPTIONS.ASSAY;
    
    // Determine appropriate axis title and categories
    let xAxisTitle, defaultCategories, shouldRotateLabels;
    if (isAssay) {
      xAxisTitle = 'Assay Type';
      defaultCategories = []; // Will be dynamically determined from data
      shouldRotateLabels = true; // Rotate labels for better readability
    } else if (isTimepoint) {
      xAxisTitle = 'Exercise Timepoint';
      defaultCategories = TIMEPOINT_TYPES.map(t => getLabelForTimepoint(t));
      shouldRotateLabels = true; // Timepoint labels can be long
    } else {
      xAxisTitle = 'Intervention Phase';
      defaultCategories = INTERVENTION_PHASES;
      shouldRotateLabels = false; // Phase names are short
    }
    
    const config = {
      chart: {
        type: 'column',
        height: 450,
        animation: {
          duration: 400,
          easing: 'easeOutQuart'
        },
      },
      title: {
        text: title || 'Biospecimen Distribution',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
        },
      },
      subtitle: {
        text: subtitle || '',
        style: {
          fontSize: '14px',
          color: '#666',
        },
      },
      xAxis: {
        categories: categories || defaultCategories,
        title: {
          text: xAxisTitle,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
          margin: 30,
        },
        labels: {
          rotation: shouldRotateLabels ? -45 : 0,
          style: {
            fontSize: '12px',
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Sample Count',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
          margin: 30,
        },
        allowDecimals: false,
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        layout: 'horizontal',
      },
      plotOptions: {
        column: {
          grouping: true,
          shadow: false,
          borderWidth: 0,
          cursor: 'pointer',
          animation: {
            duration: 500,
            easing: 'easeOutCubic'
          },
          // No stacking needed - both modes now use simple grouped columns
        },
        series: {
          animation: {
            duration: 350,
            defer: function(series) {
              return series.index * 50; // Stagger series by 50ms
            }
          },
          point: {
            events: {
              click: function (event) {
                try {
                  console.log('Bar clicked:', this, event);
                  if (typeof onBarClick === 'function') {
                    onBarClick({
                      point: this,
                      event: event,
                    });
                  }
                } catch (error) {
                  console.error('Error in click handler:', error);
                }
              },
            },
          },
        },
      },
      series: series || [],
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          try {
            let tooltip = `<b>${this.x}</b><br/>`;
            
            if (this.points) {
              // Both modes now use simple grouped columns, so same tooltip format
              this.points.forEach((point) => {
                tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b> samples<br/>`;
              });
            }
            return tooltip;
          } catch (error) {
            console.error('Error in tooltip formatter:', error);
            return `<b>${this.x || 'Data'}</b>`;
          }
        },
      },
      credits: {
        enabled: false,
      },
    };
    
    // Validate the configuration before returning
    if (!config.chart || !config.series) {
      console.error('Invalid chart configuration:', config);
      return null;
    }
    
    return config;
  },
};
