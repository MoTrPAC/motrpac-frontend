import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FeatureLinks from '../Search/featureLinks';
import DataStatusActions from '../DataStatusPage/dataStatusActions';

import '@styles/dashboard.scss';

/**
 * Renders the Dashboard page
 *
 * @param {Object} profile  Redux state of authenticated user profile
 *
 * @returns {object} JSX representation of the Dashboard
 */
export function Dashboard({ 
  profile = {}, 
  handleQCDataFetch, 
  lastModified = '',
}) {
  const userType = profile.user_metadata && profile.user_metadata.userType;
  const userRole = profile.app_metadata && profile.app_metadata.role;

  return (
    <div className="dashboardPage px-3 px-md-4 mb-3">
      <Helmet>
        <html lang="en" />
        <title>Dashboard - MoTrPAC Data Hub</title>
      </Helmet>

      {userType && userType === 'internal' && (
        <div className="jumbotron jumbotron-fluid alert-data-release">
          <div className="container">
            <h1 className="highlight-title display-1 text-center mb-4">
              <i className="bi bi-rocket-takeoff mr-3" />
              <span>Available Now!</span>
            </h1>
            <div className="row">
              <div className="col-md-6 lead d-flex align-items-start">
                <div className="data-release-icon mr-2">
                  <span className="material-icons">
                    person
                  </span>
                </div>
                <div className="data-release-icon mr-1">
                  <span className="data-release-text">
                    The pre-COVID human sedentary adults dataset has been made available
                    to consortium users. You may
                    {' '}
                    <Link to="/data-download">download them</Link>
                    {' '}
                    or
                    {' '}
                    <Link to="/search">explore the differential abundance</Link>
                    {' '}
                    in the dataset. Please refer to the
                    {' '}
                    <a href={import.meta.env.VITE_DATA_RELEASE_README} target="_blank" rel="noopener noreferrer">
                      Consortium Release document
                    </a>
                    {' '}
                    for more information on this dataset.
                  </span>
                </div>
              </div>
              <div className="col-md-6 lead d-flex align-items-start">
                <div className="data-release-icon mr-2">
                  <span className="material-icons">
                    pest_control_rodent
                  </span>
                </div>
                <div className="data-release-icon mr-1">
                  <span className="data-release-text">
                    The consortium release of young adult rats acute exercise data is also
                    accessible now. Users may
                    {' '}
                    <Link to="/data-download">download them</Link>
                    {' '}
                    or
                    {' '}
                    <Link to="/search">explore the differential abundance</Link>
                    {' '}
                    in the dataset. Please refer to the
                    {' '}
                    <a href="https://docs.google.com/document/d/1PlWzZ6SPMX7SeW8TxeDKEfnACrG2YOiZclDsw2UBs84/edit?tab=t.0#heading=h.nizg0n7kpig1" target="_blank" rel="noopener noreferrer">
                      Consortium Release document
                    </a>
                    {' '}
                    for more information on this dataset.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {userType && userType === 'external' && !userRole && (
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
      {/* Welcome message for external users with reviewer role */}
      {userType && userType === 'external' && userRole && userRole === 'reviewer' && (
        <div className="alert-data-release">
          <h1 className="office-hour-title display-4 mb-4">
            <span>
              {`Hi there, ${profile.user_metadata.name}!`}
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
            userRole={userRole ? userRole : '' }
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

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.dashboard,
  lastModified: state.dataStatus.qcData.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
  handleQCDataFetch: () => dispatch(DataStatusActions.fetchData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
