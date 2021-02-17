import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions from './authActions';

export function Callback({ location }) {
  const { isAuthenticated, isFetching, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // Handle authentication if expected values are in the URL.
  if (/access_token|id_token|error/.test(location.hash)) {
    dispatch(actions.handleAuthCallback());
  }

  if (isFetching && !isAuthenticated) {
    return (
      <div className="authLoading">
        <span className="oi oi-shield" />
        <h3>{message || 'Authenticating...'}</h3>
      </div>
    );
  }

  return <Redirect to="/dashboard" />
}

Callback.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
  }),
};

Callback.defaultProps = {
  location: {
    hash: '',
  },
};

export default Callback;
