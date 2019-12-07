import React from 'react';
import { storiesOf } from '@storybook/react';
import SearchResults from '../searchResults';

const stanfordPass1aRNAseqMetadata = require('../../data/stanford_pass1a_get_rna_seq_metadata');

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

storiesOf('Search Results', module)
  // Padding added to indicate it is a component
  .addDecorator((story) => (
    <div className="searchPage container-fluid">
      <div className="advanced-search-form-container">
        {story()}
      </div>
    </div>
  ))
  .add('Show advanced search results', () => <SearchResults advSearchParams={params} lunrResutls={searchResutls} />)
  .add('Show sample results table', () => <SearchResults urlSearchParamsObj={urlSearchParamsObj} advSearchParams={params} />);
