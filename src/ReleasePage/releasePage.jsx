import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReleaseEntry from './releaseEntry';
import IconSet from '../lib/iconSet';

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
        <div
          className="alert alert-warning alert-dismissible fade show d-flex align-items-center justify-content-between w-100"
          role="alert"
        >
          <span>
            Please note that the publication embargo on MoTrPAC data has been
            extended until release of additional control data. The control data
            has been delayed due to the COVID-19 pandemic and we apologize for
            any inconvenience caused.
          </span>
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
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
