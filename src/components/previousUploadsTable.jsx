import React from 'react';
import PropTypes from 'prop-types';


function PreviousUploadsTable({ previousUploads }) {
  const uploadRows = previousUploads
    .map(upload => (
      <tr key={upload.biospecimenID + upload.dataType}>
        <td>{upload.biospecimenID}</td>
        <td>{upload.subject}</td>
        <td>{upload.phase}</td>
        <td>{upload.dataType}</td>
        <td>{upload.date}</td>
      </tr>));
  return (
    <div className="col-12 table-responsive-md col-md-6 previousUploadsTable">
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th>Identifier</th>
            <th>Subject</th>
            <th>Phase</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {uploadRows}
        </tbody>
      </table>
    </div>
  );
}

PreviousUploadsTable.propTypes = {
  previousUploads: PropTypes.arrayOf(PropTypes.shape({
    biospecimenID: PropTypes.string.isRequired,
  })).isRequired,
};


export default PreviousUploadsTable;
