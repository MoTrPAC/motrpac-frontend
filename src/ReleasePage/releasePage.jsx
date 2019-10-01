import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import ReleaseEntry from './releaseEntry';
import IconSet from '../lib/iconSet';

/**
 * Renders the data release UIs
 *
 * @param {Boolean} isAuthenticated   Redux state for user's authentication status.
 *
 * @returns {object} JSX representation of data release page elements.
 */
export function ReleasePage({
  isPending,
  isAuthenticated,
  profile,
}) {
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
    return (<Redirect to="/" />);
  }

  // Route users to error page if registered users are
  // not allowed to have data access
  if (isAuthenticated) {
    if (!hasAccess) {
      return (<Redirect to="/error" />);
    }
  }

  // Render external release view if user type is 'external'
  if (userType === 'external') {
    return (
      <div className="col-md-9 ml-sm-auto col-lg-10 px-4 dataReleasePage">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
          <div className="page-title" style={{ backgroundImage: `url(${IconSet.InternalDataRelease})` }}>
            <h3>Data Releases</h3>
          </div>
        </div>
        <ReleaseEntry profile={profile} currentView={userType} />
      </div>
    );
  }

  // Render internal release view by default
  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 dataReleasePage">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
        <div className="page-title" style={{ backgroundImage: `url(${IconSet.InternalDataRelease})` }}>
          <h3>Data Releases</h3>
        </div>
        <div className="btn-toolbar">
          <div className="btn-group mr-2" role="group" aria-label="Release button group">
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${currentView === 'internal' ? 'active' : ''}`}
              onClick={handleViewChange.bind(this, 'internal')}
            >
              Internal Release
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${currentView === 'external' ? 'active' : ''}`}
              onClick={handleViewChange.bind(this, 'external')}
            >
              External Release
            </button>
          </div>
          <div className="btn-group" role="group" aria-label="Search button group">
            <Link className="advSearchBtn btn btn-sm btn-outline-primary" to="/search">Search Data</Link>
          </div>
        </div>
      </div>
      <ReleaseEntry profile={profile} currentView={currentView} />
    </div>
  );
}

ReleasePage.propTypes = {
  isPending: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string,
    user_metadata: PropTypes.object,
  }).isRequired,
};

const mapStateToProps = state => ({
  isPending: state.auth.isPending,
  isAuthenticated: state.auth.isAuthenticated,
  profile: state.auth.profile,
});

export default connect(mapStateToProps)(ReleasePage);
