import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import actions from './authActions';

function Callback() {
  const location = useLocation();

  const { isAuthenticated, isFetching, message } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();
  // Handle authentication if expected values are in the URL.
  if (/access_token|id_token|error/.test(location.hash)) {
    dispatch(actions.handleAuthCallback());
  }

  return (
    <>
      {isFetching && !isAuthenticated ? (
        <div className="authLoading">
          <span className="oi oi-shield" />
          <h3>{message || 'Authenticating...'}</h3>
        </div>
      ) : (
        <Navigate to="/dashboard" replace={true} />
      )}
    </>
  );
}

export default Callback;
