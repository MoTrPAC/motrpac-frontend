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
  profile,
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

  const userDisplayName = profile.user_metadata && profile.user_metadata.name ? profile.user_metadata.name : profile.name;
  const siteName = profile.user_metadata && profile.user_metadata.siteName ? profile.user_metadata.siteName : null;

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
      <div className="container Dashboard">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 align-self-center">
            <h2 className="welcomeUser light">Overview</h2>
          </div>
          <div className="col-auto">
            <Link className="uploadBtn btn btn-primary" to="/upload">Upload Data</Link>
          </div>
          <div className="col-auto">
            <Link className="downloadBtn btn btn-primary" to="/download">Download/View Data</Link>
          </div>
          {featureAvailable.dashboardEditable ? editBtn : ''}
        </div>
        <div className="row">
          <div className="col">
            <h3 className="divHeader">
              {`${userDisplayName}, ${siteName}`}
            </h3>
          </div>
        </div>
        <div className="row align-items-center">
          { disconnectComponents ? <PreviousUploadsTable previousUploads={previousUploads} /> : <PreviousUploadsTableConnected />}
          <PreviousUploadsGraph previousUploads={previousUploads} />
        </div>
        <div className="row">
          <div className="col">
            <h3 className="divHeader">
              All Sites
            </h3>
          </div>
        </div>
        <div className="row align-items-center pb-4">
          <AllUploadsDoughnut allUploads={allUploads} />
          <AllUploadStats />
        </div>
      </div>
    );
  }
  return (<Redirect to="/" />);
}

Dashboard.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
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
  profile: {},
  isAuthenticated: false,
  isPending: false,
  featureAvailable: {
    dashboardEditable: false,
  },
  disconnectComponents: false,
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
  isPending: state.auth.isPending,
  previousUploads: state.upload.previousUploads,
});

export default connect(mapStateToProps)(Dashboard);
