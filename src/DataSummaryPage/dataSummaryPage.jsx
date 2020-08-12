import React from 'react';
import { Link } from 'react-router-dom';
import TissueAnalysisPlanTable from './tissueAnalysisPlanTable';

/**
 * Renders the data summary page
 *
 * @returns {object} JSX representation of the data summary page
 */
function DataSummaryPage() {
  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 dataSummaryPage">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div className="page-title">
          <h3>Summary of Data Samples</h3>
        </div>
        <div className="btn-toolbar">
          <div className="btn-group">
            {/* <Link className="browseDataBtn btn btn-sm btn-outline-primary" to="/download">Browse Data</Link> */}
            <Link className="advSearchBtn btn btn-sm btn-outline-primary" to="/search">Search Data</Link>
          </div>
        </div>
      </div>
      <div className="alert alert-warning warning-note d-flex align-items-center" role="alert">
        <span className="warning-note-text">
          <strong>Disclaimer:</strong>
          &nbsp;The planned analysis projections listed in this table are based on the most current
          animal tissue analysis plan for MoTrPAC. Please note that this plan is subject to
          change, for example due to sample and data quality concerns or updated assay
          specifications.
        </span>
      </div>
      <div className="alert alert-info alert-dismissible fade show warning-note d-flex align-items-center" role="alert">
        <span className="material-icons">info</span>
        <span className="warning-note-text">
          &nbsp;Data submissions or corrections made after August 16, 2019 are not reflected in this table.
        </span>
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
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

export default DataSummaryPage;
