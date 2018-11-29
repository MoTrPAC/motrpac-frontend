import React from 'react';
import { storiesOf } from '@storybook/react';
import { DownloadDataTable } from '../components/downloadDataTable';

const testPreviousUploads = require('../testData/testPreviousUploads');

storiesOf('Download Data Table', module)
  .add('default', () => <DownloadDataTable allUploads={testPreviousUploads} />);
