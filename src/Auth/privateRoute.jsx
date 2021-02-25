import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AnimatedLoadingIcon from '../lib/ui/loading';

function PrivateRoute({ children, ...args }) {
  const { isAuthenticated, isFetching, profile } = useSelector((state) => state.auth);

  function handleAccess() {
    if (!isAuthenticated && !profile.user_metadata) {
      return <Redirect exact to="/" />;
    }

    return <Route component={children} {...args} />;
  }

  return (
    <>
      {!isFetching ? handleAccess() : (
        <div className="mt-5 py-5">
          <AnimatedLoadingIcon isFetching={isFetching} />
        </div>
      )}
    </>
  );
}

export default PrivateRoute;
