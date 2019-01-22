import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import history from '../App/history';

// Intended to act as placeholder until auth0 or other auth system
//  is in place. Clicking the h3 element authorizes test user logIng.
export function AuthLoading({ authenticating, authSuccess }) {
  function clickH3() {
    authSuccess();
    history.push('/dashboard');
  }
  if (authenticating === true) {
    return (
      <div className="authLoading">
        <span className="oi oi-shield" />
        <h3 onClick={clickH3}>Authenticating...</h3>
      </div>
    );
  }
  return (<div />);
}

AuthLoading.propTypes = {
  authSuccess: PropTypes.func.isRequired,
  authenticating: PropTypes.bool,
};
AuthLoading.defaultProps = {
  authenticating: false,
};

const mapStateToProps = state => ({
  authenticating: state.auth.authenticating,
});

const testUser = require('../testData/testUser');

const mapDispatchToProps = dispatch => ({
  authSuccess: () => dispatch({
    type: 'LOGIN_SUCCESS',
    user: testUser,
  }),
});
export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading);
