import React from 'react';
import PropTypes from 'prop-types';
import UploadListRow from './uploadListRow';

function UploadList({ uploadFiles, cancelUpload }) {
  // Return empty message if no uploads
  if (!uploadFiles.length) {
    return (
      <div className="noListItems centered">
        <h2>Upload files and they will appear here!</h2>
      </div>
    );
  }

  // Create rows for individual uploads
  const listObj = uploadFiles
    .map(uploadItem => (
      <UploadListRow
        key={uploadItem.file.name}
        uploadItem={uploadItem}
        cancelUpload={cancelUpload}
      />
    ));

  return (
    <table className="table table-hover uploadList">
      <thead>
        <tr>
          <th scope="col">File Name</th>
          <th scope="col">Status</th>
          <th className="centered" scope="col">Upload Successful</th>
          <th className="centered" scope="col">Cancel Upload</th>
        </tr>
      </thead>
      <tbody>
        {listObj}
      </tbody>
    </table>
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
