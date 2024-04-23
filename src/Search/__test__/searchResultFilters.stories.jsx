import React from 'react';
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

export default {
  title: 'Search Result Filters',

  decorators: [
    (story) => (
      <div className="searchPage container-fluid">
        <div className="d-flex search-results-container">
          <div className="col-12 col-md-3 search-result-filters-container">
            {story()}
          </div>
        </div>
      </div>
    ),
  ],
};

export const Default = () => <SearchResultFilters results={searchResutls} />;
