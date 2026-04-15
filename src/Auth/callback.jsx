import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import actions from './authActions';

function Callback() {
  const location = useLocation();
  const hasHandledAuth = useRef(false);

  const { isAuthenticated, isFetching, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Check if we have auth tokens in the URL hash
  const hasAuthHash = /access_token|id_token|error/.test(location.hash);

  // Handle authentication once if expected values are in the URL.
  useEffect(() => {
    if (!hasHandledAuth.current && hasAuthHash) {
      hasHandledAuth.current = true;
      dispatch(actions.handleAuthCallback());
    }
  }, [hasAuthHash, dispatch]);

  // Show loading if:
  // 1. We have auth hash and haven't finished processing yet, OR
  // 2. We're actively fetching
  const showLoading = (hasAuthHash && !isAuthenticated) || isFetching;

  return (
    <>
      {showLoading ? (
        <div className="authLoading">
          <span className="oi oi-shield"/>
          <h3>{message || 'Authenticating...'}</h3>
        </div>
      ) : (
        <Navigate to="/dashboard" replace={true} />
      )}
    </>
  );
}

export default Callback;
