import assayList from './assayList';

const tissues = [
  'Adrenal',
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

const tissueList = tissues.sort((a, b) =>
  a.toLowerCase().localeCompare(b.toLowerCase())
);

const browseDataFilters = [
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
    keyName: 'metadata',
    name: 'Metadata',
    filters: ['Phenotype'],
  },
];

export default browseDataFilters;
