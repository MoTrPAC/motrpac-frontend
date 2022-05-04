const assays = [
  'RNA-seq',
  'RRBS',
  'ATAC-seq',
  'Immunoassay',
  'Targeted Acyl-CoA',
  'Targeted Amines',
  'Targeted Ethanolamides',
  'Targeted Keto Acids',
  'Targeted Nucleotides',
  'Targeted Oxylipins',
  'Targeted Tricarboxylic Acid Cycle',
  'Untargeted HILIC-Positive',
  'Untargeted Ion-Pair Negative',
  'Untargeted Lipidomics Reversed-Phase Negative',
  'Untargeted Lipidomics Reversed-Phase Positive',
  'Untargeted Reversed-Phase Negative',
  'Untargeted Reversed-Phase Positive',
  'Global Proteomics',
  'Phosphoproteomics',
  'Acetyl Proteomics',
  'Protein Ubiquitination',
];

const assayList = assays.sort((a, b) =>
  a.toLowerCase().localeCompare(b.toLowerCase())
);

export default assayList;
