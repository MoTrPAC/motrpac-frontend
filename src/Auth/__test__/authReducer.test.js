import { AuthReducer, defaultAuthState } from '../authReducer';

const testUser = require('../../testData/testUser');

const loginRequestState = {
  ...defaultAuthState,
  isFetching: true,
  isAuthenticated: false,
};

const loggedInState = {
  ...defaultAuthState,
  isAuthenticated: true,
  payload: testUser,
};

const receiveProfileState = {
  ...defaultAuthState,
  isAuthenticated: true,
  profile: testUser,
};

const loginRequestAction = {
  type: 'LOGIN_REQUEST',
};

const loginSuccessAction = {
  type: 'LOGIN_SUCCESS',
  payload: testUser,
};

const receiveProfileAction = {
  type: 'PROFILE_RECEIVE',
  profile: testUser,
};

const logoutAction = {
  type: 'LOGOUT_SUCCESS',
};

describe('Authentication Reducer', () => {
  test('Return initial state if no action', () => {
    expect(AuthReducer(defaultAuthState, {})).toEqual(defaultAuthState);
  });
  test('Login request returns authentication fetching state', () => {
    expect(AuthReducer(defaultAuthState, loginRequestAction)).toEqual(loginRequestState);
  });
  test('Succesful login with user returns correct logged in state', () => {
    expect(AuthReducer(loginRequestState, loginSuccessAction)).toEqual(loggedInState);
  });
  test('Authenticated user returns profile in state', () => {
    expect(AuthReducer(loggedInState, receiveProfileAction)).toEqual(receiveProfileState);
  });
  test('Logging out returns default authentication state', () => {
    expect(AuthReducer(receiveProfileState, logoutAction)).toEqual(defaultAuthState);
    expect(AuthReducer(defaultAuthState, logoutAction)).toEqual(defaultAuthState);
  });
});
