import React from 'react';
import { storiesOf } from '@storybook/react';
import SearchResultFilters from '../searchResultFilters';

import stanfordPass1aRNAseqMetadata from '../../data/stanford_pass1a_get_rna_seq_metadata';

// FIXME: Temp workaround to mock indexed search results
const searchResutls = [];
stanfordPass1aRNAseqMetadata.forEach((entry) => {
  if (entry.Tissue.match(/liver/i) && entry.GET_site.match(/stanford/i)) {
    const newEntry = { item: entry };
    searchResutls.push(newEntry);
  }
});

storiesOf('Search Result Filters', module)
  // Padding added to indicate it is a component
  .addDecorator((story) => (
    <div className="searchPage container-fluid">
      <div className="d-flex search-results-container">
        <div className="col-12 col-md-3 search-result-filters-container">
          {story()}
        </div>
      </div>
    </div>
  ))
  .add('Default', () => <SearchResultFilters results={searchResutls} />);
