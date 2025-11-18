import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import AnimatedLoadingIcon from '../lib/ui/loading';

function AuthWrapper({ children }) {
  const { isAuthenticated, isFetching, profile } = useSelector(
    (state) => state.auth,
  );

  return (
    <>
      {isFetching ? (
        <div className="mt-5 py-5">
          <AnimatedLoadingIcon isFetching={isFetching} />
        </div>
      ) : !isAuthenticated && !profile.user_metadata ? (
        <Navigate exact to="/" />
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default AuthWrapper;
