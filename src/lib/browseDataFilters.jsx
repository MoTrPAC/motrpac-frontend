import assayList from './assayList';

const tissues = [
  'Adrenal',
  'Aorta',
  'Blood RNA',
  'Brown Adipose',
  'Colon',
  'Cortex',
  'Gastrocnemius',
  'Heart',
  'Hippocampus',
  'Hypothalamus',
  'Kidney',
  'Liver',
  'Lung',
  'Ovaries',
  'Plasma',
  'Small Intestine',
  'Spleen',
  'Testes',
  'Vastus Lateralis',
  'White Adipose',
];

export const tissueList = tissues.sort((a, b) =>
  a.toLowerCase().localeCompare(b.toLowerCase())
);

const browseDataFilters = [
  {
    keyName: 'study',
    name: 'Study',
    filters: ['Acute Exercise', 'Endurance Training'],
  },
  {
    keyName: 'tissue_name',
    name: 'Tissue',
    filters: tissueList,
  },
  {
    keyName: 'omics',
    name: 'Omics',
    filters: [
      'Epigenomics',
      'Metabolomics Targeted',
      'Metabolomics Untargeted',
      'Proteomics Targeted',
      'Proteomics Untargeted',
      'Transcriptomics',
    ],
  },
  {
    keyName: 'assay',
    name: 'Assay',
    filters: assayList,
  },
  {
    keyName: 'category',
    name: 'Category',
    filters: ['Analysis', 'Results'],
  },
  {
    keyName: 'category',
    name: 'Metadata',
    filters: ['Phenotype'],
  },
];

export default browseDataFilters;
