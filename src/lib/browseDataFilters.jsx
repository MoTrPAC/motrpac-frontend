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

// `tissue_name`, `omics` and `assay` options are derived at render time from the
// files actually loaded (see browseDataFilter.jsx), so the values here are
// placeholders and are always replaced. They are empty arrays rather than the
// `tissues` lookup object that used to sit here: an object reaching the render
// path crashed it on `filters.map`.
//
// There is no Genome Assembly facet, and no Category/Metadata facet either. A
// collection has exactly one reference genome and exactly one category -- the
// family in its object path decides both -- so filtering by either within a
// collection matches everything or nothing. CollectionFilterModule expresses
// both: each option names its kind (Quant-ID / Analysis / Phenotype) and its
// genome.
const browseDataFilters = [
  {
    keyName: 'tissue_name',
    name: 'Tissue',
    filters: [],
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
];

export default browseDataFilters;
