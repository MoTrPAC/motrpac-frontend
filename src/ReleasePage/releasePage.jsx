import React from 'react';
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
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;

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

  // Send users back to homepage if not authenticated
  if (!isAuthenticated) {
    return (<Redirect to="/" />);
  }

  if (isAuthenticated) {
    if (!hasAccess) {
      return (<Redirect to="/error" />);
    }
  }

  // Render advanced search form by default
  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 dataReleasePage">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
        <div className="page-title" style={{ backgroundImage: `url(${IconSet.InternalDataRelease})` }}>
          <h3>Data Releases</h3>
        </div>
        <div className="btn-toolbar">
          <div className="btn-group">
            {/* <Link className="browseDataBtn btn btn-sm btn-outline-primary" to="/download">Browse Data</Link> */}
            <Link className="advSearchBtn btn btn-sm btn-outline-primary" to="/search">Search Data</Link>
          </div>
        </div>
      </div>
      <ReleaseEntry profile={profile} />
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
