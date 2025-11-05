/**
 * Mapping of assay codes to assay short names from assay_codes.csv
 * This provides human-readable short names for assay codes used in the biospecimen data
 */
const ASSAY_CODE_TO_NAME = {
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
  'immunoassay': 'Immuno',
  'lab-ck': 'CK',
  'lab-glc': 'Glucagon',
  'lab-ins': 'Insulin',
  'prot-ol': 'Olink',
  'lab-crt': 'Cortisol',
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
