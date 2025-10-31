/**
 * Data transformation utility functions
 * Centralized utilities for transforming raw data codes to human-readable formats
 */

import { getTissueName } from './tissueUtils';

/**
 * Tranche code to name mapping
 */
const TRANCHE_CODE_TO_NAME = {
  'TR00': 'Tranche 0',
  'TR01': 'Tranche 1',
  'TR02': 'Tranche 2',
  'TR03': 'Tranche 3',
  'TR04': 'Tranche 4',
};

/**
 * Transform tissue code to human-readable name
 * Reuses existing tissueUtils for consistency
 * @param {string} code - Tissue code (e.g., 'ADI', 'BLO', 'MUS')
 * @returns {string} Tissue name or original code if not found
 */
export const transformTissueCode = (code) => {
  if (!code) return code;
  return getTissueName(code) || code;
};

/**
 * Transform tranche code to human-readable name
 * @param {string} code - Tranche code (e.g., 'TR00', 'TR01')
 * @returns {string} Tranche name or original code if not found
 */
export const transformTrancheCode = (code) => {
  if (!code) return code;
  return TRANCHE_CODE_TO_NAME[code] || code;
};

/**
 * Transform received_cas code to Yes/No
 * @param {number|string} value - CAS received value (typically 0 or 1)
 * @returns {string} 'Yes' or 'No'
 */
export const transformCASReceived = (value) => {
  return Number(value) === 1 ? 'Yes' : 'No';
};

/**
 * Get all available tranche codes
 * @returns {Array<string>} Array of tranche codes
 */
export const getAllTrancheCodes = () => {
  return Object.keys(TRANCHE_CODE_TO_NAME);
};

/**
 * Get all available tranche names
 * @returns {Array<string>} Array of tranche names
 */
export const getAllTrancheNames = () => {
  return Object.values(TRANCHE_CODE_TO_NAME);
};
