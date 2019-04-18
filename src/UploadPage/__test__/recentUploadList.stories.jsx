import React from 'react';
import { storiesOf } from '@storybook/react';
import RecentUploadList from '../recentUploadList';

const testPreviousUploads = require('../../testData/testPreviousUploads');

storiesOf('Recent Upload Activity', module)
  // Padding added to indicate it is a component
  .addDecorator(story => <div className="upload-component" style={{ padding: '3rem' }}>{story()}</div>)
  .add('No Upload Activity', () => <RecentUploadList />)
  .add('Filled Upload Activities', () => <RecentUploadList previousUploads={testPreviousUploads} />);
