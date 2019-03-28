import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the submitter login button
 *
 * @param {Function} login  Redux action for user login.
 *
 * @returns {object} JSX representation of the login button.
 */
function LoginButton({ login }) {
  return (
    <span className="user-login-button">
      <button type="button" onClick={login} className="logInBtn btn btn-primary">
        Submitter Login
      </button>
    </span>
  );
}

LoginButton.propTypes = {
  login: PropTypes.func,
};

LoginButton.defaultProps = {
  login: null,
};

export default LoginButton;
