import {
  LOGIN_REQUEST,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  PROFILE_RECEIVE,
} from './authActions';

export const defaultAuthState = {
  payload: {},
  profile: {},
  message: '',
  isFetching: false,
  isPending: false,
  isAuthenticated: false,
};

export function AuthReducer(state = defaultAuthState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
      };
    case LOGIN_PENDING:
      return {
        ...state,
        isPending: true,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isPending: false,
        isAuthenticated: true,
        payload: action.payload,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isPending: false,
        isAuthenticated: false,
        message: action.message,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        payload: {},
        profile: {},
      };
    case PROFILE_RECEIVE:
      return {
        ...state,
        payload: {},
        profile: action.profile,
      };
    default:
      return state;
  }
}

export default AuthReducer;
