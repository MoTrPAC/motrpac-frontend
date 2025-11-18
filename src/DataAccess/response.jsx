import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the new user registration response page
 *
 * @param {String} status Auth0 post request response status passed from parent
 *
 * @returns {object} JSX representation of the registration response page
 */
function RegistrationResponse({ status = null, errMsg = null }) {
  // Render Auth0-specific 'user already exists' message
  function renderAuth0Error() {
    return (
      <p>
        User already exists. Please contact&nbsp;
        <a
          href="mailto:motrpac-helpdesk@lists.stanford.edu"
          className="inline-link-with-icon"
        >
          motrpac-helpdesk@lists.stanford.edu
          <i className="material-icons email-icon">mail</i>
        </a>
        &nbsp;if you believe this is incorrect.
      </p>
    );
  }

  // Render generic message
  function renderGenericError() {
    return (
      <p>
        An error occurred in the registration process. Please contact&nbsp;
        <a
          href="mailto:motrpac-helpdesk@lists.stanford.edu"
          className="inline-link-with-icon"
        >
          motrpac-helpdesk@lists.stanford.edu
          <i className="material-icons email-icon">mail</i>
        </a>
        &nbsp;to report this problem.
      </p>
    );
  }

  // Render error message if the Auth0 post request fails
  if (status === 'error' || status === 'internal-error') {
    return (
      <>
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>Registration Incomplete</h3>
        </div>
        <div className="data-access-content">
          {errMsg && errMsg === 'user already exists'
            ? renderAuth0Error()
            : renderGenericError()}
        </div>
      </>
    );
  }

  // Render success message upon creating user's Auth0 account
  return (
    <>
      <div className="page-title pt-3 pb-2 border-bottom">
        <h3>Registration Completed</h3>
      </div>
      <div className="data-access-content">
        <p>
          Thank you for registering! An email has been sent to you from MoTrPAC
          requesting you to set up your password. You will also be receiving a
          confirmation email with the data use terms you consented to. You will
          be able to access the released MoTrPAC data upon setting up your
          password. If you have further questions regarding the registration,
          please contact&nbsp;
          <a
            href="mailto:motrpac-helpdesk@lists.stanford.edu"
            className="inline-link-with-icon"
          >
            motrpac-helpdesk@lists.stanford.edu
            <i className="material-icons email-icon">mail</i>
          </a>
        </p>
      </div>
    </>
  );
}

RegistrationResponse.propTypes = {
  status: PropTypes.string,
  errMsg: PropTypes.string,
};

export default RegistrationResponse;
