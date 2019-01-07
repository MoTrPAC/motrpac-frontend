import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions from '../../actions';

export function Callback({
  history,
  location,
  message,
  handleAuthCallback,
}) {
  // Handle authentication if expected values are in the URL.
  if (/access_token|id_token|error/.test(location.hash)) {
    handleAuthCallback();
    // history.push('/dashboard');
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
  history: PropTypes.object,
  location: PropTypes.object,
  message: PropTypes.string,
  handleAuthCallback: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  message: state.auth.message
});

const mapDispatchToProps = dispatch => ({
  handleAuthCallback: () => dispatch(actions.handleAuthCallback())
});

export default connect(mapStateToProps, mapDispatchToProps)(Callback);
