import { AuthReducer, defaultAuthState } from '../../reducers/authReducer';

const testUser = require('../../testData/testUser');

const loggedInState = {
  ...defaultAuthState,
  loggedIn: true,
  user: testUser,
};

const loginSuccessAction = {
  type: 'LOGIN_SUCCESS',
  user: testUser,
};
const logoutAction = {
  type: 'LOGOUT',
};

describe('Authentication Reducer', () => {
  test('Return initial state if no action', () => {
    expect(AuthReducer(defaultAuthState, {})).toEqual(defaultAuthState);
  });
  test('Succesful login with user returns correct logged in state', () => {
    expect(AuthReducer(defaultAuthState, loginSuccessAction)).toEqual(loggedInState);
  });
  test('Logging out returns default authentication state', () => {
    expect(AuthReducer(loggedInState, logoutAction)).toEqual(defaultAuthState);
    expect(AuthReducer(defaultAuthState, logoutAction)).toEqual(defaultAuthState);
  });
});
