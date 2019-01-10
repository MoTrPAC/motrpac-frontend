import { combineReducers } from 'redux';
import uploadReducer, { defaultUploadState } from './uploadReducer';
import authReducer, { defaultAuthState } from './authReducer';
import analysisReducer, { defaultAnalysisState } from './analysisReducer';
import downloadReducer, { defaultDownloadState } from './downloadReducer';

const testUploads = require('../testData/testAllUploads');
const testPreviousUploads = require('../testData/testPreviousUploads');

// Set to false to unload test data
const TESTING = true;
const testDownloadState = {
  ...defaultDownloadState,
  allUploads: testUploads,
  filteredUploads: testUploads.slice(0, defaultDownloadState.maxRows),
  uploadCount: testUploads.length,
  siteName: 'Stanford CAS',
};
const testUploadState = {
  ...defaultUploadState,
  previousUploads: testPreviousUploads,
};

// TODO: Screen change reducer
export default combineReducers({
  upload: uploadReducer,
  auth: authReducer,
  analysis: analysisReducer,
  download: downloadReducer,
});

export const defaultRootState = {
  upload: TESTING ? testUploadState : defaultUploadState,
  auth: defaultAuthState,
  analysis: defaultAnalysisState,
  download: TESTING ? testDownloadState : defaultDownloadState,
};
