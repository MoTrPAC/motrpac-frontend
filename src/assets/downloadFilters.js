import assayList from './assayList';

const downloadFilters = [
  {
    keyName: 'subject',
    name: 'Subject',
    filters: ['Animal', 'Human'],
  },
  {
    keyName: 'type',
    name: 'Assay Type',
    filters: assayList,
  },
];

export default downloadFilters;
