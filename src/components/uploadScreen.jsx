import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UploadForm from './uploadForm';
import UploadList from './uploadList';
import UploadAreaDnD from './uploadAreaDnD';

// Returns element containing a drag and drop area for file input
//    and a display for monitoring file status
// * Unintended but potentially useful bug: onces a valid form submitted,
//    cannot change form data but can still upload more files
function UploadScreen({
  dragging,
  validated,
  formValues,
  files,
  uploadFiles,
  onDragEnter,
  onDragLeave,
  onDragDrop,
  onFileAdded,
  onRemoveFile,
  onFormSubmit,
}) {
  const screen = (
    <div className="row">
      <div className="col-4">
        <UploadForm validated={validated} formValues={formValues} handleSubmit={onFormSubmit} />
      </div>
      <div className="col-8 centered">
        <br />
        <UploadAreaDnD
          dragging={dragging}
          files={files}
          fileAdded={e => onFileAdded(e)}
          dragEnter={() => onDragEnter()}
          dragLeave={() => onDragLeave()}
          dragDrop={e => onDragDrop(e)}
          removeFile={onRemoveFile}
        />
        <br />
        <br />
        <label htmlFor="submit-form" className="btn btn-success" tabIndex={0}>Upload</label>
      </div>
      <div className="col-12">
        <h3>{formValues.identifier}</h3>
        <UploadList uploadFiles={uploadFiles} />
      </div>
    </div>
  );
  return screen;
}

UploadScreen.propTypes = {
  dragging: PropTypes.number.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  formValues: PropTypes.shape({
    dataType: PropTypes.string,
    identifier: PropTypes.string,
    collectionDate: PropTypes.string,
    subjectType: PropTypes.string,
    studyPhase: PropTypes.string,
  }),
  uploadFiles: PropTypes.arrayOf(PropTypes.shape({
    file: PropTypes.file,
    status: PropTypes.string,
    errorCode: PropTypes.string,
  })),
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDragDrop: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onFileAdded: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  ...state,
});

// Maps required functions to specific actions handled by reducer in src/reducers.js
const mapDispatchToProps = dispatch => ({
  onDragEnter: () => dispatch({
    type: 'DRAG_ENTER',
  }),
  onDragLeave: () => dispatch({
    type: 'DRAG_LEAVE',
  }),
  onDragDrop: e => dispatch({
    type: 'FILES_ADDED',
    files: e.dataTransfer.files,
  }),
  onFileAdded: e => dispatch({
    type: 'FILES_ADDED',
    files: e.target.files,
  }),
  onUpload: () => dispatch({
    type: 'UPLOADING_FILES',
  }),
  onRemoveFile: fileName => dispatch({
    type: 'REMOVE_FILE',
    name: fileName,
  }),
  onFormSubmit: e => dispatch({
    type: 'FORM_SUBMIT',
    target: e.target,
  }),
});

// exports screen using redux method to allow for interaction between individual components
export default connect(mapStateToProps, mapDispatchToProps)(UploadScreen);
