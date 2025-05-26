import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FeatureLinks from '../Search/featureLinks';
import DataStatusActions from '../DataStatusPage/dataStatusActions';

import '@styles/dashboard.scss';

/**
 * Renders the Dashboard page.
 *
 * @param {Object} profile  Redux state of authenticated user profile
 *
 * @returns {object} JSX representation of the Dashboard
 */
export function Dashboard({ profile, handleQCDataFetch, lastModified }) {
  const userType = profile.user_metadata && profile.user_metadata.userType;

  return (
    <div className="dashboardPage px-3 px-md-4 mb-3">
      <Helmet>
        <html lang="en" />
        <title>Dashboard - MoTrPAC Data Hub</title>
      </Helmet>
      {userType && userType === 'internal' && (
        <div className="jumbotron jumbotron-fluid alert-data-release">
          <div className="container">
            <h1 className="office-hour-title display-2">
              <i className="bi bi-rocket-takeoff mr-3" />
              <span>It's here!</span>
            </h1>
            <div className="w-100 lead">
              <span className="data-release-text">
                The pre-COVID human sedentary adults dataset is now available to consortium
                users. You may
                {' '}
                <Link to="/data-download">download them</Link>
                {' '}
                or
                {' '}
                <Link to="/search">explore the differential abundance</Link>
                {' '}
                in the dataset. Please refer to the
                {' '}
                <a href={process.env.REACT_APP_DATA_RELEASE_README} target="_blank" rel="noopener noreferrer">
                  Consortium Release document
                </a>
                {' '}
                for more information on this dataset.
              </span>
            </div>
          </div>
        </div>
      )}
      {userType && userType === 'external' && (
        <div className="alert-data-release">
          <h1 className="office-hour-title display-4 mb-4">
            <span>
              Welcome,
              {' '}
              {profile.user_metadata.givenName}
            </span>
          </h1>
        </div>
      )}
      <div className="w-100">
        {userType && (
          <FeatureLinks
            handleQCDataFetch={handleQCDataFetch}
            lastModified={lastModified}
            userType={userType}
          />
        )}
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  handleQCDataFetch: PropTypes.func.isRequired,
  lastModified: PropTypes.string,
};

Dashboard.defaultProps = {
  profile: {},
  lastModified: '',
};

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.dashboard,
  lastModified: state.dataStatus.qcData.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
  handleQCDataFetch: () => dispatch(DataStatusActions.fetchData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
