import React from 'react';
import { storiesOf } from '@storybook/react';
import PreviousUploadsGraph from '../previousUploadsGraph';
import { PreviousUploadsTable } from '../previousUploadsTable';
import AllUploadsDoughnut from '../allUploadsDoughnut';
import AllUploadStats from '../allUploadStats';

const previousUploads = require('../../testData/testPreviousUploads');
const allUploads = require('../../testData/testAllUploads');

const expandedUploads = previousUploads.map(upload => ({
  ...upload,
  expanded: true,
}));

storiesOf('Dashboard Widgets', module)
  .add('Previous Uploads Graph', () => <PreviousUploadsGraph previousUploads={previousUploads} />)
  .add('Previous Uploads Table', () => <PreviousUploadsTable previousUploads={previousUploads} />)
  .add('Previous Uploads Table Expanded', () => <PreviousUploadsTable previousUploads={expandedUploads} />)
  .add('All Uploads Doughnut', () => <AllUploadsDoughnut allUploads={allUploads} />)
  .add('General Stats', () => <AllUploadStats />);
