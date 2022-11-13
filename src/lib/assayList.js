const assays = [
  'RNA-seq',
  'RRBS',
  'ATAC-seq',
  'Immunoassay',
  'Targeted 3-Hydroxyisobutyric Acid (3-HIB)',
  'Targeted Acyl-CoA',
  'Targeted Acylcarnitines',
  'Targeted Amines',
  'Targeted Amino Acids',
  'Targeted Beta-Aminoisobutyric Acid',
  'Targeted Ceramide',
  'Targeted Conventional',
  'Targeted Ethanolamides',
  'Targeted Keto Acids',
  'Targeted Nucleotides',
  'Targeted Organic Acids',
  'Targeted Oxylipins',
  'Targeted Sphingomyelin',
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
