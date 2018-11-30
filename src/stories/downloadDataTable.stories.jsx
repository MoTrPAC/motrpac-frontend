import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DownloadDataTable from '../components/downloadDataTable';

const testPreviousUploads = require('../testData/testPreviousUploads');

const downloadActions = {
  onDownload: action('on Download'),
  onChangeSort: action('on Change Sort'),
};

storiesOf('Download Data Table', module)
  .addDecorator(story => <div className="row">{story()}</div>)
  .add('default', () => <DownloadDataTable allUploads={[]} {...downloadActions} />)
  .add('With Data', () => <DownloadDataTable allUploads={testPreviousUploads} {...downloadActions} />)
