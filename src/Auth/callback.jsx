import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions, { loginPending } from './authActions';

export function Callback({
  location,
  message,
  handleAuthCallback,
  loginInProgress,
}) {
  // FIXME: Workaround to make the <Redirect /> to work
  loginInProgress();
  // Handle authentication if expected values are in the URL.
  if (/access_token|id_token|error/.test(location.hash)) {
    handleAuthCallback();
    return <Redirect to="/releases" />;
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
  location: PropTypes.shape({
    hash: PropTypes.string,
  }),
  message: PropTypes.string,
  handleAuthCallback: PropTypes.func.isRequired,
  loginInProgress: PropTypes.func.isRequired,
};

Callback.defaultProps = {
  location: {
    hash: '',
  },
  message: '',
};

const mapStateToProps = (state) => ({
  message: state.auth.message,
});

const mapDispatchToProps = (dispatch) => ({
  handleAuthCallback: () => dispatch(actions.handleAuthCallback()),
  loginInProgress: () => dispatch(loginPending()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Callback);
