import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children, ...args }) {
  const { isAuthenticated, isFetching, profile } = useSelector((state) => state.auth);

  return (
    <Route
      {...args}
      render={({ location }) =>
        isAuthenticated && !isFetching && profile.user_metadata ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
