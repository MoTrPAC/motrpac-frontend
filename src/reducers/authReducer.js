export const defaultAuthState = {
  user: {},
  loggedIn: false,
  authenticating: false,
};

export function AuthReducer(state = {}, action) {
  switch (action.type) {
    case 'AUTHENTICATING':
      return ({
        ...state,
        authenticating: true,
      });
    case 'LOGIN_SUCCESS':
      return ({
        ...state,
        authenticating: false,
        user: action.user,
        loggedIn: true,
      });
    case 'LOGOUT':
      return ({
        ...state,
        user: {},
        loggedIn: false,
      });
    default:
      return state;
  }
}

export default AuthReducer;
