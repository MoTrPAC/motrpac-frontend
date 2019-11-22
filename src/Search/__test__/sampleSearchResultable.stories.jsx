import React from 'react';
import { storiesOf } from '@storybook/react';
import SampleSearchResultTable from '../sampleSearchResultTable';

const urlSearchParamsObj = {
  action: 'sample',
  tissue: 'heart',
  phase: '1A',
  study: 'GET',
  experiment: 'RNA-seq',
  site: 'MSSM',
};

storiesOf('Sample Results Table', module)
  // Padding added to indicate it is a component
  .addDecorator((story) => (
    <div className="searchPage container-fluid">
      <div className="advanced-search-form-container">
        {story()}
      </div>
    </div>
  ))
  .add('Default', () => <SampleSearchResultTable params={urlSearchParamsObj} />);
