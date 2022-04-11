import { combineReducers } from 'redux';
import authReducer, { defaultAuthState } from '../Auth/authReducer';
import analysisReducer, {
  defaultAnalysisState,
} from '../AnalysisPage/analysisReducer';
import searchReducer, { defaultSearchState } from '../Search/searchReducer';
import quickSearchBoxReducer, {
  defaultQuickSearchState,
} from '../Search/quickSearchBoxReducer';
import sidebarReducer, { defaultSidebarState } from '../Sidebar/sidebarReducer';
import dataSummaryPageReducer, {
  defaultDataSummaryState,
} from '../DataSummaryPage/dataSummaryPageReducer';
import dashboardReducer, {
  defaultDashboardState,
} from '../Dashboard/dashboardReducer';
import dataStatusReducer, {
  defaultDataStatusState,
} from '../DataStatusPage/dataStatusReducer';
import browseDataReducer, {
  defaultBrowseDataState,
} from '../BrowseDataPage/browseDataReducer';

// load static data
const dataFiles = require('../data/motrpac-data-files.json');

const browseDataState = {
  ...defaultBrowseDataState,
  allFiles: dataFiles,
  filteredFiles: dataFiles.slice(0, dataFiles.length),
  fileCount: dataFiles.length,
};

export default combineReducers({
  auth: authReducer,
  analysis: analysisReducer,
  search: searchReducer,
  quickSearch: quickSearchBoxReducer,
  sidebar: sidebarReducer,
  dataSummary: dataSummaryPageReducer,
  dashboard: dashboardReducer,
  dataStatus: dataStatusReducer,
  browseData: browseDataReducer,
});

export const defaultRootState = {
  auth: defaultAuthState,
  analysis: defaultAnalysisState,
  search: defaultSearchState,
  quickSearch: defaultQuickSearchState,
  sidebar: defaultSidebarState,
  dataSummary: defaultDataSummaryState,
  dashboard: defaultDashboardState,
  dataStatus: defaultDataStatusState,
  browseData: browseDataState,
};
