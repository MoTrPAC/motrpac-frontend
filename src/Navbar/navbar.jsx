import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import actions from '../Auth/authActions';
import LoginButton from '../lib/loginButton';
import MoTrPAClogo from '../assets/logo-motrpac.png';
import onVisibilityChange from '../lib/utils/pageVisibility';

/**
 * Renders the global header nav bar.
 *
 * @param {Boolean}   isAuthenticated Redux state for user's authentication status.
 * @param {Object}    profile         Redux state for authenticated user's info.
 * @param {Function}  login           Redux action for user login.
 * @param {Function}  logout          Redux action for user logout.
 *
 * @returns {Object} JSX representation of the global header nav bar.
 */
export function Navbar({ isAuthenticated, profile, login, logout }) {
  useEffect(() => {
    /* Handle logout for various use cases */
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    let expirationCheckInterval;
    const intervalLength = 2 * 60 * 60 * 1000;

    // Check expiration and determine whether logout is needed
    const handleExpiration = () => {
      if (isAuthenticated && expiresAt <= new Date().getTime()) {
        logout();
        clearInterval(expirationCheckInterval);
      }
    };

    // Check periodically to logout user if expiration is due
    const checkExpirationInterval = () => {
      if (isAuthenticated && expiresAt !== undefined && expiresAt !== null) {
        expirationCheckInterval = setInterval(() => {
          handleExpiration();
        }, intervalLength);
      }
    };

    // Check local storage item and log out if absent
    const handleStorageChange = () => {
      if (isAuthenticated && !localStorage.getItem('expires_at')) logout();
    };

    const { hidden, visibilityChange } = onVisibilityChange();
    const handleVisibilityChange = () => {
      if (!document[hidden]) {
        handleExpiration();
      }
    };

    // Use case 1: schedule expiration check interval
    checkExpirationInterval();
    // Use case 2: check expiration when window/tab becomes visibile
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
    // Use case 3: log out all windows/tabs in which user had been authenticated
    // if the user has signed out from any one of the windows/tabs
    window.addEventListener('storage', handleStorageChange, false);
    return () => {
      // Clean up when component unmounts
      clearInterval(expirationCheckInterval);
      document.removeEventListener(
        visibilityChange,
        handleVisibilityChange,
        false
      );
      window.removeEventListener('storage', handleStorageChange, false);
    };
  });

  const handleLogout = () => {
    logout();
  };

  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;

  if (isAuthenticated && hasAccess) {
    document.querySelector('body').classList.add('authenticated');
  }

  const api =
    process.env.NODE_ENV !== 'production'
      ? process.env.REACT_APP_API_SERVICE_ADDRESS_DEV
      : process.env.REACT_APP_API_SERVICE_ADDRESS;
  const endpoint = process.env.REACT_APP_USER_REGISTRATION_ENDPOINT;
  const key =
    process.env.NODE_ENV !== 'production'
      ? process.env.REACT_APP_API_SERVICE_KEY_DEV
      : process.env.REACT_APP_API_SERVICE_KEY;

  function checkServiceStatus() {
    return axios.get(`${api}${endpoint}/info?key=${key}`).then((res) => {
      console.log(res.status);
    });
  }

  const navbar = (
    <div className="header-navbar-container fixed-top">
      <nav className="navbar navbar-expand-lg navbar-light flex-md-nowrap p-0 shadow-sm bg-white">
        <div
          className={`${
            isAuthenticated && hasAccess ? 'container-fluid' : 'container'
          } header-navbar-items`}
        >
          <Link
            to="/"
            className={`navbar-brand header-logo ${
              isAuthenticated && hasAccess ? 'resized' : ''
            }`}
          >
            <img default src={MoTrPAClogo} alt="MoTrPAC Data Hub" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse flex-row-reverse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav">
              <li className="nav-item navItem dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  role="button"
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                >
                  About Us
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Link to="/announcements" className="dropdown-item">
                    Announcements
                  </Link>
                  <Link to="/external-links" className="dropdown-item">
                    Useful Links
                  </Link>
                  <Link to="/team" className="dropdown-item">
                    Who we are
                  </Link>
                  <Link to="/contact" className="dropdown-item">
                    Contact Us
                  </Link>
                </div>
              </li>
              {!isAuthenticated && !hasAccess ? (
                <>
                  <li className="nav-item navItem">
                    <Link
                      to="/data-access"
                      className="nav-link"
                      onClick={checkServiceStatus}
                    >
                      Data Access
                    </Link>
                  </li>
                  <li className="nav-item navItem">
                    <Link to="/related-studies" className="nav-link">
                      Related Studies
                    </Link>
                  </li>
                </>
              ) : null}
              <li className="nav-item navItem">
                <LogoutButton
                  isAuthenticated={isAuthenticated}
                  profile={profile}
                  handleLogout={handleLogout}
                  login={login}
                />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
  return navbar;
}

Navbar.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    picture: PropTypes.string,
    user_metadata: PropTypes.shape({
      hasAccess: PropTypes.bool,
      name: PropTypes.string,
      siteName: PropTypes.string,
    }),
  }),
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func,
  logout: PropTypes.func,
};

Navbar.defaultProps = {
  profile: {},
  isAuthenticated: false,
  login: null,
  logout: null,
};

const mapStateToProps = (state) => ({
  ...state.quickSearch,
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

// Function to render login button
function LogoutButton({ profile, isAuthenticated, handleLogout, login }) {
  const userDisplayName =
    profile.user_metadata && profile.user_metadata.name
      ? profile.user_metadata.name
      : profile.name;
  const siteName =
    profile.user_metadata && profile.user_metadata.siteName
      ? `, ${profile.user_metadata.siteName}`
      : '';

  if (isAuthenticated) {
    return (
      <span className="user-logout-button">
        <img src={profile.picture} className="user-avatar" alt="avatar" />
        <span className="user-display-name">
          {userDisplayName}
          {siteName}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="logOutBtn btn btn-primary"
        >
          Log out
        </button>
      </span>
    );
  }

  return <LoginButton login={login} />;
}
