import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import UploadListRow from '../uploadListRow';

const uploadItemActions = {
  cancelUpload: action('Cancel Upload'),
};
const testUploads = require('../../testData/testUploads');

storiesOf('Upload List Items', module)
  .addDecorator(story => (
    <table className="upload-component table table-hover uploadList">
      <thead>
        <tr>
          <th scope="col">File Name</th>
          <th scope="col">Status</th>
          <th className="centered" scope="col">Upload Successful</th>
          <th className="centered" scope="col">Cancel Upload</th>
        </tr>
      </thead>
      <tbody>
        {story()}
      </tbody>
    </table>))
  .add('Successful Upload', () => <UploadListRow uploadItem={testUploads[2]} {...uploadItemActions} />)
  .add('Uploading', () => <UploadListRow uploadItem={testUploads[0]} {...uploadItemActions} />)
  .add('Failed', () => <UploadListRow uploadItem={testUploads[1]} {...uploadItemActions} />)
  .add('Unknown Status', () => <UploadListRow uploadItem={testUploads[3]} {...uploadItemActions} />);
