import { combineReducers } from 'redux';
import uploadReducer, { defaultUploadState } from './uploadReducer';
import authReducer, { defaultAuthState } from './authReducer';

// TODO: Screen change reducer
export default combineReducers({
  upload: uploadReducer,
  auth: authReducer,
});

export const defaultRootState = {
  upload: defaultUploadState,
  auth: defaultAuthState,
};
