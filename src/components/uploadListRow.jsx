import React from 'react';
import PropTypes from 'prop-types';
import '../main.css';

import '../assets/open-iconic-master/font/css/open-iconic-bootstrap.css';


function UploadListRow({ uploadItem }) {
  let icon;
  let message;
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
};


export default UploadListRow;
