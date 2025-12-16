/**
 * Utility functions for study code categorization
 * Used across biospecimen data visualization components
 */

/**
 * Study code to display name mapping
 */
export const STUDY_CODE_MAPPING = {
  '01': 'Adult Sedentary',
  '02': 'Adult Highly Active',
  '03': 'Pediatric Low Active',
  '04': 'Pediatric High Active',
};

/**
 * Reverse mapping: Display name to study code
 */
export const STUDY_NAME_TO_CODE = {
  'Adult Sedentary': '01',
  'Adult Highly Active': '02',
  'Pediatric Low Active': '03',
  'Pediatric High Active': '04',
};

/**
 * Study groups used for categorization
 */
export const STUDY_GROUPS = [
  'Adult Sedentary',
  'Adult Highly Active',
  'Pediatric Low Active',
  'Pediatric High Active',
];

/**
 * Get study display name from study code
 * @param {string} studyCode - Study code (e.g., '01', '02')
 * @returns {string|null} Study display name or null if not found
 */
export const getStudyName = (studyCode) => {
  return STUDY_CODE_MAPPING[studyCode] || null;
};

/**
 * Get study code from display name
 * @param {string} studyName - Study display name
 * @returns {string|null} Study code or null if not found
 */
export const getStudyCode = (studyName) => {
  return STUDY_NAME_TO_CODE[studyName] || null;
};

/**
 * Map filter values to actual API values for study comparison
 * Converts display names to API codes for backend filtering
 * @param {Array<string>} filterValues - Array of study display names
 * @returns {Array<string>} Array of study codes for API
 */
export const mapStudyFiltersToAPIValues = (filterValues) => {
  if (!filterValues || filterValues.length === 0) {
    return [];
  }

  return filterValues
    .map(getStudyCode)
    .filter(code => code !== null);
};
