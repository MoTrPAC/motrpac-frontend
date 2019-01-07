import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

export function ProtectedRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (
        isAuthenticated ?
          <Component {...props} />
          :
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
      )}
    />
  );
}

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ProtectedRoute);
