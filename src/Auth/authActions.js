import Auth from './Auth';

const auth = new Auth();

// Possible states for login and logout
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const PROFILE_RECEIVE = 'PROFILE_RECEIVE';

export function requestLogin() {
  return {
    type: LOGIN_REQUEST,
  };
}

export function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload,
  };
}

export function loginError(message = '') {
  return {
    type: LOGIN_FAILURE,
    message,
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

export function receiveProfile(profile) {
  return {
    type: PROFILE_RECEIVE,
    profile,
  };
}

/**
 * Async action creators with redux-thunk
 */

export function loginAsync() {
  return (dispatch) => {
    dispatch(requestLogin());
    auth.login();
  };
}

export function logoutAsync() {
  return (dispatch) => {
    auth.logout();
    dispatch(receiveLogout());
  };
}

export function handleAuthCallbackAsync() {
  return (dispatch) => {
    dispatch(requestLogin());
    auth.handleAuthentication((err, data) => {
      if (err) {
        return dispatch(loginError(`${err.error}: ${err.errorDescription}`));
      }

      dispatch(loginSuccess(data));
      auth.getProfile((error, profile) => {
        return dispatch(receiveProfile(profile));
      });
    });
  };
}

export default {
  handleAuthCallback: handleAuthCallbackAsync,
  login: loginAsync,
  loginError,
  loginSuccess,
  logout: logoutAsync,
};
