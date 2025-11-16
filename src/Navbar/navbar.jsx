import React, { useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import MoTrPAClogo from '../assets/logo-motrpac.png';
import actions from '../Auth/authActions';
import BrowseDataActions from '../BrowseDataPage/browseDataActions';
import DataStatusActions from '../DataStatusPage/dataStatusActions';
import LoginButton from '../lib/loginButton';
import onVisibilityChange from '../lib/utils/pageVisibility';
import { getDataVizURL } from '../lib/utils/dataVizUrl';

import '@styles/navbar.scss';

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
  profile = {},
  isAuthenticated = false,
  login = null,
  logout = null,
  resetBrowseState = null,
  handleQCDataFetch = null,
  lastModified = '',
}) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isHomepage = currentPath === '/';

  if (isHomepage) {
    document.querySelector('body').classList.add('homepage');
  } else {
    document.querySelector('body').classList.remove('homepage');
  }

  useEffect(() => {
    /* Handle logout for various use cases */
    const storedExpiresAt = localStorage.getItem('expires_at');
    const expiresAt = storedExpiresAt ? JSON.parse(storedExpiresAt) : null;
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
        false,
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
  const userRole = profile.app_metadata && profile.app_metadata.role;

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
    import.meta.env.DEV
      ? import.meta.env.VITE_API_SERVICE_ADDRESS_DEV
      : import.meta.env.VITE_API_SERVICE_ADDRESS;
  const endpointRegUser = import.meta.env.VITE_USER_REGISTRATION_ENDPOINT;
  const endpointSendEmail = import.meta.env.VITE_SEND_EMAIL_ENDPOINT;
  const key =
    import.meta.env.DEV
      ? import.meta.env.VITE_API_SERVICE_KEY_DEV
      : import.meta.env.VITE_API_SERVICE_KEY;

  // Send GET request to endpoint to 'warm up' CF backend service
  function checkServiceStatus(e) {
    if (e.target.id === 'reg_user') {
      return axios
        .get(`${api}${endpointRegUser}/info?key=${key}`)
        .then((res) => {
          console.log(res.status);
        });
    }
    return axios
      .get(`${api}${endpointSendEmail}/info?key=${key}`)
      .then((res) => {
        console.log(res.status);
      });
  }

  const navbar = (
    <div className="header-navbar-container d-flex flex-md-row flex-sm-row flex-xs-row align-items-center px-3 px-md-4 bg-white border-bottom shadow-sm fixed-top">
      <div className="navbar-brand my-0 mr-md-auto mr-sm-auto mr-xs-auto py-0">
        <Link to="/" className="header-logo">
          <img default src={MoTrPAClogo} alt="MoTrPAC Data Hub" />
        </Link>
      </div>
      <nav className="navbar navbar-expand-xl navbar-light my-md-0 mr-md-3 mr-sm-3 mr-xs-2 p-0">
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
              {isAuthenticated && hasAccess && (
                <li className="nnav-item navItem">
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
              )}
              <li className="nnav-item navItem">
                <Link to="/data-download" className="nav-link">
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
                    href={getDataVizURL('rat-training-06')}
                    className="dropdown-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Interactive Data Visualization
                  </a>
                  {isAuthenticated && hasAccess && (userType === 'internal' || (userRole && userRole === 'reviewer')) && (
                    <a
                      href={getDataVizURL('human-precovid')}
                      className="dropdown-item"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Human Data Visualization
                    </a>
                  )}
                  {isAuthenticated && hasAccess && userType === 'internal' && (
                    <Link to="/analysis-phenotype" className="dropdown-item">
                      Phenotype
                    </Link>
                  )}
                </div>
              </li>
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
                  <Link to="/data-download" className="dropdown-item">
                    {isAuthenticated && hasAccess && userType === 'internal'
                      ? 'Rat and Human Data'
                      : 'Endurance Training Data'}
                  </Link>
                  <Link
                    id="reg_user"
                    to={
                      isAuthenticated && hasAccess
                        ? '/releases'
                        : '/data-access'
                    }
                    className="dropdown-item"
                    onClick={(e) => checkServiceStatus(e)}
                  >
                    Limited Acute Exercise Data
                  </Link>
                  <Link to="/data-deposition" className="dropdown-item">
                    Public Data Repositories
                  </Link>
                  {!userType || (userType && userType !== 'internal') ? (
                    <a
                      href={import.meta.env.VITE_DATA_UPDATES_SIGNUP_URL}
                      className="dropdown-item"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Data Updates Signup
                    </a>
                  ) : null}
                  {isAuthenticated && hasAccess ? (
                    <>
                      {userType === 'internal' && (
                        <Link
                          to="/qc-data-monitor"
                          className="dropdown-item"
                          onClick={fecthQCData}
                        >
                          QC Data Monitor
                        </Link>
                      )}
                      <Link to="/summary" className="dropdown-item">
                        Sample Summary
                      </Link>
                      <Link to="/releases" className="dropdown-item">
                        Prior Data Releases
                      </Link>
                    </>
                  ) : null}
                </div>
              </li>
              <li className="nav-item navItem dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  role="button"
                  id="resourcesNavbarItemMenuLink"
                  data-toggle="dropdown"
                >
                  Resources
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="resourcesNavbarItemMenuLink"
                >
                  <Link to="/publications" className="dropdown-item">
                    Publications
                  </Link>
                  <Link to="/code-repositories" className="dropdown-item">
                    Code Repositories
                  </Link>
                  <Link to="/methods" className="dropdown-item">
                    Methods
                  </Link>
                  <Link to="/related-studies" className="dropdown-item">
                    Related Studies
                  </Link>
                  <a
                    href="https://omicspipelines.org/"
                    className="dropdown-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    OmicsPipelines
                  </a>
                  <a
                    href="https://community.motrpac-data.org/"
                    className="dropdown-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Community
                  </a>
                </div>
              </li>
              <li className="nav-item navItem dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  role="button"
                  id="helpNavbarItemMenuLink"
                  data-toggle="dropdown"
                >
                  Learn
                </div>
                <div
                  className="dropdown-menu"
                  aria-labelledby="helpNavbarItemMenuLink"
                >
                  <Link to="/project-overview" className="dropdown-item">
                    Project Overview
                  </Link>
                  <Link to="/exercise-benefits" className="dropdown-item">
                    Exercise Benefits
                  </Link>
                  <Link to="/study-assays" className="dropdown-item">
                    Study Assays
                  </Link>
                  <Link to="/tutorials" className="dropdown-item">
                    Tutorials
                  </Link>
                  <Link to="/glossary" className="dropdown-item">
                    Glossary
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
                  <Link to="/license" className="dropdown-item">
                    License
                  </Link>
                  <Link to="/citation" className="dropdown-item">
                    Cite Us
                  </Link>
                  <Link
                    id="send_email"
                    to="/contact"
                    className="dropdown-item"
                    onClick={(e) => checkServiceStatus(e)}
                  >
                    Contact Us
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
      userType: PropTypes.string,
    }),
    app_metadata: PropTypes.shape({
      role: PropTypes.string,
    }),
  }),
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func,
  logout: PropTypes.func,
  resetBrowseState: PropTypes.func,
  handleQCDataFetch: PropTypes.func,
  lastModified: PropTypes.string,
};

const mapStateToProps = (state) => ({
  ...state.quickSearch,
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
  lastModified: state.dataStatus.qcData.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
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
  const userEmail = profile.user_metadata && profile.user_metadata.email;

  if (isAuthenticated) {
    return (
      <div className="user-logout-button dropdown">
        <button
          type="button"
          className="btn dropdown-toggle px-0 py-0"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          <img src={profile.picture} className="user-avatar" alt="avatar" />
        </button>
        <div className="user-logout-dropdown dropdown-menu dropdown-menu-right">
          <ul>
            <li className="user-display-name">{userDisplayName}</li>
            <li className="user-email">{userEmail}</li>
          </ul>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="logOutBtn btn btn-primary"
        >
          Log out
        </button>
      </div>
    );
  }

  return <LoginButton login={login} />;
}
