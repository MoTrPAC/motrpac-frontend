import React from 'react';
import { storiesOf, action } from '@storybook/react';
import { UploadScreen } from '../components/uploadScreen';
import Navbar from '../components/navbar';
import { Footer } from '../components/footer';

const TestUploads = require('../testData/testUploads');

// Commented out since no longer need to test staged files in this screen
// const TestFiles = TestUploads.map(upload => upload.file);
const defaultState = {
  dragging: 0,
  files: [],
  formValues: {},
  uploadFiles: [],
  loggedIn: true,
};

const filledState = {
  ...defaultState,
  uploadFiles: TestUploads,
  submitted: true,
  formValues: {
    identifier: 'AS12313',
    studyPhase: '2',
    subjectType: 'Animal',
    collectionDate: '10/23/18',
    dataType: 'ATAC-Seq',
    rawData: true,
  },
};

const actions = {
  onDragEnter: action('onDragEnter'),
  onDragLeave: action('onDragLeave'),
  onDragDrop: action('onDragDrop'),
  onUpload: action('onUpload'),
  onFileAdded: action('onFileAdded'),
  onRemoveFile: action('onRemoveFile'),
  onFormSubmit: action('onFormSubmit'),
};
const footerActions = {
  onLogIn: action('logging in'),
  onLogOut: action('logging out'),
};

// Provider necessary to link data from components of UploadScreen
storiesOf('Upload Screen', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar />
      </header>
      <div className="componentHolder">
        {story()}
      </div>
      <Footer loggedIn {...footerActions} user={{ name: 'Test User', site: 'CAS' }} />
    </div>

  ))
  .add('Default', () => (
    <UploadScreen {...defaultState} {...actions} />
  ))
  .add('Files Uploaded, form filled', () => (
    <UploadScreen {...filledState} {...actions} />
  ));
