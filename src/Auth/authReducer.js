import {
  LOGIN_REQUEST,
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
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        payload: action.payload,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
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
    case PROFILE_RECEIVE: {
      const { profile } = action;
      const { payload } = state;
      const profileObj = { ...profile };
      profileObj.userid =
        payload && payload.idTokenPayload ? payload.idTokenPayload.sub : '';

      return {
        ...state,
        payload: {},
        profile: profileObj,
      };
    }
    default:
      return state;
  }
}

export default AuthReducer;
