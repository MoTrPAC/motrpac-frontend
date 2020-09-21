import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions, { loginPending } from './authActions';

export function Callback({
  location,
  message,
  handleAuthCallback,
  loginPending,
}) {
  // FIXME: Workaround to make the <Redirect /> to work
  loginPending();
  // Handle authentication if expected values are in the URL.
  if (/access_token|id_token|error/.test(location.hash)) {
    handleAuthCallback();
    return <Redirect to="/dashboard" />
  }

  const callbackMsg = message || 'Authenticating...';

  return (
    <div className="authLoading">
      <span className="oi oi-shield" />
      <h3>{callbackMsg}</h3>
    </div>
  );
}

Callback.propTypes = {
  location: PropTypes.object,
  message: PropTypes.string,
  handleAuthCallback: PropTypes.func.isRequired,
  loginPending: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  message: state.auth.message
});

const mapDispatchToProps = dispatch => ({
  handleAuthCallback: () => dispatch(actions.handleAuthCallback()),
  loginPending: () => dispatch(loginPending()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Callback);
