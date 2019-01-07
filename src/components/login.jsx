import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions from '../actions';

export function Login({
  isAuthenticated,
  login,
  location,
}) {
  const { from } = location.state || { from: { pathname: "/" } };

  if (isAuthenticated) {
    return <Redirect to={from} />
  }

  return (
    <div className="container user-login-container">
      <p>You must log in to view the page at {from.pathname}</p>
      <div className="row user-login">
        <button onClick={login} className="logInOutBtn btn">Log in</button>
      </div>
    </div>
  );
}

Login.propTypes = {
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func.isRequired,
  location: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(actions.login())
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
