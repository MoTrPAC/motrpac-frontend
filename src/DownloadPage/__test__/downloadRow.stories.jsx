import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DownloadRow from '../components/downloadRow';

const testAllUploads = require('../testData/testAllUploads');

const downloadActions = {
  onCartClick: action('OnCartClick'),
};
const defaultRowState = {
  upload: testAllUploads[0],
  inCart: false,
  siteName: 'Stanford CAS',
};

const pendingUpload = {
  ...defaultRowState.upload,
  availability: 'Pending Q.C.',
  site: 'Stanford CAS',
};
const pendingUnavailableUpload = {
  ...defaultRowState.upload,
  availability: 'Pending Q.C.',
  site: 'Not Stanford CAS',
};
const internalUpload = {
  ...defaultRowState.upload,
  availability: 'Internally Available',
  site: 'Stanford CAS',
};
const publicUpload = {
  ...defaultRowState.upload,
  availability: 'Publicly Available',
  site: 'Stanford CAS',
};

storiesOf('Download Row', module)
  .addDecorator(story => (
    <div className="downloadTable">{story()}</div>
  ))
  .add('Publically Available Upload', () => (
    <DownloadRow
      {...defaultRowState}
      {...downloadActions}
      upload={publicUpload}
    />
  ))
  .add('In Cart', () => (
    <DownloadRow
      {...defaultRowState}
      {...downloadActions}
      upload={publicUpload}
      inCart
    />
  ))
  .add('Internally Available Upload', () => (
    <DownloadRow
      {...defaultRowState}
      {...downloadActions}
      upload={internalUpload}
    />
  ))
  .add('Pending Q.C. Available Upload', () => (
    <DownloadRow
      {...defaultRowState}
      {...downloadActions}
      upload={pendingUpload}
    />
  ))
  .add('Unavailable Upload', () => (
    <DownloadRow
      {...defaultRowState}
      {...downloadActions}
      upload={pendingUnavailableUpload}
    />
  ));
