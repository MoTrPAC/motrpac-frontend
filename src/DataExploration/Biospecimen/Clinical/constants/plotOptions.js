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

/**
* Default filter configurations for biospecimen data
* Centralized default values and filter options
*/
// Default filter state - what's selected when component first loads
export const DEFAULT_FILTERS = {
  sex: ['Male', 'Female'], // Both selected by default
  dmaqc_age_groups: ['10-13', '14-17', '18-39', '40-59', '60+'], // All selected by default
  random_group_code: 'Control', // Control selected by default
};

// Randomized group code mapping for API queries
export const RANDOMIZED_GROUP_MAPPING = {
  'Control': 'ADUControl,PEDControl',
  'Endurance': 'ADUEndur,ATHEndur,PEDEndur',
  'Resistance': 'ADUResist,ATHResist',
};

// Available filter options for user selection
export const FILTER_OPTIONS = {
  sexOptions: [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ],
  ageGroupOptions: [
    { value: '10-13', label: '10 to 13 years old' },
    { value: '14-17', label: '14 to 17 years old' },
    { value: '18-39', label: '18 to 39 years old' },
    { value: '40-59', label: '40 to 59 years old' },
    { value: '60+', label: '60 years and older' },
  ],
  randomGroupOptions: ['Control', 'Endurance', 'Resistance'],
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
};

/**
* Plot options for biospecimen charts
* Centralized configuration for chart appearance and behavior
*/
export const PLOT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 20,
        padding: 15,
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0,0,0,0.7)',
      titleFont: { size: 16, weight: 'bold' },
      bodyFont: { size: 14 },
      padding: 10,
    },
    title: {
      display: false,
      text: '',
      font: { size: 18, weight: 'bold' },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Tissue Type',
        font: { size: 16, weight: 'bold' },
      },
      ticks: {
        font: { size: 14 },
      },
      grid: {
        display: false,
      },
    },
    y: {
      title: {
        display: true,
        text: 'Number of Biospecimens',
        font: { size: 16, weight: 'bold' },
      },
      ticks: {
        font: { size: 14 },
        beginAtZero: true,
        stepSize: 1,
      },
      grid: {
        color: '#e0e0e0',
      },
    },
  },
};

// Export default plot options
export default PLOT_OPTIONS;

// Helper function to get color for a tissue type
export const getColorForTissue = (tissue) => {
  return TISSUE_COLORS[tissue] || '#7f8c8d'; // Default gray if not found
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
export const INTERVENTION_PHASES = ['Intervention', 'Intervention'];
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

// Export
export function chartConfigFactory() {
  return {
    createBiospecimenChart: ({ series, phases }) => {
      return {
        ...PLOT_OPTIONS,
        title: {
          display: true,
          text: 'Biospecimen Distribution by Tissue and Intervention Phase',
          font: { size: 20, weight: 'bold' },
        },
        xaxis: {
          categories: phases,
          title: {
            text: 'Intervention Phase',
            style: { fontSize: '16px', fontWeight: 'bold' },
          },
        },
        yaxis: {
          title: {
            text: 'Number of Biospecimens',
            style: { fontSize: '16px', fontWeight: 'bold' },
          },
          min: 0,
          tickAmount: 5,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
          },
        },
        fill: {
          opacity: 1,
        },
        series: series.map((s) => ({
          name: s.tissue,
          data: s.data.map((d) => d.y),
          color: getColorForTissue(s.tissue),
        })),
        tooltip: {
          y: {
            formatter: function (val) {
              return val + ' biospecimens';
            },
          },
        },
      };
    },
  };
}
