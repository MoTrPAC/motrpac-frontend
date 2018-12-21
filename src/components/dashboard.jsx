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

export function Dashboard({ user, loggedIn, featureAvailable }) {
  const editBtn = (
    <div className="col-auto">
      <Link className="editBtn btn btn-light disabled" to="/edit-dashboard">Edit Dashboard</Link>
    </div>
  );
  if (loggedIn) {
    return (
      <div className="container Dashboard">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 align-self-center">
            <h2 className="welcomeUser light">{`Welcome ${user.name} at ${user.siteName}`}</h2>
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
              {user.siteName}
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
  user: PropTypes.shape({
    name: PropTypes.string,
    siteName: PropTypes.string,
  }).isRequired,
  loggedIn: PropTypes.bool,
  featureAvailable: PropTypes.shape({
    dashboardEditable: PropTypes.bool,
  }),
};
Dashboard.defaultProps = {
  loggedIn: false,
  featureAvailable: {
    dashboardEditable: false,
  },
};

const mapStateToProps = state => ({
  user: state.auth.user,
  loggedIn: state.auth.loggedIn,
});

// Fill dispatch to props once actions implemented
// const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps)(Dashboard);
