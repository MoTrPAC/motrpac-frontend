/**
 * Utility functions for ome (omics) categorization
 * Used for categorizing assay types into omics categories
 */

/**
 * Available ome categories
 */
export const OME_CATEGORIES = [
  'Epigenomic',
  'Transcriptomic',
  'Proteomic',
  'Metabolomic'
];

/**
 * Map assay codes to ome categories using prefix patterns
 * @param {string} assayData - Comma or semicolon-separated assay codes
 * @returns {Array<string>} Array of ome categories
 */
export const getOmeCategories = (assayData) => {
  if (!assayData) return [];
  
  // Special case: "All" means the sample applies to all ome types
  if (assayData.trim().toLowerCase() === 'all') {
    return [...OME_CATEGORIES];
  }
  
  // Parse the comma/semicolon-separated assay codes
  const assayCodes = assayData
    .split(/[,;]/)
    .map(code => code.trim().toLowerCase())
    .filter(code => code);
  
  // Map assay codes to ome categories using substring matching
  const omeCategories = new Set();
  
  assayCodes.forEach(code => {
    // Epigenomic: contains 'epigen-' or 'genomic-wgs'
    if (code.includes('epigen-') || code.includes('genomic-wgs')) {
      omeCategories.add('Epigenomic');
    }
    // Transcriptomic: contains 'transcript-'
    if (code.includes('transcript-')) {
      omeCategories.add('Transcriptomic');
    }
    // Proteomic: contains 'prot-'
    if (code.includes('prot-')) {
      omeCategories.add('Proteomic');
    }
    // Metabolomic: contains 'metab-' or 'lab-'
    if (code.includes('metab-') || code.includes('lab-')) {
      omeCategories.add('Metabolomic');
    }
  });
  
  return Array.from(omeCategories);
};

/**
 * Check if an item matches any of the selected ome categories
 * @param {string} assayData - Comma or semicolon-separated assay codes
 * @param {Array<string>} selectedCategories - Array of selected ome categories to filter by
 * @returns {boolean} True if item matches at least one selected category OR has no assay data
 */
export const matchesOmeCategories = (assayData, selectedCategories) => {
  if (!selectedCategories || selectedCategories.length === 0) return true;
  
  const itemCategories = getOmeCategories(assayData);
  
  // If record has no ome categories, keep it (don't filter based on missing data)
  // If record has ome categories, it must match at least one selected filter
  return itemCategories.length === 0 || 
         itemCategories.some(cat => selectedCategories.includes(cat));
};
