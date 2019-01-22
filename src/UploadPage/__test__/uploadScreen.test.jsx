import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleWare from 'redux-thunk';
import { defaultUploadState } from '../uploadReducer';
import rootReducer, { defaultRootState } from '../../App/reducers';
import UploadScreenConnected, { UploadScreen } from '../uploadScreen';

Enzyme.configure({ adapter: new Adapter() });

const testFiles = require('../../testData/testFiles');
const testUploads = require('../../testData/testUploads');

const formFilledState = {
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
  },
  upload: {
    ...defaultUploadState,
    formValues: {
      dataType: 'ATAC-Seq',
      biospecimenID: '1',
      collectionDate: '10/21/18',
      subjectType: 'Animal',
      studyPhase: '1',
      descript: 'description',
      rawData: true,
      processedData: false,
    },
  },
};

const uploadingState = {
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
  },
  upload: {
    ...defaultUploadState,
    uploadFiles: testUploads,
  },
};

const screenActions = {
  onDragEnter: jest.fn(),
  onDragLeave: jest.fn(),
  onDragDrop: jest.fn(),
  onFileAdded: jest.fn(),
  onRemoveFile: jest.fn(),
  onFormSubmit: jest.fn(),
  handleFormChange: jest.fn(),
  cancelUpload: jest.fn(),
  clearForm: jest.fn(),
};

describe('Pure Upload Screen', () => {
  test('Renders required componenents', () => {
    const shallowScreen = shallow(
      <UploadScreen {...defaultUploadState} isAuthenticated {...screenActions} />,
    );
    expect(shallowScreen.find('UploadAreaDnD')).toHaveLength(1);
    expect(shallowScreen.find('UploadList')).toHaveLength(1);
    expect(shallowScreen.find('UploadForm')).toHaveLength(1);
  });
});

const loggedInRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
  },
};


describe('Connected Upload Screen', () => {
  let mountedUploadScreen = mount((
    <Provider store={createStore(rootReducer, loggedInRootState, applyMiddleware(thunkMiddleWare))}>
      <UploadScreenConnected />
    </Provider>
  ));
  beforeAll(() => {
    mountedUploadScreen = mount((
      <Provider store={createStore(rootReducer, loggedInRootState, applyMiddleware(thunkMiddleWare))}>
        <UploadScreenConnected />
      </Provider>
    ));
  });
  afterAll(() => {
    mountedUploadScreen.unmount();
  });

  test('Renders Required Components in correct state', () => {
    expect(mountedUploadScreen.find('UploadAreaDnD')).toHaveLength(1);
    expect(mountedUploadScreen.find('UploadList')).toHaveLength(1);
    expect(mountedUploadScreen.find('UploadForm')).toHaveLength(1);
    expect(mountedUploadScreen.find('.uploadBtn')).toHaveLength(1);
    expect(mountedUploadScreen.find('.clearFormBtn')).toHaveLength(1);
    expect(mountedUploadScreen.find('UploadForm').find('select').forEach((formComponent) => {
      expect(formComponent.prop('disabled')).toBeFalsy();
    }));
    expect(mountedUploadScreen.find('UploadForm').find('input').forEach((formComponent) => {
      expect(formComponent.prop('disabled')).toBeFalsy();
    }));
  });
  const addFileAction = {
    type: 'FILES_ADDED',
    files: testFiles,
  };
  test('Added files do not move to upload area on form submit if form not valid', () => {
    mountedUploadScreen.find('Provider').props().store.dispatch(addFileAction);
    mountedUploadScreen.find('form').simulate('submit');
    mountedUploadScreen.update();
    expect(mountedUploadScreen.find('.noListItems')).toHaveLength(1);
  });
  test('Added files do move to upload area with valid form', () => {
    mountedUploadScreen = mount((
      <Provider store={createStore(rootReducer, formFilledState, applyMiddleware(thunkMiddleWare))}>
        <UploadScreenConnected />
      </Provider>
    ));
    mountedUploadScreen.find('Provider').props().store.dispatch(addFileAction);
    mountedUploadScreen.find('form').simulate('submit');
    mountedUploadScreen.update();

    // Checking redux state
    expect(mountedUploadScreen.find('Provider').props().store.getState().upload.submitted).toBeTruthy();
    expect(mountedUploadScreen.find('Provider').props().store.getState().upload.stagedFiles).toHaveLength(0);
    expect(mountedUploadScreen.find('Provider').props().store.getState().upload.uploadFiles).toHaveLength(testFiles.length);

    // Checking rendered components
    expect(mountedUploadScreen.find('UploadListRow')).toHaveLength(testFiles.length);
    expect(mountedUploadScreen.find('.noListItems')).toHaveLength(0);

    // Check that form inputs disabled
    expect(mountedUploadScreen.find('UploadForm').find('select').forEach((formComponent) => {
      expect(formComponent.prop('disabled')).toBeTruthy();
    }));
    expect(mountedUploadScreen.find('UploadForm').find('input').forEach((formComponent) => {
      if (formComponent.prop('type') !== 'submit') {
        expect(formComponent.prop('disabled')).toBeTruthy();
      }
    }));
  });
  test('Canceling uploading file removes it', () => {
    mountedUploadScreen = mount((
      <Provider store={createStore(rootReducer, uploadingState, applyMiddleware(thunkMiddleWare))}>
        <UploadScreenConnected />
      </Provider>
    ));
    expect(mountedUploadScreen.find('UploadListRow')).toHaveLength(testUploads.length);
    mountedUploadScreen.find('UploadListRow').first().find('.cancelUploadConfirm').simulate('click');
    mountedUploadScreen.update();
    expect(mountedUploadScreen.find('UploadListRow')).toHaveLength(testUploads.length - 1);
  });

  test('Clear Form, makes form empty and available to enter again', () => {
    mountedUploadScreen = mount((
      <Provider store={createStore(rootReducer, formFilledState, applyMiddleware(thunkMiddleWare))}>
        <UploadScreenConnected />
      </Provider>
    ));

    mountedUploadScreen.find('.clearFormBtn').simulate('click');
    mountedUploadScreen.update();

    expect(mountedUploadScreen.find('UploadForm').find('select').forEach((formComponent) => {
      expect(formComponent.prop('disabled')).toBeFalsy();
      expect(formComponent.prop('value')).toEqual(defaultUploadState.formValues[formComponent.prop('id')]);
    }));
    expect(mountedUploadScreen.find('UploadForm').find('input').forEach((formComponent) => {
      if (formComponent.prop('type') !== 'submit') {
        expect(formComponent.prop('disabled')).toBeFalsy();
        if (formComponent.prop('type') === 'text') {
          expect(formComponent.prop('value')).toEqual(defaultUploadState.formValues[formComponent.prop('id')]);
        }
        if (formComponent.prop('type') === 'checkbox') {
          expect(formComponent.prop('checked')).toEqual(defaultUploadState.formValues[formComponent.prop('id')]);
        }
      }
    }));
  });
});
