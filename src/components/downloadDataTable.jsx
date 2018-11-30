import React from 'react';
import PropTypes from 'prop-types';

function DownloadDataTable({
  allUploads,
  onDownload,
  onChangeSort,
}) {
  // TODO: Find out how actual downloading works
  if (allUploads.length === 0) {
    return (
      <div className="noData col">
        <h2>
          No Downloadable Data Available
        </h2>
      </div>
    );
  }
  const uploadList = allUploads
    .map(upload => <DownloadRow key={upload.identifier} upload={upload} onDownload={onDownload} />);

  return (
    <div className="col">
      <table className="table downloadTable">
        <thead>
          <tr>
            <th>
              <button type="button" onClick={() => onChangeSort('identifier')} className="btn btn-light sortBtn">
                Identifier
              </button>
            </th>
            <th>
              <button type="button" onClick={() => onChangeSort('subject')} className="btn btn-light sortBtn">
                Subject Type
              </button>
            </th>
            <th>
              <button type="button" onClick={() => onChangeSort('phase')} className="btn btn-light sortBtn">
                Phase
              </button>
            </th>
            <th>
              <button type="button" onClick={() => onChangeSort('type')} className="btn btn-light sortBtn">
                Data Type
              </button>
            </th>
            <th>
              <button type="button" onClick={() => onChangeSort('date')} className="btn btn-light sortBtn">
                Date Uploaded
              </button>
            </th>
            <th>
              <button type="button" onClick={() => onChangeSort('site')} className="btn btn-light sortBtn">
                Site
              </button>
            </th>
            <th>
              <button type="button" onClick={() => onChangeSort('availability')} className="btn btn-light sortBtn">
                Status
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {uploadList}
        </tbody>
      </table>
    </div>
  );
}
DownloadDataTable.propTypes = {
  allUploads: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onDownload: PropTypes.func.isRequired,
  onChangeSort: PropTypes.func.isRequired,
};
DownloadDataTable.defaultProps = {
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
      <td className="availCol">{upload.availability}</td>
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
