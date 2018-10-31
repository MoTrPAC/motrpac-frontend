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
      message = `Error: ${uploadItem.errorCode}`;
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

UploadListRow.propTypes = {
  uploadItem: PropTypes.shape({
    file: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    status: PropTypes.string.isRequired,
    errorCode: PropTypes.string,
  }).isRequired,
};


export default UploadListRow;
