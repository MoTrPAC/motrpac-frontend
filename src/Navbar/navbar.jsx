import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import actions from '../Auth/authActions';
import LoginButton from '../lib/loginButton';
import MoTrPAClogo from '../assets/logo-motrpac.png';
import onVisibilityChange from '../lib/utils/pageVisibility';
import BrowseDataActions from '../BrowseDataPage/browseDataActions';
import DataStatusActions from '../DataStatusPage/dataStatusActions';

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
export function Navbar({
  isAuthenticated,
  profile,
  login,
  logout,
  handleDataFetch,
  resetBrowseState,
  handleQCDataFetch,
  allFiles,
  lastModified,
}) {
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
    // delay state reset so that list files do not
    // disappear from the UI prior to page change
    setTimeout(() => {
      resetBrowseState();
    }, 1000);
  };

  const handleLogIn = () => {
    login();
    // delay state reset so that list files do not
    // disappear from the UI prior to page change
    setTimeout(() => {
      resetBrowseState();
    }, 1000);
  };

  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // post request to fetch data files when download nav link is clicked
  const handleDataObjectFetch = () => {
    if (!allFiles.length) {
      if (userType && userType === 'internal') {
        handleDataFetch();
      } else {
        handleDataFetch('PASS1B-06');
      }
    }
  };

  // Call to invoke Redux action to fetch QC data
  // if timestamp is empty or older than 24 hours
  const fecthQCData = () => {
    if (
      !lastModified ||
      !lastModified.length ||
      (lastModified.length && dayjs().diff(dayjs(lastModified), 'hour') >= 24)
    ) {
      handleQCDataFetch();
    }
  };

  const api =
    process.env.NODE_ENV !== 'production'
      ? process.env.REACT_APP_API_SERVICE_ADDRESS_DEV
      : process.env.REACT_APP_API_SERVICE_ADDRESS;
  const endpoint = process.env.REACT_APP_USER_REGISTRATION_ENDPOINT;
  const key =
    process.env.NODE_ENV !== 'production'
      ? process.env.REACT_APP_API_SERVICE_KEY_DEV
      : process.env.REACT_APP_API_SERVICE_KEY;

  const checkServiceStatus = () => {
    return axios.get(`${api}${endpoint}/info?key=${key}`).then((res) => {
      console.log(res.status);
    });
  };

  const navbar = (
    <div className="header-navbar-container fixed-top d-flex flex-column flex-md-row align-items-center px-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <Link to="/" className="navbar-brand header-logo my-0 mr-md-auto py-0">
        <img default src={MoTrPAClogo} alt="MoTrPAC Data Hub" />
      </Link>
      <nav className="navbar navbar-expand-lg navbar-light my-md-0 mr-md-3 p-0">
        <div className="header-navbar-items">
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
              <li className="nnav-item navItem">
                <Link
                  to="/data-download"
                  className="nav-link"
                  onClick={handleDataObjectFetch}
                >
                  Downloads
                </Link>
              </li>
              <li className="nnav-item navItem dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  role="button"
                  id="exploreNavbarItemMenuLink"
                  data-toggle="dropdown"
                >
                  Explore
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="exploreNavbarItemMenuLink"
                >
                  <Link to="/search" className="dropdown-item">
                    Differential Abundance
                  </Link>
                  <Link to="/gene-centric" className="dropdown-item">
                    Gene-centric View
                  </Link>
                  <Link to="/graphical-clustering" className="dropdown-item">
                    Graphical Clustering
                  </Link>
                  <a
                    href="https://data-viz.motrpac-data.org"
                    className="dropdown-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Interactive Data Visualization
                  </a>
                  {isAuthenticated && hasAccess && userType === 'internal' ? (
                    <Link to="/analysis-phenotype" className="dropdown-item">
                      Phenotype
                    </Link>
                  ) : null}
                </div>
              </li>
              {isAuthenticated && hasAccess ? (
                <>
                  <li className="nav-item navItem">
                    <Link to="/summary" className="nav-link">
                      Summary
                    </Link>
                  </li>
                  <li className="nav-item navItem">
                    <Link to="/releases" className="nav-link">
                      Releases
                    </Link>
                  </li>
                </>
              ) : null}
              {isAuthenticated && hasAccess && userType === 'internal' ? (
                <li className="nav-item navItem">
                  <Link
                    to="/qc-data-monitor"
                    className="nav-link"
                    onClick={fecthQCData}
                  >
                    QC Data Monitor
                  </Link>
                </li>
              ) : null}
              {!isAuthenticated && !hasAccess ? (
                <li className="nav-item navItem dropdown">
                  <div
                    className="nav-link dropdown-toggle"
                    role="button"
                    id="dataAccessNavbarItemMenuLink"
                    data-toggle="dropdown"
                  >
                    Data Access
                  </div>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dataAccessNavbarItemMenuLink"
                  >
                    <Link
                      to="/data-download"
                      className="dropdown-item"
                      onClick={handleDataObjectFetch}
                    >
                      Endurance Training Data
                    </Link>
                    <Link
                      to="/data-access"
                      className="dropdown-item"
                      onClick={checkServiceStatus}
                    >
                      Limited Acute Exercise Data
                    </Link>
                  </div>
                </li>
              ) : null}
              <li className="nav-item navItem dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  role="button"
                  id="aboutNavbarItemMenuLink"
                  data-toggle="dropdown"
                >
                  Resources
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="aboutNavbarItemMenuLink"
                >
                  <Link to="/code-repositories" className="dropdown-item">
                    Code Repositories
                  </Link>
                  <Link to="/methods" className="dropdown-item">
                    Methods
                  </Link>
                  <Link to="/related-studies" className="dropdown-item">
                    Related Studies
                  </Link>
                </div>
              </li>
              <li className="nav-item navItem dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  role="button"
                  id="aboutNavbarItemMenuLink"
                  data-toggle="dropdown"
                >
                  Help
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="aboutNavbarItemMenuLink"
                >
                  <Link to="/project-overview" className="dropdown-item">
                    Project Overview
                  </Link>
                  <Link to="/tutorials" className="dropdown-item">
                    Tutorials
                  </Link>
                  <Link to="/contact" className="dropdown-item">
                    Contact Us
                  </Link>
                </div>
              </li>
              <li className="nav-item navItem dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  role="button"
                  id="aboutNavbarItemMenuLink"
                  data-toggle="dropdown"
                >
                  About
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="aboutNavbarItemMenuLink"
                >
                  <Link to="/team" className="dropdown-item">
                    Who we are
                  </Link>
                  <Link to="/announcements" className="dropdown-item">
                    Announcements
                  </Link>
                  <Link to="/external-links" className="dropdown-item">
                    Useful Links
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <LogoutButton
        isAuthenticated={isAuthenticated}
        profile={profile}
        handleLogout={handleLogout}
        login={handleLogIn}
      />
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
  handleDataFetch: PropTypes.func,
  resetBrowseState: PropTypes.func,
  handleQCDataFetch: PropTypes.func,
  lastModified: PropTypes.string,
};

Navbar.defaultProps = {
  profile: {},
  isAuthenticated: false,
  login: null,
  logout: null,
  handleDataFetch: null,
  resetBrowseState: null,
  handleQCDataFetch: null,
  lastModified: '',
};

const mapStateToProps = (state) => ({
  ...state.quickSearch,
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
  allFiles: state.browseData.allFiles,
  lastModified: state.dataStatus.qcData.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
  handleDataFetch: (phase) =>
    dispatch(BrowseDataActions.handleDataFetch(phase)),
  resetBrowseState: () => dispatch(BrowseDataActions.resetBrowseState()),
  handleQCDataFetch: () => dispatch(DataStatusActions.fetchData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

// Function to render login button
function LogoutButton({ profile, isAuthenticated, handleLogout, login }) {
  const userDisplayName =
    profile.user_metadata && profile.user_metadata.name
      ? profile.user_metadata.name
      : profile.name;

  if (isAuthenticated) {
    return (
      <span className="user-logout-button">
        <img src={profile.picture} className="user-avatar" alt="avatar" />
        <span className="user-display-name">{userDisplayName}</span>
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
