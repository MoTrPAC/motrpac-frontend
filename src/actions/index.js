import Auth from '../Auth/Auth';

// Possible states for login and logout
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const PROFILE_REQUEST = 'PROFILE_REQUEST';
export const PROFILE_RECEIVE = 'PROFILE_RECEIVE';

export const requestLogin = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS,
});

export const loginError = (message = '') => ({
  type: LOGIN_FAILURE,
  message,
});

export const receiveLogout = () => ({
  type: LOGOUT_SUCCESS,
});

export const receiveProfile = profile => ({
  type: PROFILE_RECEIVE,
  profile,
});

/**
 * Async action creators with redux-thunk
 */

export const loginAsync = () => dispatch => {
  dispatch(requestLogin());
  Auth.login();
};

export const logoutAsync = () => dispatch => {
  Auth.logout();
  dispatch(receiveLogout());
};

export const handleAuthCallbackAsync = () => dispatch => {
  Auth.handleAuthentication((err, data) => {
    if (err) {
      dispatch(loginError(`${err.error}: ${err.errorDescription}`));
      return;
    }

    dispatch(loginSuccess(data));
    dispatch(this.context.props.history.push('/'));
  });
};

export const getProfileAsync = () => dispatch => {
  Auth.getProfile((err, profile) => {
    dispatch(receiveProfile(profile));
  });
};

export default {
  getProfile: getProfileAsync,
  handleAuthCallback: handleAuthCallbackAsync,
  login: loginAsync,
  loginError,
  loginSuccess,
  logout: logoutAsync,
};
