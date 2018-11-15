import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { defaultUploadState } from '../../reducers/uploadReducer';
import rootReducer, { defaultRootState } from '../../reducers/index';
import UploadScreenConnected, { UploadScreen } from '../../components/uploadScreen';

Enzyme.configure({ adapter: new Adapter() });
const screenActions = {
  onDragEnter: jest.fn(),
  onDragLeave: jest.fn(),
  onDragDrop: jest.fn(),
  onFileAdded: jest.fn(),
  onRemoveFile: jest.fn(),
  onFormSubmit: jest.fn(),
  cancelUpload: jest.fn(),
};

describe('Pure Upload Screen', () => {
  test('Renders required componenents', () => {
    const shallowScreen = shallow(
      <UploadScreen {...defaultUploadState} loggedIn {...screenActions} />,
    );
    expect(shallowScreen.find('UploadAreaDnD')).toHaveLength(1);
    expect(shallowScreen.find('UploadList')).toHaveLength(1);
    expect(shallowScreen.find('UploadForm')).toHaveLength(1);
  });
});

const loggedInRootState = {
  auth: {
    ...defaultRootState.auth,
    loggedIn: true,
  },
  upload: defaultUploadState,
};

const testFiles = require('../../testData/testFiles');
const testUploads = require('../../testData/testUploads');

describe('Connected Upload Screen', () => {
  let mountedUploadScreen = mount((
    <Provider store={createStore(rootReducer, loggedInRootState)}>
      <UploadScreenConnected />
    </Provider>
  ));
  beforeAll(() => {
    mountedUploadScreen = mount((
      <Provider store={createStore(rootReducer, loggedInRootState)}>
        <UploadScreenConnected />
      </Provider>
    ));
  });
  afterAll(() => {
    mountedUploadScreen.unmount();
  });

  test('Renders Required Components', () => {
    expect(mountedUploadScreen.find('UploadAreaDnD')).toHaveLength(1);
    expect(mountedUploadScreen.find('UploadList')).toHaveLength(1);
    expect(mountedUploadScreen.find('UploadForm')).toHaveLength(1);
  });
  const addFileAction = {
    type: 'FILES_ADDED',
    files: testFiles,
  };
  test('Added files do not move to upload area on upload button click if form not valid', () => {
    mountedUploadScreen.find('Provider').props().store.dispatch(addFileAction);
    mountedUploadScreen.find('#submit-form').simulate('click');
    expect(mountedUploadScreen.find('.noListItems')).toHaveLength(1);
  });
});
