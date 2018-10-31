import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import UploadForm from '../components/uploadForm';

const validState = {
  files: [],
  validated: true,
};
const actions = {
  handleSubmit: action('onHandleSubmit'),
};
storiesOf('Upload Form', module)
  .addDecorator(story => <div className="upload-component" style={{ padding: '3rem' }}>{story()}</div>)
  .add('Empty Form', () => <UploadForm {...actions} />)
  .add('Unfilled Error', () => <UploadForm {...validState} {...actions} />);
