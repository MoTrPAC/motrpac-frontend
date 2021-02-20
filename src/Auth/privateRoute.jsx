import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children, ...args }) {
  const { isAuthenticated, isFetching, profile } = useSelector((state) => state.auth);

  return (
    <>
      {isAuthenticated && !isFetching && profile.user_metadata ? (
        <Route component={children} {...args} />
      ) : (
        <Redirect exact to="/" />
      )}
    </>
  );
}

export default PrivateRoute;
