import React from 'react';
import PropTypes from 'prop-types';
import UploadListRow from './uploadListRow';

function UploadList({ uploadFiles, cancelUpload }) {
  // Return empty message if no uploads
  if (!uploadFiles.length) {
    return (
      <div className="noListItems centered">
        <h3>Upload files and they will appear here!</h3>
      </div>
    );
  }

  // Create rows for individual uploads
  const listObj = uploadFiles
    .map(uploadItem => (
      <UploadListRow
        key={uploadItem.id}
        uploadItem={uploadItem}
        cancelUpload={cancelUpload}
      />
    ));

  return (
    <div className="upload-file-list">
      <table className="table table-hover uploadList">
        <thead>
          <tr>
            <th scope="col">File Name</th>
            <th className="centered" scope="col">Upload Status</th>
            <th className="centered" scope="col">Cancel Upload</th>
          </tr>
        </thead>
        <tbody>
          {listObj}
        </tbody>
      </table>
    </div>
  );
}

UploadList.propTypes = {
  uploadFiles: PropTypes.arrayOf(PropTypes.shape({
    file: PropTypes.file,
    status: PropTypes.string,
    errorCode: PropTypes.string,
  })),
  cancelUpload: PropTypes.func.isRequired,
};

UploadList.defaultProps = {
  uploadFiles: [],
};

export default UploadList;
