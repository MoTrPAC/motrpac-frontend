import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

export function AuthLoading({ authenticating, authSuccess }) {
  if (authenticating === true) {
    return (
      <div className="authLoading">
        <span className="oi oi-shield" />
        <h3 onClick={authSuccess} ><Link to="/dashboard">Authenticating...</Link></h3>
      </div>
    );
  }
  return (<div />);
}
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