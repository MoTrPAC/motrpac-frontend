import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export function Dashboard({ user, loggedIn }) {
  if (loggedIn === true) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <br />
            <h2 className="light">{`Welcome ${user.name} at ${user.siteName}`}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Link className="uploadBtn btn btn-primary" to="/upload">Upload Data</Link>
          </div>
        </div>
      </div>
    );
  }
  return (<Redirect to="/" />);
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  loggedIn: PropTypes.bool,
};
Dashboard.defaultProps = {
  loggedIn: false,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

// Fill dispatch to props once actions implemented
// const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps)(Dashboard);
