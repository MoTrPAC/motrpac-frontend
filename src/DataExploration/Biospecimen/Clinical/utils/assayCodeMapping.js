/**
 * Mapping of assay codes to assay names from assay_codes.csv
 * This provides human-readable names for assay codes used in the biospecimen data
 */
const ASSAY_CODE_TO_NAME = {
  'transcript-rna-seq': 'rna-seq',
  'transcript-rna-seq-splicing': 'rna-seq',
  'epigen-rrbs': 'RRBS',
  'epigen-methylcap-seq': 'Methyl Capture',
  'epigen-atac-seq': 'atac-seq',
  'genomic-wgs': 'wgs',
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
  'immunoassay': 'Multiplexed immunoassays',
  'lab-ck': 'Clinical Chemistry, Activity Assay Creatine Kinase (CK)',
  'lab-glc': 'Clinical Chemistry, Immunoassay Glucagon (GLC)',
  'lab-ins': 'Clinical Chemistry, Immunoassay Insulin (INS)',
  'prot-ol': 'Proximity extension assay-based technology for multiplexed protein analysis',
  'lab-crt': 'Clinical Chemistry, Immunoassay Cortisol (CRT)',
};

/**
 * Get the full assay name from an assay code
 * @param {string} assayCode - The assay code (e.g., 'prot-pr')
 * @returns {string} The full assay name or the original code if not found
 */
export const getAssayName = (assayCode) => {
  return ASSAY_CODE_TO_NAME[assayCode] || assayCode;
};

/**
 * Convert an array of assay codes to assay names
 * @param {Array<string>} assayCodes - Array of assay codes
 * @returns {Array<string>} Array of assay names
 */
export const getAssayNames = (assayCodes) => {
  return assayCodes.map(code => ASSAY_CODE_TO_NAME[code] || code);
};
