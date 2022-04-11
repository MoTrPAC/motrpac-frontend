import assayList from './assayList';

const tissues = [
  'Adrenal',
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
  'Ovary',
  'Plasma',
  'Small Intestine',
  'Spleen',
  'Testis',
  'Vastus Lateralis',
  'Vena Cava',
  'White Adipose',
  'Whole Blood',
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
    keyName: 'assay',
    name: 'Assay',
    filters: assayList,
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
    keyName: 'category',
    name: 'Category',
    filters: ['Analysis', 'Results'],
  },
];

export default browseDataFilters;
