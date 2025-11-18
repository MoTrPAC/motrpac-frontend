import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the submitter login button
 *
 * @param {Function} login  Redux action for user login.
 *
 * @returns {object} JSX representation of the login button.
 */
function LoginButton({ login = null }) {
  return (
    <span className="user-login-button">
      <button
        type="button"
        onClick={login}
        className="logInBtn btn btn-primary"
      >
        Login
      </button>
    </span>
  );
}

LoginButton.propTypes = {
  login: PropTypes.func,
};

export default LoginButton;
