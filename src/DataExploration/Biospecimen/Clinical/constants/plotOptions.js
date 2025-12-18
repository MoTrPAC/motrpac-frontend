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

/**
* Default filter configurations for biospecimen data
* Centralized default values and filter options
*/
// Default filter state - what's selected when component first loads
export const DEFAULT_FILTERS = {
  sex: ['Male', 'Female'], // Both selected by default
  dmaqc_age_groups: ['10-13', '14-17', '18-39', '40-59', '60+'], // All selected by default
  random_group_code: ['Control', 'Endurance', 'Resistance'], // All selected by default (changed from single value to array)
  bmi_group: ['<18.5', '18.5-24.9', '25.0-29.9', '30.0-34.9', '35.0-39.9'], // All selected by default
  race: ['African American/Black', 'Asian', 'Hawaiian/Pacific Islander', 'Native American', 'Caucasian', 'Other', 'Unknown'], // All selected by default - must match exact strings
  ethnicity: ['Latino, Hispanic, or Spanish origin/ethnicity', 'Not Latino, Hispanic, or Spanish origin/ethnicity', 'Refused/Unknown'], // All selected by default - must match BiospecimenChart.jsx strings
  tissue: ['Adipose', 'Blood', 'Muscle'], // All selected by default
  ome: ['Epigenomic', 'Transcriptomic', 'Proteomic', 'Metabolomic'], // All selected by default
  study: ['Adult Sedentary', 'Adult Highly Active', 'Pediatric Low Active', 'Pediatric High Active'], // All selected by default
  tranche: ['Tranche 0 (PreCOVID)', 'Tranche 1', 'Tranche 2', 'Tranche 3', 'Tranche 4', 'Tranche 5'], // All selected by default
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
  bmiGroupOptions: ['<18.5', '18.5-24.9', '25.0-29.9', '30.0-34.9', '35.0-39.9'],
  raceOptions: ['African American/Black', 'Asian', 'Hawaiian/Pacific Islander', 'Native American', 'Caucasian', 'Other', 'Unknown'],
  ethnicityOptions: ['Latino, Hispanic, or Spanish origin/ethnicity', 'Not Latino, Hispanic, or Spanish origin/ethnicity', 'Refused/Unknown'], // Must match BiospecimenChart.jsx and DEFAULT_FILTERS
  tissueOptions: ['Adipose', 'Blood', 'Muscle'],
  omeOptions: ['Epigenomic', 'Transcriptomic', 'Proteomic', 'Metabolomic'],
  studyOptions: ['Adult Sedentary', 'Adult Highly Active', 'Pediatric Low Active', 'Pediatric High Active'],
  trancheOptions: ['Tranche 0 (PreCOVID)', 'Tranche 1', 'Tranche 2', 'Tranche 3', 'Tranche 4', 'Tranche 5', 'Not yet shipped to CAS'],
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
      bmi_group: [...DEFAULT_FILTERS.bmi_group],
      race: [...DEFAULT_FILTERS.race],
      ethnicity: [...DEFAULT_FILTERS.ethnicity],
      tissue: [...DEFAULT_FILTERS.tissue],
      ome: [...DEFAULT_FILTERS.ome],
      study: [...DEFAULT_FILTERS.study],
      tranche: [...DEFAULT_FILTERS.tranche],
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


