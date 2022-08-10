import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ReleaseDataTableInternalByPhase({ release, renderDataTypeRow }) {
  return (
    <div className="release-data-links-table-container">
      <h6>Phase: PASS1A 6-month</h6>
      <table className="table table-sm release-data-links-table">
        <thead className="thead-dark">
          <tr className="table-head">
            <th className="col-data-type">Data type</th>
            <th className="col-command-line-download">Command-line download</th>
            <th className="col-web-download">Web download</th>
          </tr>
        </thead>
        <tbody>
          {release.result_files.data_types.pass1a_06.map((item) => renderDataTypeRow(
            release.result_files.bucket_name,
            item,
            release.version,
          ))}
        </tbody>
      </table>
      <h6>Phase: PASS1B 6-month</h6>
      <p className="release-description">
        Note: The PASS1B 6-month data sets included in this consortium release are now
        outdated. Please visit the{' '}
        <Link to="/browse-data" className="inline-link">
          Browse Data
        </Link>
        {' '}page to download the most up-to-date PASS1B 6-month data.
      </p>
      <table className="table table-sm release-data-links-table">
        <thead className="thead-dark">
          <tr className="table-head">
            <th className="col-data-type">Data type</th>
            <th className="col-command-line-download">Command-line download</th>
            <th className="col-web-download">Web download</th>
          </tr>
        </thead>
        <tbody>
          {release.result_files.data_types.pass1b_06.map((item) => renderDataTypeRow(
            release.result_files.bucket_name,
            item,
            release.version,
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReleaseDataTableInternalByPhase.propTypes = {
  release: PropTypes.shape({
    version: PropTypes.string,
    result_files: PropTypes.object,
  }).isRequired,
  renderDataTypeRow: PropTypes.func.isRequired,
};

export default ReleaseDataTableInternalByPhase;
