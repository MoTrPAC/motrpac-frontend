import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import UploadForm from '../uploadForm';

const validState = {
  files: [],
  validated: true,
};
const submittedState = {
  files: [],
  validated: true,
  submitted: true,
  formValues: {
    dataType: 'ATAC-Seq',
    identifier: '100010208',
    collectionDate: '10/21/18',
    subjectType: 'Human',
    studyPhase: 'Vanguard',
    rawData: true,
    processedData: false,
  },
};
const actions = {
  handleSubmit: action('onHandleSubmit'),
  handleFormChange: action('onFormChange'),
};
storiesOf('Upload Form', module)
  .addDecorator(story => <div className="upload-component" style={{ padding: '3rem' }}>{story()}</div>)
  .add('Empty Form', () => <UploadForm {...actions} />)
  .add('Unfilled Error', () => <UploadForm {...validState} {...actions} />)
  .add('Submitted', () => <UploadForm {...submittedState} {...actions} />);
