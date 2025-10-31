/**
 * Utility functions for tissue categorization
 * Used across biospecimen data filtering and visualization
 */

/**
 * Tissue code to name mapping
 */
const TISSUE_CODE_TO_NAME = {
  'ADI': 'Adipose',
  'BLO': 'Blood',
  'MUS': 'Muscle',
};

/**
 * Map tissue code to readable name
 * @param {string} code - Tissue code (e.g., 'ADI', 'BLO', 'MUS')
 * @returns {string|null} Tissue name or null if not found
 */
export const getTissueName = (code) => {
  if (!code) return null;
  return TISSUE_CODE_TO_NAME[code] || null;
};

/**
 * Get all available tissue names
 * @returns {Array<string>} Array of tissue names
 */
export const getAllTissueNames = () => {
  return Object.values(TISSUE_CODE_TO_NAME);
};

/**
 * Get all available tissue codes
 * @returns {Array<string>} Array of tissue codes
 */
export const getAllTissueCodes = () => {
  return Object.keys(TISSUE_CODE_TO_NAME);
};
