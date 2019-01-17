import { combineReducers } from 'redux';
import uploadReducer, { defaultUploadState } from '../UploadPage/uploadReducer';
import authReducer, { defaultAuthState } from '../Auth/authReducer';
import analysisReducer, { defaultAnalysisState } from '../AnalysisPage/analysisReducer';
import downloadReducer, { defaultDownloadState } from '../DownloadPage/downloadReducer';

const testUploads = require('../testData/testAllUploads');
const testPreviousUploads = require('../testData/testPreviousUploads');

// loads test data if in development or testing
const loadTestData = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

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

export default combineReducers({
  upload: uploadReducer,
  auth: authReducer,
  analysis: analysisReducer,
  download: downloadReducer,
});

export const defaultRootState = {
  upload: loadTestData ? testUploadState : defaultUploadState,
  auth: defaultAuthState,
  analysis: defaultAnalysisState,
  download: loadTestData ? testDownloadState : defaultDownloadState,
};
