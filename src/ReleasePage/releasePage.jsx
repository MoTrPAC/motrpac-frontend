import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReleaseEntry from './releaseEntry';
import IconSet from '../lib/iconSet';
import EmbargoExtension from '../lib/embargoExtension';

/**
 * Renders the data release UIs
 *
 * @param {Object}  profile Redux state for authenticated user's info.
 *
 * @returns {object} JSX representation of data release page elements.
 */
export function ReleasePage({ profile }) {
  const [currentView, setCurrentView] = useState('internal');

  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Handler to set current view to either internal or external releases
  function handleViewChange(releaseView) {
    setCurrentView(releaseView);
  }

  // Render external release view if user type is 'external'
  if (userType && userType === 'external') {
    return (
      <div className="dataReleasePage external px-3 px-md-4 mb-3 w-100">
        <div className="alert alert-info mb-4" role="alert">
          This is a limited data set from adult rats (6-month old) that
          performed an acute bout of endurance exercise. Please see the{' '}
          <Link to="/data-download">data download page</Link> if you are
          interested in the full experimental data set from endurance trained
          (1wk, 2wks, 4wks or 8wks) compared to untrained adult rats.
        </div>
        <EmbargoExtension />
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4 page-header">
          <div
            className="page-title"
            style={{ backgroundImage: `url(${IconSet.InternalDataRelease})` }}
          >
            <h1>Data Releases</h1>
          </div>
        </div>
        <ReleaseEntry profile={profile} currentView={userType} />
      </div>
    );
  }

  // Render internal release view by default
  return (
    <div className="dataReleasePage internal px-3 px-md-4 mb-3 w-100">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4 page-header">
        <div
          className="page-title"
          style={{ backgroundImage: `url(${IconSet.InternalDataRelease})` }}
        >
          <h1>Data Releases</h1>
        </div>
        <div className="btn-toolbar">
          <div
            className="btn-group"
            role="group"
            aria-label="Release button group"
          >
            <button
              type="button"
              className={`btn btn-outline-primary ${
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
              className={`btn btn-outline-primary ${
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
        </div>
      </div>
      <ReleaseEntry profile={profile} currentView={currentView} />
    </div>
  );
}

ReleasePage.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    user_metadata: PropTypes.object,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.auth.profile,
});

export default connect(mapStateToProps)(ReleasePage);
