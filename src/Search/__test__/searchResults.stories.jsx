import React from 'react';
import SearchResults from '../searchResults';

import stanfordPass1aRNAseqMetadata from '../../data/stanford_pass1a_get_rna_seq_metadata';

const urlSearchParamsObj = {
  action: 'sample',
  tissue: 'liver',
  phase: '1A',
  study: 'GET',
  experiment: 'RNA-seq',
  site: 'Stanford',
};

const params = [
  { term: 'biospecimenid', value: '901', operator: '' },
  { term: 'tissue', value: 'liver', operator: 'AND' },
  { term: 'site', value: 'stanford', operator: 'AND' },
];

// FIXME: Temp workaround to mock indexed search results
const searchResutls = [];
stanfordPass1aRNAseqMetadata.forEach((entry) => {
  if (entry.Tissue.match(/liver/i) && entry.GET_site.match(/stanford/i)) {
    const newEntry = { item: entry };
    searchResutls.push(newEntry);
  }
});

export default {
  title: 'Search Results',

  decorators: [
    (story) => (
      <div className="searchPage container-fluid">
        <div className="advanced-search-form-container">{story()}</div>
      </div>
    ),
  ],
};

export const ShowAdvancedSearchResults = {
  render: () => (
    <SearchResults advSearchParams={params} lunrResutls={searchResutls} />
  ),

  name: 'Show advanced search results',
};

export const ShowSampleResultsTable = {
  render: () => (
    <SearchResults
      urlSearchParamsObj={urlSearchParamsObj}
      advSearchParams={params}
    />
  ),

  name: 'Show sample results table',
};
