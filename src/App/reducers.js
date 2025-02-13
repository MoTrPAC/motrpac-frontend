import { combineReducers } from 'redux';
import authReducer, { defaultAuthState } from '../Auth/authReducer';
import analysisReducer, {
  defaultAnalysisState,
} from '../AnalysisPage/analysisReducer';
import searchReducer, { defaultSearchState } from '../Search/searchReducer';
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
import userSurveyReducer, {
  defaultUserSurveyState,
} from '../UserSurvey/userSurveyReducer';

export default combineReducers({
  auth: authReducer,
  analysis: analysisReducer,
  search: searchReducer,
  dataSummary: dataSummaryPageReducer,
  dashboard: dashboardReducer,
  dataStatus: dataStatusReducer,
  browseData: browseDataReducer,
  userSurvey: userSurveyReducer,
});

export const defaultRootState = {
  auth: defaultAuthState,
  analysis: defaultAnalysisState,
  search: defaultSearchState,
  dataSummary: defaultDataSummaryState,
  dashboard: defaultDashboardState,
  dataStatus: defaultDataStatusState,
  browseData: defaultBrowseDataState,
  userSurvey: defaultUserSurveyState,
};
