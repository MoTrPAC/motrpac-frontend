import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DownloadDataTable } from '../components/downloadDataTable';

const testPreviousUploads = require('../testData/testPreviousUploads');

const downloadActions = {
  onDownload: action('on Download'),
};

storiesOf('Download Data Table', module)
  .add('default', () => <DownloadDataTable allUploads={testPreviousUploads} {...downloadActions} />);
