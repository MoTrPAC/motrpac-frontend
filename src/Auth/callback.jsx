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
  profile
}) {
  // FIXME: Workaround to make the <Redirect /> to work
  loginInProgress();
  // Handle authentication if expected values are in the URL.
  if (/access_token|id_token|error/.test(location.hash)) {
    handleAuthCallback();
    const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
    if (hasAccess) {
      return <Redirect to="/dashboard"></Redirect>
    }
    if (!hasAccess) {
      return <Redirect to="/error" />
    }
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
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
};

Callback.defaultProps = {
  location: {
    hash: '',
  },
  message: '',
  profile: {},
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  message: state.auth.message,
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  handleAuthCallback: () => dispatch(actions.handleAuthCallback()),
  loginInProgress: () => dispatch(loginPending()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Callback);
