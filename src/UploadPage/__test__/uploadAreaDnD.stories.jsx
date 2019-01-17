import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import UploadAreaDnD from '../uploadAreaDnD';

const testFiles = require('../../testData/testFiles');

const actions = {
  handleSubmit: action('onHandleSubmit'),
  handleFileUpload: action('onHandleFileUpload'),
  dragEnter: action('Drag Entered'),
  dragLeave: action('Drag Leaving'),
  dragDrop: action('Dropped Items'),
};

const defaultState = {
};

const draggingState = {
  dragging: 1,
};
const fewFilesState = {
  files: testFiles.slice(0, 3),
};
const overflowFilesState = {
  files: testFiles,
};

// Same files added twice to ensure that duplicates caught

storiesOf('Drag and Drop Upload File Area ', module)
  .addDecorator(story => <div className="upload-component" style={{ padding: '3rem' }}>{story()}</div>)
  .add('No Files Added', () => <UploadAreaDnD {...defaultState} {...actions} />)
  .add('3 Files Added', () => <UploadAreaDnD {...fewFilesState} {...actions} />)
  .add('Overflow Files', () => <UploadAreaDnD {...overflowFilesState} {...actions} />)
  .add('Active Dragging', () => <UploadAreaDnD {...draggingState} {...actions} />);
