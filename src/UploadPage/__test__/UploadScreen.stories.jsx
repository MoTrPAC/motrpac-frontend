import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { UploadScreen } from '../uploadScreen';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';
import { Sidebar } from '../../Sidebar/sidebar';

const testUser = require('../../testData/testUser');
const TestUploads = require('../../testData/testUploads');

// Commented out since no longer need to test staged files in this screen
// const TestFiles = TestUploads.map(upload => upload.file);
const defaultState = {
  dragging: 0,
  stagedFiles: [],
  formValues: {},
  uploadFiles: [],
  isAuthenticated: true,
};

const filledState = {
  ...defaultState,
  uploadFiles: TestUploads,
  submitted: true,
  formValues: {
    biospecimenBarcode: '1000112313',
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
  cancelUpload: action('cancelUpload'),
  handleFormChange: action('onFormChange'),
};

const navbarAction = {
  logout: action('logging out'),
};

const footerAction = {
  login: action('logging in'),
};

// Provider necessary to link data from components of UploadScreen
storiesOf('Upload Screen', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar isAuthenticated {...navbarAction} profile={testUser} />
      </header>
      <div className="componentHolder">
        <div className="container-fluid">
          <div className="row">
            <Sidebar isAuthenticated />
            {story()}
          </div>
        </div>
      </div>
      <Footer isAuthenticated {...footerAction} profile={testUser} />
    </div>

  ))
  .add('Default', () => (
    <UploadScreen {...defaultState} {...actions} />
  ))
  .add('Validated', () => (
    <UploadScreen validated {...defaultState} {...actions} />
  ))
  .add('Files Uploaded, form filled', () => (
    <UploadScreen {...filledState} {...actions} />
  ));
