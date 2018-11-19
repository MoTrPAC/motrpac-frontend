import React from 'react';
import PropTypes from 'prop-types';
// import '../assets/open-iconic-master/font/css/open-iconic-bootstrap.css';


function UploadListRow({ uploadItem, cancelUpload }) {
  let icon;
  let message;
  const strID = uploadItem.id.replace('.', '_');
  function ConfirmCancel() {
    return (
      <div className="modal fade" id={`cancelUpload${strID}`} tabIndex="-1" role="dialog" aria-labelledby="cancelUploadLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="cancelUploadLabel">
                Cancel Uploading
                &nbsp;
                {uploadItem.file.name}
                ?
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn cancelUploadConfirm" data-dismiss="modal" onClick={() => cancelUpload(uploadItem.id)}>Cancel Upload</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Changes  error message and icon based on upload status
  switch (uploadItem.status) {
    case 'UPLOAD_SUCCESS': {
      icon = <span className="oi oi-check" />;
      message = 'Upload Successful';
      break;
    }
    case 'UPLOADING': {
      icon = <span className="oi loadIndicator oi-loop-circular" />;
      message = 'Uploading...';
      break;
    }
    case 'FAILED': {
      icon = <span className="oi oi-warning" />;
      message = (
        <div>
          <button type="button" className="errorHovButton">
            {`Error: ${uploadItem.error.code}`}
          </button>
          <ErrorHover error={uploadItem.error} />
        </div>
      );
      break;
    }
    default: {
      icon = <span className="oi oi-question-mark" />;
      message = 'Status Undefined';
      break;
    }
  }

  return (
    <tr className="uploadItem">
      <td>{uploadItem.file.name}</td>
      <td>{message}</td>
      <td className="centered">{icon}</td>
      <td className="centered">
        <button type="button" className="btn cancelBtn" data-toggle="modal" data-target={`#cancelUpload${strID}`}>
          <span className="oi oi-circle-x" />
        </button>
        <ConfirmCancel />
      </td>
    </tr>
  );
}

function ErrorHover({ error }) {
  const errorHover = (
    <div className="errorHover">
      <h5>{`Error ${error.code}: ${error.title}`}</h5>
      <p>{error.message}</p>
    </div>
  );
  return errorHover;
}

UploadListRow.propTypes = {
  uploadItem: PropTypes.shape({
    file: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    status: PropTypes.string.isRequired,
    error: PropTypes.shape({
      code: PropTypes.string,
      message: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
  cancelUpload: PropTypes.func.isRequired,
};


export default UploadListRow;
