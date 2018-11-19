import { UploadReducer, defaultUploadState } from '../../reducers/uploadReducer';

const testFiles = require('../../testData/testFiles');

describe('Upload Reducer', () => {
  test('Return initial state if no action or state', () => {
    expect(UploadReducer(undefined, {})).toEqual({ ...defaultUploadState });
  });

  test('Returns state given if no action', () => {
    expect(UploadReducer({ ...defaultUploadState, files: ['fileName.fileExt'] }, {})).toEqual({ ...defaultUploadState, files: ['fileName.fileExt'] });
  });

  const addFileAction = {
    type: 'FILES_ADDED',
    files: [testFiles[1], testFiles[1]],
  };
  const fileAddedState = {
    ...defaultUploadState,
    files: [testFiles[1]],
  };
  test('Does not add files if filename previously added', () => {
    expect(UploadReducer(fileAddedState, addFileAction))
      .toEqual(fileAddedState);
  });

  const formSubmitAction = {
    type: 'FORM_SUBMIT',
    validity: false,
    elements: {
      dataType: { value: '' },
      identifier: { value: '' },
      collectionDate: { value: '' },
      subjectType: { value: '' },
      studyPhase: { value: '' },
    },
  };

  test('Changes validated state to true on submitting invalid form', () => {
    expect(UploadReducer(undefined, formSubmitAction))
      .toEqual({
        ...defaultUploadState,
        validated: true,
      });
  });

  const removeFileAction = {
    type: 'REMOVE_FILE',
    name: testFiles[1].name,
  };

  it('Removed file is not in returned state', () => {
    expect(UploadReducer(fileAddedState, removeFileAction))
      .toEqual(defaultUploadState);
  });

  const testUploads = require('../../testData/testUploads');
  const cancelUploadAction = {
    type: 'CANCEL_UPLOAD',
    id: testUploads[0].id,
  };
  const uploadingState = {
    ...defaultUploadState,
    uploadFiles: testUploads,
  };
  const oneUploadRemovedState = {
    ...defaultUploadState,
    uploadFiles: testUploads.slice(1),
  };

  test('Removes uploading file from state on cancel upload', () => {
    expect(UploadReducer(uploadingState, cancelUploadAction)).toEqual(oneUploadRemovedState);
  });

  test('Updates text based form values after form change', () => {
    const formChangeAction = {
      type: 'FORM_CHANGE',
      eID: 'identifier',
      changeValue: '123123',
    };
    expect(UploadReducer(defaultUploadState, formChangeAction).formValues.identifier)
      .toEqual(formChangeAction.changeValue);
  });

  test('Updates boolean based form values after form change', () => {
    const formChangeAction = {
      type: 'FORM_CHANGE',
      eID: 'rawData',
      checked: true,
    };
    expect(UploadReducer(defaultUploadState, formChangeAction).formValues.rawData)
      .toEqual(formChangeAction.checked);
  });
  // TODO: Handle if they upload files with the same name, at the same time
});
