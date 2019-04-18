import React from 'react';
import PropTypes from 'prop-types';
import UploadListRow from './uploadListRow';
import RecentUploadList from './recentUploadList';

function UploadList({ uploadFiles, cancelUpload, previousUploads }) {
  // Return empty message if no uploads
  if (!uploadFiles.length) {
    return (
      <React.Fragment>
        <div className="noListItems centered">
          <h3>Upload files and they will appear here!</h3>
        </div>
        <RecentUploadList previousUploads={previousUploads} />
      </React.Fragment>
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
    <React.Fragment>
      <div className="upload-file-list">
        <div className="card">
          <h5 className="card-header">Uploaded Files</h5>
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
        </div>
      </div>
      <RecentUploadList previousUploads={previousUploads} />
    </React.Fragment>
  );
}

const historyPropType = {
  fileName: PropTypes.string,
  timeStamp: PropTypes.number,
  uuid: PropTypes.string,
};

UploadList.propTypes = {
  uploadFiles: PropTypes.arrayOf(PropTypes.shape({
    file: PropTypes.file,
    status: PropTypes.string,
    errorCode: PropTypes.string,
  })),
  cancelUpload: PropTypes.func.isRequired,
  previousUploads: PropTypes.arrayOf(PropTypes.shape({
    history: PropTypes.arrayOf(PropTypes.shape({ ...historyPropType })),
    biospecimenBarcode: PropTypes.string,
    subject: PropTypes.string,
    phase: PropTypes.string,
    dataType: PropTypes.string,
  })),
};

UploadList.defaultProps = {
  uploadFiles: [],
  previousUploads: [],
};

export default UploadList;
