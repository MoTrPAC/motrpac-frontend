import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PreviousUploadsTable from './previousUploadsTable';
import PreviousUploadsGraph from './previousUploadsGraph';
import AllUploadsDoughnut from './allUploadsDoughnut';
import AllUploadStats from './allUploadStats';

const previousUploads = require('../testData/testPreviousUploads');
const allUploads = require('../testData/testAllUploads');

export function Dashboard({ profile, isAuthenticated, isPending, featureAvailable }) {
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
      <div className="container Dashboard">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 align-self-center">
            <h2 className="welcomeUser light">{`Welcome ${profile.name} at ${profile.user_metadata.siteName}`}</h2>
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
              {profile.nickname}
            </h3>
          </div>
        </div>
        <div className="row align-items-center">
          <PreviousUploadsTable previousUploads={previousUploads} />
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
  }).isRequired,
  isAuthenticated: PropTypes.bool,
  featureAvailable: PropTypes.shape({
    dashboardEditable: PropTypes.bool,
  }),
};
Dashboard.defaultProps = {
  isAuthenticated: false,
  featureAvailable: {
    dashboardEditable: false,
  },
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
  isPending: state.auth.isPending,
});

// Fill dispatch to props once actions implemented
// const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps)(Dashboard);
