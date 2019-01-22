import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import UploadForm from '../uploadForm';
import { defaultUploadState } from '../uploadReducer';

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
    collectionDate: '',
    subjectType: 'Animal',
    studyPhase: '1A',
    rawData: true,
    processedData: false,
  },
};
const humanFilledState = {
  ...defaultUploadState,
  formValues:
  {
    ...defaultUploadState.formValues,
    subjectType: 'Human',
  },
};
const actions = {
  handleSubmit: action('onHandleSubmit'),
  handleFormChange: action('onFormChange'),
};
storiesOf('Upload Form', module)
  .addDecorator(story => <div className="upload-component" style={{ padding: '3rem' }}>{story()}</div>)
  .add('Empty Form - Animal', () => <UploadForm {...actions} />)
  .add('Empty Form - Human', () => <UploadForm {...humanFilledState} {...actions} />)
  .add('Unfilled Error', () => <UploadForm {...validState} {...actions} />)
  .add('Submitted', () => <UploadForm {...submittedState} {...actions} />);
