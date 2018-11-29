import React from 'react';
import PropTypes from 'prop-types';

export function DownloadDataTable({ allUploads, onDownload }) {
  // TODO: Find out how actual downloading works
  const uploadList = allUploads
    .map(upload => <DownloadRow key={upload.identifier} upload={upload} onDownload={onDownload} />);

  return (
    <table className="table table-sm downloadTable">
      <thead>
        <tr>
          <th>Identifier</th>
          <th>Subject Type</th>
          <th>Phase</th>
          <th>Data Type</th>
          <th>Date Uploaded</th>
          <th>Site</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {uploadList}
      </tbody>
    </table>
  );
}
DownloadDataTable.propTypes = {
  allUploads: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onDownload: PropTypes.func.isRequired,
};

export function DownloadRow({ upload, onDownload }) {
  function DownloadBtn() {
    return (
      <button className="btn downloadBtn" type="button" onClick={() => onDownload(upload.identifier)}>Download</button>
    );
  }
  let availClass;
  switch (upload.availability) {
    case 'Publicly Available': {
      availClass = 'public';
      break;
    }
    case 'Internally Available': {
      availClass = 'internal';
      break;
    }
    default: {
      availClass = 'pending';
      break;
    }
  }
  return (
    <tr className={`downloadRow ${availClass}`}>
      <td>{upload.identifier}</td>
      <td>{upload.subject}</td>
      <td>{upload.phase}</td>
      <td>{upload.type}</td>
      <td>{upload.date}</td>
      <td>{upload.site}</td>
      <td>{upload.availability}</td>
      <td>
        <DownloadBtn />
      </td>
    </tr>
  );
}
DownloadRow.propTypes = {
  upload: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
  }).isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default DownloadDataTable;
