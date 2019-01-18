import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../Auth/authActions';

/**
 * Method to render global footer
 */
export function Footer({
  isAuthenticated,
  profile,
  login,
  logout,
}) {
  const userGivenName = profile.user_metadata && profile.user_metadata.givenName ? profile.user_metadata.givenName : profile.name;
  const handleLogout = () => {
    logout();
    return <Redirect to="/" />;
  };
  // Function to render login button
  const LoginButton = () => {
    return (
      <span className="user-login-button">
        {isAuthenticated && (
          <span>
            <img src={profile.picture} className="user-avatar" alt="avatar" />
            <button type="button" onClick={handleLogout} className="logInOutBtn btn">
              {userGivenName}
              &nbsp;Logout
            </button>
          </span>
        )}
        {!isAuthenticated && (
          <button type="button" onClick={login} className="logInOutBtn btn">
            Submitter Login
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
              <a href="https://www.stanford.edu/" target="_blank" rel="noopener noreferrer">
                {' '}
                Stanford University
              </a>
            </p>
            <p className="footer-content">
              Funded by the
              <a href="https://commonfund.nih.gov/" target="_blank" rel="noopener noreferrer">
                {' '}
                NIH Common Fund
              </a>
            </p>
          </div>
          <div className="col user-login">
            <LoginButton />
          </div>
        </div>
        <div className="row">
          <div className="col copyright">
            <p>
              &#169;
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
  profile: PropTypes.shape({
    name: PropTypes.string,
    nickname: PropTypes.string,
    email: PropTypes.string,
    picture: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

Footer.defaultProps = {
  profile: {},
  isAuthenticated: false,
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
