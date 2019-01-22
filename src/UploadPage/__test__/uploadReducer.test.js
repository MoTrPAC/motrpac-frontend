import { UploadReducer, defaultUploadState } from '../uploadReducer';
import actions, { types } from '../uploadActions';

const testFiles = require('../../testData/testFiles');
const testUploads = require('../../testData/testUploads');

describe('Upload Reducer', () => {
  test('Return initial state if no action or state', () => {
    expect(UploadReducer(undefined, {})).toEqual({ ...defaultUploadState });
  });

  test('Returns state given if no action', () => {
    expect(UploadReducer({ ...defaultUploadState, stagedFiles: ['fileName.fileExt'] }, {})).toEqual({ ...defaultUploadState, stagedFiles: ['fileName.fileExt'] });
  });

  const addFileAction = actions.stageFiles([testFiles[1], testFiles[1]]);
  const fileAddedState = {
    ...defaultUploadState,
    stagedFiles: [testFiles[1]],
  };
  test('Does not add files if filename previously added', () => {
    expect(UploadReducer(fileAddedState, addFileAction))
      .toEqual(fileAddedState);
  });

  const formSubmitAction = {
    type: types.FORM_SUBMIT,
    validity: false,
    elements: {
      dataType: { value: '' },
      biospecimenID: { value: '' },
      collectionDate: { value: '' },
      subjectType: { value: '' },
      studyPhase: { value: '' },
      rawData: { checked: false },
      processedData: { checked: true },
    },
  };

  test('Changes validated state to true on submitting invalid form', () => {
    expect(UploadReducer(undefined, formSubmitAction))
      .toEqual({
        ...defaultUploadState,
        validated: true,
      });
  });

  const removeFileAction = actions.removeFile(testFiles[1].name);

  it('Removed file is not in returned state', () => {
    expect(UploadReducer(fileAddedState, removeFileAction))
      .toEqual(defaultUploadState);
  });

  
  const cancelUploadAction = actions.cancelUpload(testUploads[0].id);
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
      eID: 'biospecimenID',
      changeValue: '123123',
    };
    expect(UploadReducer(defaultUploadState, formChangeAction).formValues.biospecimenID)
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

  const uploadDate = Date.now();

  const formSubmitValidAction = {
    ...formSubmitAction,
    elements: {
      ...formSubmitAction.elements,
      biospecimenID: { value: 'NEW_IDENTIFIER' },
    },
    validity: true,
  };
  const noExperimentExpectedValue = {
    biospecimenID: formSubmitValidAction.elements.biospecimenID.value,
    dataType: formSubmitValidAction.elements.dataType.value,
    subject: formSubmitValidAction.elements.subjectType.value,
    phase: formSubmitValidAction.elements.studyPhase.value,
    date: formSubmitValidAction.elements.collectionDate.value,
    availability: 'Pending Q.C.',
    lastUpdated: uploadDate,
    history: [],
  };

  const newExperimentState = UploadReducer(fileAddedState, formSubmitValidAction);
  test('Upload of new experiment/biospecimenID adds new entry to previousUploads', () => {
    expect(newExperimentState.previousUploads.slice(-1)[0].biospecimenID)
      .toEqual(noExperimentExpectedValue.biospecimenID);
    expect(newExperimentState.previousUploads.slice(-1)[0].history)
      .toEqual(noExperimentExpectedValue.history);
    expect(newExperimentState.previousUploads.slice(-1)[0].lastUpdated)
      .toBeGreaterThanOrEqual(noExperimentExpectedValue.lastUpdated);
  });
  const clearFormAction = actions.clearForm();

  const addToExpFormSubmitAction = {
    ...formSubmitValidAction,
    elements: {
      ...formSubmitValidAction.elements,
      biospecimenID: { value: 'NEW_IDENTIFIER_2' },
    },
  };
  // State has 1 unique experiment
  const addToExperimentState = UploadReducer(newExperimentState, formSubmitValidAction);
  const freshFormState = {
    ...UploadReducer(addToExperimentState, clearFormAction),
    // Added files and validity to enable submission of form to pass checks
    stagedFiles: [testFiles[3]],
    validity: true,
  };
  // State has 2 experiments
  const addNewExperimentState = UploadReducer(freshFormState, addToExpFormSubmitAction);
  test('Upload of existing experiment/biospecimenID adds to history of correct element in previousUploads', () => {
    // Adding experiment, adds new experiment to previousUploads list
    expect(addToExperimentState.previousUploads).toHaveLength(1);
    expect(addToExperimentState.experimentIndex).toEqual(0);

    // Clearing form empties the form values
    expect(freshFormState.formValues)
      .toEqual(defaultUploadState.formValues);

    // Clearing form doesn't change previousUploads
    expect(freshFormState.previousUploads[0].biospecimenID)
      .toEqual(formSubmitValidAction.elements.biospecimenID.value);

    // Form is valid, submission went through
    expect(addNewExperimentState.validity)
      .toBeTruthy();

    // Correct BID represented in returned states form values
    expect(addNewExperimentState.formValues.biospecimenID)
      .toEqual(addToExpFormSubmitAction.elements.biospecimenID.value);

    // Adding a unique experiment changes state
    expect(addNewExperimentState)
      .not.toEqual(addToExperimentState);

    // Adding a unique experiment adds an entry to previousUploads
    expect(addNewExperimentState.previousUploads)
      .toHaveLength(2);

    // Adding a unique experiment changes experimentIndex
    expect(addNewExperimentState.experimentIndex)
      .toEqual(0);

    // experimentIndex points to correct location
    expect(addNewExperimentState.previousUploads[addNewExperimentState.experimentIndex].biospecimenID)
      .toEqual(addToExpFormSubmitAction.elements.biospecimenID.value);
  });

  const uploadSuccessAction = actions.uploadSuccess(testUploads[0]);

  test('On successful upload, add to relevant experiments history', () => {
    const addUploadHistoryState = UploadReducer(newExperimentState, uploadSuccessAction)
    const addUploadHistory = addUploadHistoryState
      .previousUploads[addUploadHistoryState.experimentIndex].history;

    expect(addUploadHistory)
      .toHaveLength(1);
    expect(addUploadHistory[0].fileName)
      .toEqual(uploadSuccessAction.upload.file.name);
  });

  const expandRowAction = {
    type: 'EXPAND_UPLOAD_HISTORY',
    upload: addNewExperimentState.previousUploads[1],
  };
  test('On expand upload row, sets appropriate upload to have status expanded', () => {
    const expandedRowState = UploadReducer(addNewExperimentState, expandRowAction);
    // Correct upload set to expanded
    expect(expandedRowState.previousUploads[1].expanded)
      .toBeTruthy();

    // Other uploads are not expanded
    expect(expandedRowState.previousUploads[0].expanded)
      .toBeFalsy();
  });
  // TODO: Handle if they upload files with the same name, at the same time
});
