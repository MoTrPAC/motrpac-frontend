import React from 'react';
import SampleSearchResultTable from '../sampleSearchResultTable';

const urlSearchParamsObj = {
  action: 'sample',
  tissue: 'heart',
  phase: '1A',
  study: 'GET',
  experiment: 'RNA-seq',
  site: 'MSSM',
};

export default {
  title: 'Sample Results Table',

  decorators: [
    (story) => (
      <div className="searchPage container-fluid">
        <div className="advanced-search-form-container">{story()}</div>
      </div>
    ),
  ],
};

export const Default = () => (
  <SampleSearchResultTable params={urlSearchParamsObj} />
);
