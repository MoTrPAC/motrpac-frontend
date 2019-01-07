import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../actions';

/**
 * Method to render global footer
 */
export function Footer({
  history,
  isAuthenticated,
  profile,
  login,
  logout,
}) {
  const handleLogout = () => {
    logout();
    history.push("/");
  }
  // Function to render login button
  const LoginButton = () => {
    return (
      <span className="user-login-button">
        {isAuthenticated && (
          <span>
            <img src={profile.picture} className="user-avatar" alt="avatar" />
            <button type="button" onClick={handleLogout} className="logInOutBtn btn">
              {profile.name}
              &nbsp;Logout
            </button>
          </span>
        )}
        {!isAuthenticated && (
          <button type="button" onClick={login} className="logInOutBtn btn">
            Submitter Log in
          </button>
        )}
      </span>
    );
  };

  // Function to get current copyright year
  const getCopyrightYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    return year;
  };

  // TODO: Find out how to best do error handling
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-9">
            <p className="footer-content">
              Data Hub designed and maintained by the MoTrPAC BioInformatics
              Center at
              <Link to="https://www.stanford.edu/" target="_new">
                {' '}
                Stanford University
              </Link>
            </p>
            <p className="footer-content">
              Funded by the
              <Link to="https://commonfund.nih.gov/" target="_new">
                {' '}
                NIH Common Fund
              </Link>
            </p>
          </div>
          <div className="col user-login">
            <LoginButton />
          </div>
        </div>
        <div className="row">
          <div className="col copyright">
            <p>
              &#169; Stanford
              &nbsp;
              {getCopyrightYear()}
              &nbsp;Stanford University
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  history: PropTypes.object,
  profile: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
