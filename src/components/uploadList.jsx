import React from 'react';
import PropTypes from 'prop-types';
import UploadListRow from './uploadListRow';

function UploadList({ uploadFiles }) {
  // Return empty message if no uploads
  if (!uploadFiles.length) {
    return (
      <div className="noListItems centered">
        <br />
        <br />
        <h2>Upload files and they will appear here!</h2>
        <br />
        <br />
      </div>
    );
  }

  // Create rows for individual uploads
  const listObj = uploadFiles
    .map(uploadItem => <UploadListRow key={uploadItem.file.name} uploadItem={uploadItem} />);

  return (
    <table className="table table-hover uploadList">
      <thead>
        <tr>
          <th scope="col">File Name</th>
          <th scope="col">Status</th>
          <th className="centered" scope="col">Upload Successful</th>
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
};
UploadList.defaultProps = {
  uploadFiles: [],
};

export default UploadList;
