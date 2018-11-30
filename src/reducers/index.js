import { combineReducers } from 'redux';
import uploadReducer, { defaultUploadState } from './uploadReducer';
import authReducer, { defaultAuthState } from './authReducer';
import analysisReducer, { defaultAnalysisState } from './analysisReducer';
import downloadReducer, { defaultDownloadState } from './downloadReducer';

const defaultEnvState = {
  testData: true,
};
function envReducer(state = { ...defaultEnvState }, action) {
  return state;
}
// TODO: Screen change reducer
export default combineReducers({
  upload: uploadReducer,
  auth: authReducer,
  analysis: analysisReducer,
  download: downloadReducer,
  env: envReducer,
});

export const defaultRootState = {
  upload: defaultUploadState,
  auth: defaultAuthState,
  analysis: defaultAnalysisState,
  download: defaultDownloadState,
  env: {
    testData: true,
  },
};
