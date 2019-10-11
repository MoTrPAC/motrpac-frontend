import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the new user registration response page
 *
 * @param {String} status Auth0 post request response status passed from parent
 *
 * @returns {object} JSX representation of the registration response page
 */
function RegistrationResponse({ status }) {
  // Render error message if the Auth0 post request fails
  if (status === 'error' || status === 'internal-error') {
    return (
      <React.Fragment>
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>Registration Incomplete</h3>
        </div>
        <div className="data-access-content">
          <p>
            An error occurred in the registration process.
            Please contact&nbsp;
            <a href="mailto:motrpac-helpdesk@lists.stanford.edu" className="inline-link-with-icon">
              motrpac-helpdesk@lists.stanford.edu
              <i className="material-icons email-icon">mail</i>
            </a>
            &nbsp;to report this problem.
          </p>
        </div>
      </React.Fragment>
    );
  }

  // Render success message upon creating user's Auth0 account
  return (
    <React.Fragment>
      <div className="page-title pt-3 pb-2 border-bottom">
        <h3>Registration Completed</h3>
      </div>
      <div className="data-access-content">
        <p>
          Thank you for registering! A verification email has been sent to you from
          Auth0, our authentication service provider. Upon the verification, a
          password reset email will be sent to you from Auth0. You will then be
          able to access the released MoTrPAC data after completing these step.
          If you have further questions regarding the registration, please contact&nbsp;
          <a href="mailto:motrpac-helpdesk@lists.stanford.edu" className="inline-link-with-icon">
            motrpac-helpdesk@lists.stanford.edu
            <i className="material-icons email-icon">mail</i>
          </a>
        </p>
      </div>
    </React.Fragment>
  );
}

RegistrationResponse.propTypes = {
  status: PropTypes.string,
};

RegistrationResponse.defaultProps = {
  status: null,
};

export default RegistrationResponse;
