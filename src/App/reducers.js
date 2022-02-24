import { combineReducers } from 'redux';
import uploadReducer, { defaultUploadState } from '../UploadPage/uploadReducer';
import authReducer, { defaultAuthState } from '../Auth/authReducer';
import analysisReducer, {
  defaultAnalysisState,
} from '../AnalysisPage/analysisReducer';
import downloadReducer, {
  defaultDownloadState,
} from '../DownloadPage/downloadReducer';
import searchReducer, { defaultSearchState } from '../Search/searchReducer';
import quickSearchBoxReducer, {
  defaultQuickSearchState,
} from '../Search/quickSearchBoxReducer';
import sidebarReducer, { defaultSidebarState } from '../Sidebar/sidebarReducer';
import dashboardReducer, {
  defaultDashboardState,
} from '../Dashboard/dashboardReducer';
import dataStatusReducer, {
  defaultDataStatusState
} from '../DataStatusPage/dataStatusReducer';


const testUploads = require('../testData/testAllUploads');
const testPreviousUploads = require('../testData/testPreviousUploads');

// loads test data if in development or testing
// const loadTestData = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
const loadTestData = true; // always load test data prior to production release

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
  search: searchReducer,
  quickSearch: quickSearchBoxReducer,
  sidebar: sidebarReducer,
  dashboard: dashboardReducer,
  dataStatus: dataStatusReducer,
});

export const defaultRootState = {
  upload: loadTestData ? testUploadState : defaultUploadState,
  auth: defaultAuthState,
  analysis: defaultAnalysisState,
  download: loadTestData ? testDownloadState : defaultDownloadState,
  search: defaultSearchState,
  quickSearch: defaultQuickSearchState,
  sidebar: defaultSidebarState,
  dashboard: defaultDashboardState,
  dataStatus: defaultDataStatusState,
};
