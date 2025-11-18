/**
 * Mapping of assay codes to assay short names from assay_codes.csv
 * This provides human-readable short names for assay codes used in the biospecimen data
 */
const ASSAY_CODE_TO_SHORT_NAME = {
  'transcript-rna-seq': 'RNA-seq',
  'transcript-rna-seq-splicing': 'RNA-seq Splice',
  'epigen-rrbs': 'RRBS',
  'epigen-methylcap-seq': 'MethylCap-seq',
  'epigen-atac-seq': 'ATAC-seq',
  'genomic-wgs': 'WGS',
  'prot-pr': 'Prot(MS)',
  'prot-ph': 'Phospho',
  'prot-ac': 'Acetyl',
  'prot-ub': 'Ubiq',
  'metab-t-3hib': '3-HIB(T)',
  'metab-t-aa': 'AA(T)',
  'metab-t-ac-duke': 'Acyl(T)',
  'metab-t-acoa': 'Acyl-CoA(T)',
  'metab-t-baiba': 'BAIBA(T)',
  'metab-t-cer-duke': 'Cer(T)',
  'lab-conv': 'Conv(T)',
  'metab-t-ka': 'KA(T)',
  'metab-t-nuc': 'Nuc(T)',
  'metab-t-oa': 'Org Acids(T)',
  'metab-t-sphm': 'Sphingo(T)',
  'metab-t-oxylipneg': 'Oxylipin(T)',
  'metab-t-etamidpos': 'Ethanolamide(T)',
  'metab-t-ac-mayo': 'Acyl(T)',
  'metab-t-amines': 'Amines(T)',
  'metab-t-cer-mayo': 'Cer(T)',
  'metab-t-tca': 'TCA(T)',
  'metab-u-hilicpos': 'HILIC(U)',
  'metab-u-lrpneg': 'Lipid RPN(U)',
  'metab-u-lrppos': 'Lipid RPP(U)',
  'metab-u-rppos': 'RPP(U)',
  'metab-u-rpneg': 'RPN(U)',
  'metab-u-ionpneg': 'IPN(U)',
  immunoassay: 'Immuno',
  'lab-ck': 'CK',
  'lab-glc': 'Glucagon',
  'lab-ins': 'Insulin',
  'prot-ol': 'Olink',
  'lab-crt': 'Cortisol',
};

/**
 * Mapping of assay codes to full assay names from assay_codes.csv
 * This provides full descriptive names for assay codes used in tooltips
 */
const ASSAY_CODE_TO_FULL_NAME = {
  'transcript-rna-seq': 'RNA-seq',
  'transcript-rna-seq-splicing': 'RNA-seq',
  'epigen-rrbs': 'RRBS',
  'epigen-methylcap-seq': 'Methyl Capture',
  'epigen-atac-seq': 'ATAC-seq',
  'genomic-wgs': 'WGS',
  'prot-pr': 'Global Proteomics',
  'prot-ph': 'Phosphoproteomics',
  'prot-ac': 'Acetyl proteomics',
  'prot-ub': 'Protein Ubiquitination',
  'metab-t-3hib': 'Targeted 3-Hydroxyisobutyric Acid (3-HIB)',
  'metab-t-aa': 'Targeted Amino Acids',
  'metab-t-ac-duke': 'Targeted Acylcarnitines (Duke)',
  'metab-t-acoa': 'Targeted Acyl-CoA',
  'metab-t-baiba': 'Targeted Beta-Aminoisobutyric acid',
  'metab-t-cer-duke': 'Targeted Ceramide (Duke)',
  'lab-conv': 'Clinical chemistry assays for conventional metabolites',
  'metab-t-ka': 'Targeted Keto Acids',
  'metab-t-nuc': 'Targeted Nucleotides',
  'metab-t-oa': 'Targeted Organic Acids',
  'metab-t-sphm': 'Targeted Sphingomyelin',
  'metab-t-oxylipneg': 'Targeted Oxylipins',
  'metab-t-etamidpos': 'Targeted Ethanolamides',
  'metab-t-ac-mayo': 'Targeted Acylcarnitines (Mayo)',
  'metab-t-amines': 'Targeted Amines',
  'metab-t-cer-mayo': 'Targeted Ceramides (Mayo)',
  'metab-t-tca': 'Targeted Tricarboxylic Acid Cycle',
  'metab-u-hilicpos': 'Untargeted HILIC-Positive',
  'metab-u-lrpneg': 'Untargeted Lipidomics, Reversed-Phase Negative',
  'metab-u-lrppos': 'Untargeted Lipidomics, Reversed-Phase Positive',
  'metab-u-rppos': 'Untargeted Reversed-Phase Positive',
  'metab-u-rpneg': 'Untargeted Reversed-Phase Negative',
  'metab-u-ionpneg': 'Untargeted Ion-Pair Negative',
  immunoassay: 'Multiplexed immunoassays',
  'lab-ck': 'Clinical Chemistry, Activity Assay Creatine Kinase (CK)',
  'lab-glc': 'Clinical Chemistry, Immunoassay Glucagon (GLC)',
  'lab-ins': 'Clinical Chemistry, Immunoassay Insulin (INS)',
  'prot-ol':
    'Proximity extension assay-based technology for multiplexed protein analysis',
  'lab-crt': 'Clinical Chemistry, Immunoassay Cortisol (CRT)',
};

/**
 * Get the assay short name from an assay code (for y-axis labels)
 * @param {string} assayCode - The assay code (e.g., 'prot-pr')
 * @returns {string} The assay short name or the original code if not found
 */
export const getAssayShortName = (assayCode) => {
  return ASSAY_CODE_TO_SHORT_NAME[assayCode] || assayCode;
};

/**
 * Get the full assay name from an assay code (for tooltips)
 * @param {string} assayCode - The assay code (e.g., 'prot-pr')
 * @returns {string} The full assay name or the original code if not found
 */
export const getAssayFullName = (assayCode) => {
  return ASSAY_CODE_TO_FULL_NAME[assayCode] || assayCode;
};

/**
 * Convert an array of assay codes to assay short names
 * @param {Array<string>} assayCodes - Array of assay codes
 * @returns {Array<string>} Array of assay short names
 */
export const getAssayShortNames = (assayCodes) => {
  return assayCodes.map((code) => ASSAY_CODE_TO_SHORT_NAME[code] || code);
};

/**
 * Convert an array of assay codes to full assay names
 * @param {Array<string>} assayCodes - Array of assay codes
 * @returns {Array<string>} Array of full assay names
 */
export const getAssayFullNames = (assayCodes) => {
  return assayCodes.map((code) => ASSAY_CODE_TO_FULL_NAME[code] || code);
};

// Legacy exports for backward compatibility (deprecated - use getAssayShortName instead)
export const getAssayName = getAssayShortName;
export const getAssayNames = getAssayShortNames;
