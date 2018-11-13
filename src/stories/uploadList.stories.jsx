import React from 'react';
import { storiesOf } from '@storybook/react';
import UploadList from '../components/uploadList';

const testUploads = require('../testData/testUploads');

storiesOf('Upload List', module)
  // Padding added to indicate it is a component
  .addDecorator(story => <div className="upload-component" style={{ padding: '3rem' }}>{story()}</div>)
  .add('Empty List', () => <UploadList />)
  .add('Filled Test List', () => <UploadList uploadFiles={testUploads} />);
