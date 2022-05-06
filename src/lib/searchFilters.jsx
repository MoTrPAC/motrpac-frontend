export const tissueList = [
  { filter_value: 'adrenal', filter_label: 'Adrenal' },
  { filter_value: 'blood rna', filter_label: 'Blood RNA' },
  { filter_value: 'brown adipose', filter_label: 'Brown Adipose' },
  { filter_value: 'colon', filter_label: 'Colon' },
  { filter_value: 'cortex', filter_label: 'Cortex' },
  { filter_value: 'gastrocnemius', filter_label: 'Gastrocnemius' },
  { filter_value: 'heart', filter_label: 'Heart' },
  { filter_value: 'hippocampus', filter_label: 'Hippocampus' },
  { filter_value: 'hypothalamus', filter_label: 'Hypothalamus' },
  { filter_value: 'kidney', filter_label: 'Kidney' },
  { filter_value: 'liver', filter_label: 'Liver' },
  { filter_value: 'lung', filter_label: 'Lung' },
  { filter_value: 'ovaries', filter_label: 'Ovaries' },
  { filter_value: 'plasma', filter_label: 'Plasma' },
  { filter_value: 'small intestine', filter_label: 'Small Intestine' },
  { filter_value: 'spleen', filter_label: 'Spleen' },
  { filter_value: 'testes', filter_label: 'Testes' },
  { filter_value: 'vastus lateralis', filter_label: 'Vastus Lateralis' },
  { filter_value: 'white adipose', filter_label: 'White Adipose' },
];

const assays = [
  { filter_value: 'transcript-rna-seq', filter_label: 'RNA-seq' },
  { filter_value: 'epigen-atac-seq', filter_label: 'ATAC-seq' },
  { filter_value: 'epigen-rrbs', filter_label: 'RRBS' },
  { filter_value: 'immunoassay', filter_label: 'Immunoassay' },
  { filter_value: 'metab-t-acoa', filter_label: 'Targeted Acyl-CoA' },
  { filter_value: 'metab-t-amines', filter_label: 'Targeted Amines' },
  { filter_value: 'metab-t-etamidpos', filter_label: 'Targeted Ethanolamides' },
  { filter_value: 'metab-t-ka', filter_label: 'Targeted Keto Acids' },
  { filter_value: 'metab-t-nuc', filter_label: 'Targeted Nucleotides' },
  { filter_value: 'metab-t-oxylipneg', filter_label: 'Targeted Oxylipins' },
  {
    filter_value: 'metab-t-tca',
    filter_label: 'Targeted Tricarboxylic Acid Cycle',
  },
  {
    filter_value: 'metab-u-hilicpos',
    filter_label: 'Untargeted HILIC-Positive',
  },
  {
    filter_value: 'metab-u-ionpneg',
    filter_label: 'Untargeted Ion-Pair Negative',
  },
  {
    filter_value: 'metab-u-lrpneg',
    filter_label: 'Untargeted Lipidomics Reversed-Phase Negative',
  },
  {
    filter_value: 'metab-u-lrppos',
    filter_label: 'Untargeted Lipidomics Reversed-Phase Positive',
  },
  {
    filter_value: 'metab-u-rpneg',
    filter_label: 'Untargeted Reversed-Phase Negative',
  },
  {
    filter_value: 'metab-u-rppos',
    filter_label: 'Untargeted Reversed-Phase Positive',
  },
  { filter_value: 'prot-pr', filter_label: 'Global Proteomics' },
  { filter_value: 'prot-ph', filter_label: 'Phosphoproteomics' },
  { filter_value: 'prot-ac', filter_label: 'Acetyl Proteomics' },
  { filter_value: 'prot-ub', filter_label: 'Protein Ubiquitination' },
];

export const assayList = assays.sort((a, b) =>
  a.filter_label.toLowerCase().localeCompare(b.filter_label.toLowerCase())
);

export const sexList = [
  { filter_value: 'Male', filter_label: 'Male' },
  { filter_value: 'Female', filter_label: 'Female' },
];

export const timepointList = [
  { filter_value: '1w', filter_label: '1 week' },
  { filter_value: '2w', filter_label: '2 week' },
  { filter_value: '4w', filter_label: '4 week' },
  { filter_value: '8w', filter_label: '8 week' },
];

export const rangeList = [
  { filter_value: null, filter_label: 'Min' },
  { filter_value: null, filter_label: 'Max' },
];

export const commonSearchFilters = [
  {
    keyName: 'tissue',
    name: 'Tissue',
    filters: tissueList,
  },
  {
    keyName: 'assay',
    name: 'Assay',
    filters: assayList,
  },
  {
    keyName: 'sex',
    name: 'Sex',
    filters: sexList,
  },
  {
    keyName: 'comparison_group',
    name: 'Timepoint',
    filters: timepointList,
  },
];

export const rangeSearchFilters = [
  {
    keyName: 'logFC',
    name: 'logFC',
    filters: rangeList,
  },
  {
    keyName: 'p_value',
    name: 'P-value',
    filters: rangeList,
  },
  {
    keyName: 'adj_p_value',
    name: 'Adj P-value',
    filters: rangeList,
  },
];
