import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PreviousUploadsTableConnected, { PreviousUploadsTable } from '../Widgets/previousUploadsTable';
import PreviousUploadsGraph from '../Widgets/previousUploadsGraph';
import AllUploadsDoughnut from '../Widgets/allUploadsDoughnut';
import AllUploadStats from '../Widgets/allUploadStats';

const allUploads = require('../testData/testAllUploads');

export function Dashboard({
  isAuthenticated,
  isPending,
  featureAvailable,
  previousUploads,
  disconnectComponents,
}) {
  const editBtn = (
    <div className="col-auto">
      <Link className="editBtn btn btn-light disabled" to="/edit-dashboard">Edit Dashboard</Link>
    </div>
  );

  // FIXME: temp workaround to handle callback redirect
  if (isPending) {
    const pendingMsg = 'Authenticating...';

    return (
      <div className="authLoading">
        <span className="oi oi-shield" />
        <h3>{pendingMsg}</h3>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="col-md-9 ml-sm-auto col-lg-10 px-4 Dashboard">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <div className="page-title">
            <h3>Dashboard</h3>
          </div>
          <div className="btn-toolbar">
            <div className="btn-group">
              <Link className="uploadBtn btn btn-sm btn-outline-primary" to="/upload">Upload Data</Link>
              <Link className="downloadBtn btn btn-sm btn-outline-primary" to="/download">Download/View Data</Link>
            </div>
          </div>
          {featureAvailable.dashboardEditable ? editBtn : ''}
        </div>
        <div className="previous-uploads-table">
          <div className="card">
            <h5 className="card-header">Uploads</h5>
            <div className="card-body">
              { disconnectComponents ? <PreviousUploadsTable previousUploads={previousUploads} /> : <PreviousUploadsTableConnected /> }
            </div>
          </div>
        </div>
        <div className="previous-uploads-graph">
          <div className="card">
            <h5 className="card-header">Assay Categories</h5>
            <div className="card-body">
              <PreviousUploadsGraph previousUploads={previousUploads} />
            </div>
          </div>
        </div>
        <div className="total-uploads-graph">
          <div className="card">
            <h5 className="card-header">Total Uploads By All Sites</h5>
            <div className="card-body">
              <div className="row justify-content-center">
                <AllUploadsDoughnut allUploads={allUploads} />
                <AllUploadStats />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (<Redirect to="/" />);
}

Dashboard.propTypes = {
  isAuthenticated: PropTypes.bool,
  isPending: PropTypes.bool,
  featureAvailable: PropTypes.shape({
    dashboardEditable: PropTypes.bool,
  }),
  previousUploads: PropTypes.arrayOf(PropTypes.shape({
    identifier: PropTypes.string,
  })).isRequired,
  disconnectComponents: PropTypes.bool,
};

Dashboard.defaultProps = {
  isAuthenticated: false,
  isPending: false,
  featureAvailable: {
    dashboardEditable: false,
  },
  disconnectComponents: false,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isPending: state.auth.isPending,
  previousUploads: state.upload.previousUploads,
});

export default connect(mapStateToProps)(Dashboard);
