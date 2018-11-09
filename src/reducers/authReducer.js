export const defaultAuthState = {
  user: {},
  loggedIn: 'false',
};

export function AuthReducer(state = {}, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return ({
        ...state,
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
