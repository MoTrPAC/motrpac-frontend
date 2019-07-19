import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import TissueAnalysisPlanTable from './tissueAnalysisPlanTable';

/**
 * Renders the data summary page
 *
 * @param {Boolean}   isAuthenticated Redux state for user's authentication status
 *
 * @returns {object} JSX representation of the data summary page
 */
export function DataSummaryPage({
  isAuthenticated,
}) {
  // Send users back to homepage if not authenticated
  if (!isAuthenticated) {
    return (<Redirect to="/" />);
  }

  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 dataSummaryPage">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div className="page-title">
          <h3>Summary of Data Samples</h3>
        </div>
        <div className="btn-toolbar">
          <div className="btn-group">
            <Link className="browseDataBtn btn btn-sm btn-outline-primary" to="/download">Browse Data</Link>
            <Link className="advSearchBtn btn btn-sm btn-outline-primary" to="/search">Search Data</Link>
          </div>
        </div>
      </div>
      <div className="pass-tissue-analysis-status-panel">
        <div className="card mb-3">
          <h5 className="card-header">PASS Tissue Analysis Status</h5>
          <div className="card-body">
            <TissueAnalysisPlanTable />
          </div>
        </div>
      </div>
    </div>
  );
}

DataSummaryPage.propTypes = {
  isAuthenticated: PropTypes.bool,
};

DataSummaryPage.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

/*
const mapDispatchToProps = dispatch => ({
  clearForm: () => dispatch(actions.clearForm()),
});
*/

export default connect(mapStateToProps)(DataSummaryPage);
