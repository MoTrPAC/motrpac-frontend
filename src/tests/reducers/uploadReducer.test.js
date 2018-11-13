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
  // TODO: Handle if they upload files with the same name, at the same time
});
