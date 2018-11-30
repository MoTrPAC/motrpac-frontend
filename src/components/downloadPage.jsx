import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import DownloadDataTable from './downloadDataTable';
import AllUploadsDoughnut from './allUploadsDoughnut';

const testUploads = require('../testData/testPreviousUploads');

export function DownloadPage({
  loggedIn,
  allUploads,
  sortBy,
  devEnv,
  onDownload,
  onChangeSort,
}) {
  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className="container downloadPage">
      <div className="row titleRow">
        <div className="col">
          <h2>Download Data</h2>
        </div>
      </div>
      <div className="row justify-content-center">
        <DownloadDataTable
          allUploads={devEnv ? testUploads : allUploads}
          sortBy={sortBy}
          onDownload={onDownload}
          onChangeSort={onChangeSort}
        />
      </div>
    </div>
  );
}
DownloadPage.propTypes = {
  allUploads: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sortBy: PropTypes.string,
  loggedIn: PropTypes.bool,
  onDownload: PropTypes.func.isRequired,
  onChangeSort: PropTypes.func.isRequired,
  devEnv: PropTypes.bool,
};
DownloadPage.defaultProps = {
  sortBy: 'identifier',
  loggedIn: false,
  // TODO: Change to false before production
  devEnv: false,
};

const mapStateToProps = state => ({
  sortBy: state.download.sortBy,
  allUploads: state.download.allUploads,
  loggedIn: state.auth.loggedIn,
  devEnv: state.env.testData,
});

const mapDispatchToProps = dispatch => ({
  onDownload: file => dispatch({
    type: 'ANALYSIS_SELECT',
    downloadFile: file,
  }),
  onChangeSort: sortCol => dispatch({
    type: 'SORT_CHANGE',
    column: sortCol,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
