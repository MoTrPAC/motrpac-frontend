import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import UploadScreen from '../components/uploadScreen';
import UploadReducer from '../reducers';
import '../main.css';

const TestUploads = require('../testData/testUploads');

// Commented out since no longer need to test staged files in this screen
// const TestFiles = TestUploads.map(upload => upload.file);
const defaultState = {
  dragging: 0,
  files: [],
  formValues: {},
  uploadFiles: [],
};
const DefaultStore = createStore(UploadReducer, defaultState);
const FilledStore = createStore(UploadReducer,
  {
    ...defaultState,
    uploadFiles: TestUploads,
    files: [],
    formValues: {
      identifier: 'AS12313',
      studyPhase: '2',
      subjectType: 'Animal',
      collectionDate: '10/23/18',
      dataType: 'ATAC-Seq',
    },
  });

// Provider necessary to link data from components of UploadScreen
storiesOf('Upload Screen', module)
  .addDecorator(story => <div className="upload-component container" style={{ padding: '1em' }}>{story()}</div>)
  .add('Default', () => (
    <Provider store={DefaultStore}>
      <UploadScreen />
    </Provider>
  ))
  .add('Files Uploaded, form filled', () => (
    <Provider store={FilledStore}>
      <UploadScreen />
    </Provider>
  ));
