import assayList from './assayList';

export const tissues = {
  pass1b_06: [
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
    'Vena Cava',
    'White Adipose',
  ],
  pass1a_06: [
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
    'Tibia',
    'Vastus Lateralis',
    'White Adipose',
  ],
  human_sed_adu: ['Adipose', 'Blood', 'Muscle', 'Plasma'],
};

export const omes = {
  pass1b_06: [
    'Epigenomics',
    'Metabolomics Targeted',
    'Metabolomics Untargeted',
    'Proteomics Targeted',
    'Proteomics Untargeted',
    'Transcriptomics',
  ],
  pass1a_06: [
    'Epigenomics',
    'Metabolomics Targeted',
    'Metabolomics Untargeted',
    'Proteomics Untargeted',
    'Transcriptomics',
  ],
  human_sed_adu: [
    'Epigenomics',
    'Metabolomics Targeted',
    'Metabolomics Untargeted',
    'Proteomics',
    'Transcriptomics',
  ],
};

export const referenceGenomes = {
  pass1b_06: ['RN6', 'RN7'],
  pass1a_06: [],
  human_sed_adu: [],
};

const browseDataFilters = [
  {
    keyName: 'reference_genome',
    name: 'Reference Genome',
    filters: referenceGenomes,
  },
  {
    keyName: 'tissue_name',
    name: 'Tissue',
    filters: tissues,
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
