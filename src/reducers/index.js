import { combineReducers } from 'redux';
import uploadReducer, { defaultUploadState } from './uploadReducer';
import authReducer, { defaultAuthState } from './authReducer';
import analysisReducer, { defaultAnalysisState } from './analysisReducer';
import downloadReducer, { defaultDownloadState } from './downloadReducer';

const testUploads = require('../testData/testPreviousUploads');

// Set to false to unload test data
const TESTING = true;
let testDownloadState;
if (TESTING) {
  testDownloadState = {
    ...defaultDownloadState,
    allUploads: testUploads,
    filteredUploads: testUploads.slice(0, defaultDownloadState.maxRows),
  };
}

// TODO: Screen change reducer
export default combineReducers({
  upload: uploadReducer,
  auth: authReducer,
  analysis: analysisReducer,
  download: downloadReducer,
});

export const defaultRootState = {
  upload: defaultUploadState,
  auth: defaultAuthState,
  analysis: defaultAnalysisState,
  download: TESTING ? testDownloadState : defaultDownloadState,
};
