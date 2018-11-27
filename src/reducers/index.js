import { combineReducers } from 'redux';
import uploadReducer, { defaultUploadState } from './uploadReducer';
import authReducer, { defaultAuthState } from './authReducer';
import analysisReducer, { defaultAnalysisState } from './analysisReducer';

// TODO: Screen change reducer
export default combineReducers({
  upload: uploadReducer,
  auth: authReducer,
  analysis: analysisReducer,
});

export const defaultRootState = {
  upload: defaultUploadState,
  auth: defaultAuthState,
  analysis: defaultAnalysisState,
};
