import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ContactHelpdesk from '../lib/ui/contactHelpdesk';

import '@styles/errorPage.scss'

/**
 * Renders the Error page.
 *
 * @returns {Object} JSX representation of the Error page.
 */
export function ErrorPage({ isAuthenticated = {}, profile = false }) {
  if (isAuthenticated && profile.user_metadata) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="col-md-9 col-lg-10 px-4 errorPage">
      <div className="container">
        <div className="page-title pt-5 pb-3">
          <h3>Authorized MoTrPAC Members Only</h3>
        </div>
        <div className="contact-content-container">
          <div className="alert alert-warning">
            <p>
              You have reached this page because you are not identified as a
              registered user in our system.
            </p>
            <p>
              <i className="material-icons internal-icon">person</i>
              <strong>MoTrPAC consortium members:</strong>
              {' '}
              If this is your first time attempting to log in, please
              {' '}
              <ContactHelpdesk />
              {' '}
              and verify your access to the portal.
            </p>
            <p>
              <i className="material-icons external-icon">people_alt</i>
              <strong>Users who are not MoTrPAC consortium members:</strong>
              {' '}
              To access the MoTrPAC Data Hub portal, please read and sign the data use
              agreement, as well as complete the new user registration by visiting our
              {' '}
              <a href="/data-access">Data Access</a>
              {' '}
              page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ErrorPage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  ...state.auth,
});

export default connect(mapStateToProps)(ErrorPage);
