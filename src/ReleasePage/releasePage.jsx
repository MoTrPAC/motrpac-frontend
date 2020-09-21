import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import ReleaseEntry from './releaseEntry';
import IconSet from '../lib/iconSet';
import AuthContentContainer from '../lib/ui/authContentContainer';

/**
 * Renders the data release UIs
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Object}  profile         Redux state for authenticated user's info.
 *
 * @returns {object} JSX representation of data release page elements.
 */
export function ReleasePage({ isPending, isAuthenticated, profile, expanded }) {
  const [currentView, setCurrentView] = useState('internal');

  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Handler to set current view to either internal or external releases
  function handleViewChange(releaseView) {
    setCurrentView(releaseView);
  }

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

  // Route users back to homepage if not authenticated
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  // Route users to error page if registered users are
  // not allowed to have data access
  if (isAuthenticated) {
    if (!hasAccess) {
      return <Redirect to="/error" />;
    }
  }

  // Render external release view if user type is 'external'
  if (userType === 'external') {
    return (
      <AuthContentContainer
        classes="dataReleasePage external"
        expanded={expanded}
      >
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
          <div
            className="page-title"
            style={{ backgroundImage: `url(${IconSet.InternalDataRelease})` }}
          >
            <h3>Data Releases</h3>
          </div>
        </div>
        <ReleaseEntry profile={profile} currentView={userType} />
      </AuthContentContainer>
    );
  }

  // Render internal release view by default
  return (
    <AuthContentContainer
      classes="dataReleasePage internal"
      expanded={expanded}
    >
      <p
        className="alert alert-info alert-dismissible fade show warning-note d-flex align-items-center"
        role="alert"
      >
        <span className="material-icons">info</span>
        <span className="warning-note-text">
          {' '}
          Some features are unavailable to smaller mobile device screens.
        </span>
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </p>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
        <div
          className="page-title"
          style={{ backgroundImage: `url(${IconSet.InternalDataRelease})` }}
        >
          <h3>Data Releases</h3>
        </div>
        <div className="btn-toolbar">
          <div
            className="btn-group mr-2"
            role="group"
            aria-label="Release button group"
          >
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${
                currentView === 'internal' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'internal')}
            >
              <span className="d-flex align-items-center">
                <i className="material-icons internal-icon">person</i>
                Internal Release
              </span>
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${
                currentView === 'external' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'external')}
            >
              <span className="d-flex align-items-center">
                <i className="material-icons external-icon">people_alt</i>
                External Release
              </span>
            </button>
          </div>
          <div
            className="btn-group"
            role="group"
            aria-label="Search button group"
          >
            <Link
              className="advSearchBtn btn btn-sm btn-outline-primary"
              to="/search"
            >
              <span className="d-flex align-items-center">
                <i className="material-icons search-icon">search</i>
                Search Data
              </span>
            </Link>
          </div>
        </div>
      </div>
      <ReleaseEntry profile={profile} currentView={currentView} />
    </AuthContentContainer>
  );
}

ReleasePage.propTypes = {
  isPending: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    user_metadata: PropTypes.object,
  }).isRequired,
  expanded: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isPending: state.auth.isPending,
  isAuthenticated: state.auth.isAuthenticated,
  profile: state.auth.profile,
  expanded: state.sidebar.expanded,
});

export default connect(mapStateToProps)(ReleasePage);
