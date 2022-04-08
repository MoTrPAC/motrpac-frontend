import assayList from './assayList';
import tissueList from './tissueList';

const browseDataFilters = [
  {
    keyName: 'tissue',
    name: 'Tissue',
    filters: tissueList.map((obj) => obj.name),
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
      'Metabolomics-targted',
      'Metabolomics-untargted',
      'Proteomics-targeted',
      'Proteomics-untargeted',
      'Transcriptomics',
    ],
  },
  {
    keyName: 'category',
    name: 'Category',
    filters: ['Analysis', 'Quantitative Results'],
  },
];

export default browseDataFilters;
