const DRAG_ENTER = 'DRAG_ENTER';
const DRAG_LEAVE = 'DRAG_LEAVE';
const FILES_ADDED = 'FILES_ADDED';
const REMOVE_FILE = 'REMOVE_FILE';
const FORM_CHANGE = 'FORM_CHANGE';
const FORM_SUBMIT = 'FORM_SUBMIT';
const CANCEL_UPLOAD = 'CANCEL_UPLOAD';
const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
const CLEAR_FORM = 'CLEAR_FORM';
const EXPAND_UPLOAD_HISTORY = 'EXPAND_UPLOAD_HISTORY';
const SET_ALL_SUCCESS = 'SET_ALL_SUCCESS';

export const types = {
  DRAG_ENTER,
  DRAG_LEAVE,
  FILES_ADDED,
  REMOVE_FILE,
  FORM_CHANGE,
  FORM_SUBMIT,
  CANCEL_UPLOAD,
  UPLOAD_SUCCESS,
  CLEAR_FORM,
  EXPAND_UPLOAD_HISTORY,
  SET_ALL_SUCCESS,
};

function dragEnter() {
  return {
    type: DRAG_ENTER,
  };
}

function dragLeave() {
  return {
    type: DRAG_LEAVE,
  };
}

function stageFiles(files) {
  return {
    type: FILES_ADDED,
    files,
  };
}

function formSubmit(e) {
  return {
    type: FORM_SUBMIT,
    validity: e.target.checkValidity(),
    elements: e.target.elements,
  };
}

function removeFile(filename) {
  return {
    type: REMOVE_FILE,
    name: filename,
  };
}

function cancelUpload(id) {
  return {
    type: CANCEL_UPLOAD,
    id,
  };
}

function formChange(e) {
  return {
    type: FORM_CHANGE,
    eID: e.target.id,
    changeValue: e.target.value,
    checked: e.target.checked,
  };
}

function clearForm() {
  return {
    type: CLEAR_FORM,
  };
}

function uploadSuccess(upload) {
  return {
    type: UPLOAD_SUCCESS,
    upload,
  };
}

function setSuccess() {
  return {
    type: SET_ALL_SUCCESS,
  };
}

function formSubmitSuccessUploads(e) {
  return (dispatch) => {
    dispatch(formSubmit(e));
    return setTimeout(() => {
      dispatch(setSuccess());
    }, 2000);
  };
}

const actions = {
  stageFiles,
  // TODO: Set formSubmit to standard form submit, not mock function that forces successful uploads
  // formSubmit,
  formSubmit: formSubmitSuccessUploads,
  removeFile,
  cancelUpload,
  formChange,
  clearForm,
  uploadSuccess,
  setSuccess,
  dragEnter,
  dragLeave,
};

export default actions;
