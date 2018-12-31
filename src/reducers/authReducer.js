import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  PROFILE_RECEIVE,
} from '../actions';

export const defaultAuthState = {
  profile: {},
  message: '',
  isFetching: false,
  isAuthenticated: localStorage.getItem('id_token') ? true : false,
};

export function AuthReducer(state = defaultAuthState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
      };
    case PROFILE_RECEIVE:
      return {
        ...state,
        profile: action.profile,
      };
    default:
      return state;
  }
}

export default AuthReducer;
