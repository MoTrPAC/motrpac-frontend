import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import UploadForm from './uploadForm';
import UploadList from './uploadList';
import UploadAreaDnD from './uploadAreaDnD';
import actions from './uploadActions';

// Returns element containing a drag and drop area for file input
//    and a display for monitoring file status
// * Unintended but potentially useful bug: onces a valid form submitted,
//    cannot change form data but can still upload more files
export function UploadScreen({
  dragging,
  validated,
  submitted,
  formValues,
  stagedFiles,
  uploadFiles,
  onDragEnter,
  onDragLeave,
  onDragDrop,
  onFileAdded,
  onRemoveFile,
  onFormSubmit,
  cancelUpload,
  handleFormChange,
  clearForm,
  uploadSuccess,
  isAuthenticated,
  previousUploads,
}) {
  if (!isAuthenticated) {
    return (<Redirect to="/" />);
  }
  const showFileUploadValidation = (validated && (stagedFiles.length === 0) && !submitted);
  const screen = (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 uploadScreen upload">
      <div className="page-title pt-3 pb-2 border-bottom">
        <h3>Upload Data</h3>
      </div>
      <div className="row">
        <div className="col-4">
          <UploadForm
            validated={validated}
            submitted={submitted}
            formValues={formValues}
            handleSubmit={onFormSubmit}
            handleFormChange={handleFormChange}
          />
        </div>
        <div className="col-8 centered">
          <div className="row">
            <div className="col">
              <UploadAreaDnD
                dragging={dragging}
                files={stagedFiles}
                fileAdded={e => onFileAdded(e)}
                dragEnter={() => onDragEnter()}
                dragLeave={() => onDragLeave()}
                dragDrop={e => onDragDrop(e)}
                removeFile={onRemoveFile}
                showValidation={showFileUploadValidation}
              />
            </div>
          </div>
          <div className="row justify-content-center">
            { showFileUploadValidation ? <div className="col-12 centered addFileError"><small>Please Add File to Upload</small></div> : '' }
            <div className="col-3 centered">
              <label htmlFor="submit-form" id="formSubmitLabel" className="btn btn-success uploadBtn" tabIndex={0}>Upload</label>
            </div>
            <div className="col-3 centered">
              <button onClick={clearForm} type="button" className="btn btn-danger clearFormBtn">
                {submitted ? 'Start New Sample' : 'Clear Form'}
              </button>
            </div>
          </div>
        </div>
        <div className="col-12">
          <h3>{formValues.biospecimenID}</h3>
          <UploadList
            uploadFiles={uploadFiles}
            cancelUpload={cancelUpload}
            previousUploads={previousUploads}
          />
        </div>
      </div>
    </div>
  );
  return screen;
}

const historyPropType = {
  fileName: PropTypes.string,
  timeStamp: PropTypes.number,
  uuid: PropTypes.string,
};

UploadScreen.propTypes = {
  dragging: PropTypes.number.isRequired,
  submitted: PropTypes.bool,
  stagedFiles: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  formValues: PropTypes.shape({
    dataType: PropTypes.string,
    biospecimenID: PropTypes.string,
    collectionDate: PropTypes.string,
    subjectType: PropTypes.string,
    studyPhase: PropTypes.string,
    submitted: PropTypes.bool,
    rawData: PropTypes.bool,
    processedData: PropTypes.bool,
  }),
  uploadFiles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    file: PropTypes.file,
    status: PropTypes.string,
    errorCode: PropTypes.string,
  })),
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDragDrop: PropTypes.func.isRequired,
  onFileAdded: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  cancelUpload: PropTypes.func.isRequired,
  clearForm: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  previousUploads: PropTypes.arrayOf(PropTypes.shape({
    history: PropTypes.arrayOf(PropTypes.shape({ ...historyPropType })),
    biospecimenBarcode: PropTypes.string,
    subject: PropTypes.string,
    phase: PropTypes.string,
    dataType: PropTypes.string,
  })),
};

const mapStateToProps = state => ({
  ...(state.upload),
  isAuthenticated: state.auth.isAuthenticated,
});

// Maps required functions to specific actions handled by reducer in src/reducers.js
const mapDispatchToProps = dispatch => ({
  onDragEnter: () => dispatch(actions.dragEnter()),
  onDragLeave: () => dispatch(actions.dragLeave()),
  onDragDrop: e => dispatch(actions.stageFiles(e.dataTransfer.files)),
  onFileAdded: e => dispatch(actions.stageFiles(e.target.files)),
  onRemoveFile: fileName => dispatch(actions.removeFile(fileName)),
  onFormSubmit: e => dispatch(actions.formSubmit(e)),
  cancelUpload: ident => dispatch(actions.cancelUpload(ident)),
  handleFormChange: e => dispatch(actions.formChange(e)),
  clearForm: () => dispatch(actions.clearForm()),
  uploadSuccess: upload => dispatch(actions.uploadSuccess(upload)),
});

// exports screen using redux method to allow for interaction between individual components
export default connect(mapStateToProps, mapDispatchToProps)(UploadScreen);
