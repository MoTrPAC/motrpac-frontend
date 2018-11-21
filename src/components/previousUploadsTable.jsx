import React from 'react';
import PropTypes from 'prop-types';


function PreviousUploadsTable({ previousUploads }) {
  const uploadRows = previousUploads
    .map(upload => <tr key={upload.identifier}><td>{upload.identifier}</td></tr>);
  return (
    <table className="table">
      <thead>
        <th>Identifier</th>
      </thead>
      <tbody>
        {uploadRows}
      </tbody>
    </table>
  );
}

PreviousUploadsTable.propTypes = {
  previousUploads: PropTypes.arrayOf(PropTypes.shape({
    identifier: PropTypes.string.isRequired,
  })).isRequired,
};


export default PreviousUploadsTable;
