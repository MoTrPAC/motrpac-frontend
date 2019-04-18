import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import sortByNumber from '../lib/sort';

/**
 * Renders a grid showing recently uploaded files attempted by a given user
 *
 * @param {Array} previousUploads Array of files uploaded in the past by a given user
 */
function RecentUploadList({ previousUploads }) {
  let historyObj = {};
  const historyList = [];
  previousUploads.forEach((upload) => {
    if (upload.history && upload.history.length) {
      upload.history.forEach((item) => {
        historyObj = {
          ...item,
          biospecimenBarcode: upload.biospecimenBarcode,
          subject: upload.subject,
          phase: upload.phase,
          dataType: upload.dataType,
        };
        historyList.push(historyObj);
      });
    }
  });
  // Create rows for individual uploaded files
  const uploadFileList = sortByNumber(historyList, 'timeStamp')
    .map(item => (
      <tr key={item.uuid} className="upload-activity-item">
        <td>{item.fileName}</td>
        <td>{item.biospecimenBarcode}</td>
        <td>{item.subject}</td>
        <td>{item.phase}</td>
        <td>{item.dataType}</td>
        <td>{dayjs(item.timeStamp).format('MMM D, YYYY - h:mm A')}</td>
      </tr>
    ));

  function RenderUploadActivity() {
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">File Name</th>
            <th scope="col">Biospecimen Barcode</th>
            <th scope="col">Subject</th>
            <th scope="col">Phase</th>
            <th scope="col">Data Type</th>
            <th scope="col">Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {uploadFileList}
        </tbody>
      </table>
    );
  };

  return (
    <div className="recent-upload-activity">
      <div className="card">
        <h5 className="card-header">Recent Upload Activity</h5>
        {previousUploads.length
          ? <RenderUploadActivity />
          : <div className="card-body"><div className="noUploadActivity">No recent uploads.</div></div>
        }
      </div>
    </div>
  );
}

const historyPropType = {
  fileName: PropTypes.string,
  timeStamp: PropTypes.number,
  uuid: PropTypes.string,
};

RecentUploadList.propTypes = {
  previousUploads: PropTypes.arrayOf(PropTypes.shape({
    history: PropTypes.arrayOf(PropTypes.shape({ ...historyPropType })),
    biospecimenBarcode: PropTypes.string,
    subject: PropTypes.string,
    phase: PropTypes.string,
    dataType: PropTypes.string,
  })),
};

RecentUploadList.defaultProps = {
  previousUploads: [],
};

export default RecentUploadList;
