import React from 'react';
import { storiesOf } from '@storybook/react';
import UploadListRow from '../components/uploadListRow';

const testUploads = require('../testData/testUploads');

storiesOf('Upload List Items', module)
  .addDecorator(story => (
    <table className="upload-component table table-hover uploadList">
      <thead>
        <tr>
          <th scope="col">File Name</th>
          <th scope="col">Status</th>
          <th className="centered" scope="col">Upload Successful</th>
        </tr>
      </thead>
      <tbody>
        {story()}
      </tbody>
    </table>))
  .add('Successful Upload', () => <UploadListRow uploadItem={testUploads[2]} />)
  .add('Uploading', () => <UploadListRow uploadItem={testUploads[0]} />)
  .add('Failed', () => <UploadListRow uploadItem={testUploads[1]} />)
  .add('Unknown Status', () => <UploadListRow uploadItem={testUploads[3]} />);
