import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PreviousUploadsTable from './previousUploadsTable';

const previousUploads = require('../testData/testPreviousUploads');

export function Dashboard({ user, loggedIn }) {
  if (loggedIn) {
    return (
      <div className="container Dashboard">
        <div className="row align-items-center">
          <div className="col-auto align-self-center">
            <h2 className="welcomeUser light">{`Welcome ${user.name} at ${user.siteName}`}</h2>
          </div>
          <div className="col-auto">
            <Link className="uploadBtn btn btn-primary" to="/upload">Upload Data</Link>
          </div>
          <div className="col-auto">
            <Link className="downloadBtn btn btn-primary" to="/download">Download/View Upload Data</Link>
          </div>
          <div className="col-auto">
            <Link className="editBtn btn btn-light disabled" to="/edit-dashboard">Edit Dashboard</Link>
          </div>
        </div>
        <hr />
        <div className="row">
          <PreviousUploadsTable previousUploads={previousUploads} />
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
};
Dashboard.defaultProps = {
  loggedIn: false,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  loggedIn: state.auth.loggedIn,
});

// Fill dispatch to props once actions implemented
// const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps)(Dashboard);
