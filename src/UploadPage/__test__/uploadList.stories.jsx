import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import UploadList from '../uploadList';

const uploadListActions = {
  cancelUpload: action('Cancel Upload'),
};
const testUploads = require('../../testData/testUploads');

storiesOf('Upload List', module)
  // Padding added to indicate it is a component
  .addDecorator(story => <div className="upload-component" style={{ padding: '3rem' }}>{story()}</div>)
  .add('Empty List', () => <UploadList {...uploadListActions} />)
  .add('Filled Test List', () => <UploadList uploadFiles={testUploads} {...uploadListActions} />);
