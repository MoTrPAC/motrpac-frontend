import React from 'react';
import PropTypes from 'prop-types';

function ReleaseDataTableExternal({ release, renderDataTypeRow }) {
  return (
    <div className="release-data-links-table-container">
      <table className="table table-sm release-data-links-table">
        <thead className="thead-dark">
          <tr className="table-head">
            <th>Data type</th>
            <th>Web download</th>
          </tr>
        </thead>
        <tbody>
          {release.result_files.data_types.map((item) =>
            renderDataTypeRow(
              release.result_files.bucket_name,
              item,
              release.version,
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

ReleaseDataTableExternal.propTypes = {
  release: PropTypes.shape({
    version: PropTypes.string,
    result_files: PropTypes.object,
  }).isRequired,
  renderDataTypeRow: PropTypes.func.isRequired,
};

export default ReleaseDataTableExternal;
