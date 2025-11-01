/**
 * Utility functions for demographic categorization
 * Used across biospecimen data visualization components
 */

/**
 * Derive race category from boolean indicator fields in a record
 * @param {Object} record - Data record containing race indicator fields
 * @returns {string|null} Race category or null if no race indicator found
 */
export const getRaceCategory = (record) => {
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
  return null;
};

/**
 * Derive randomized group from random_group_code and enroll_random_group_code fields
 * @param {Object} record - Data record containing randomized group code fields
 * @returns {string|null} Randomized group (Control/Endurance/Resistance) or null
 */
export const getRandomizedGroup = (record) => {
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

/**
 * Categorize BMI value into group
 * @param {string|number} bmi - BMI value
 * @returns {string|null} BMI group (Underweight, Normal, Overweight, Obese I, Obese II) or null if invalid
 */
export const getBMIGroup = (bmi) => {
  const bmiValue = parseFloat(bmi);
  if (isNaN(bmiValue)) return null;
  if (bmiValue < 18.5) return 'Underweight (<18.5)';
  if (bmiValue < 25) return 'Normal (18.5-24.9)';
  if (bmiValue < 30) return 'Overweight (25.0-29.9)';
  if (bmiValue < 35) return 'Obese I (30.0-34.9)';
  if (bmiValue < 40) return 'Obese II (35.0-39.9)';
  return 'Obese II (35.0-39.9)'; // BMI >= 40 also falls under Obese II category
};

/**
 * Derive ethnicity category from latino_psca field
 * @param {Object} record - Data record containing latino_psca field
 * @returns {string|null} Ethnicity category or null
 */
export const getEthnicityCategory = (record) => {
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

/**
 * Race groups used for categorization
 */
export const RACE_GROUPS = [
  'African American/Black',
  'Asian',
  'Hawaiian/Pacific Islander',
  'Native American',
  'Caucasian',
  'Other',
  'Unknown'
];

/**
 * Age groups used for categorization
 */
export const AGE_GROUPS = ['10-13', '14-17', '18-39', '40-59', '60+'];

/**
 * BMI groups used for categorization
 */
export const BMI_GROUPS = [
  'Underweight (<18.5)',
  'Normal (18.5-24.9)',
  'Overweight (25.0-29.9)',
  'Obese I (30.0-34.9)',
  'Obese II (35.0-39.9)'
];

/**
 * Randomized groups used for categorization
 */
export const RANDOMIZED_GROUPS = ['Control', 'Endurance', 'Resistance'];

/**
 * Map filter values to actual API values for randomized group comparison
 * @param {Array<string>} filterValues - Array of filter values (e.g., ['Control', 'Endurance'])
 * @returns {Array<string>} Array of API values (e.g., ['ADUControl', 'PEDControl', 'ADUEndur', ...])
 */
export const mapRandomizedGroupFiltersToAPIValues = (filterValues) => {
  if (!filterValues || filterValues.length === 0) return [];
  
  return filterValues.flatMap(option => {
    switch (option) {
      case 'Control':
        return ['ADUControl', 'PEDControl'];
      case 'Endurance':
        return ['ADUEndur', 'ATHEndur', 'PEDEndur'];
      case 'Resistance':
        return ['ADUResist', 'ATHResist'];
      default:
        return [];
    }
  });
};

/**
 * Ethnicity categories
 */
export const ETHNICITY_CATEGORIES = [
  'Latino, Hispanic, or Spanish origin/ethnicity',
  'Not Latino, Hispanic, or Spanish origin/ethnicity',
  'Refused/Unknown'
];
