const assays = [
  'WGS',
  'RNA-seq (PolyA)',
  'RNA-seq (all)',
  'miRNA-seq',
  'RRBS',
  'Methyl-seq',
  'ATAC-seq',
  'Untargeted RP',
  'Untargeted HILIC-positive',
  'Untargeted HILIC-negative',
  'Untargeted Lipidomics',
  'Targeted Acyl-CoA',
  'Targeted Acylcarnitines',
  'Targeted Ketoacids',
  'Targeted Organic Acids',
  'Targeted Eicosanoids',
  'Targeted Nucleotides',
  'Targeted Ceramides',
  'Targeted Oxylipins',
  'Targeted Amines',
  'Targeted Steroids',
  'TCA Cycle',
  'Global Proteomics',
  'Global Phospho-proteomics',
  'Redox proteome',
  'Acyl/Acetyl proteome',
  'SomaLogic',
];

const assayList = assays.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export default assayList;
