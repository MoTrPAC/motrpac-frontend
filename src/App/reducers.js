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

export default combineReducers({
  auth: authReducer,
  analysis: analysisReducer,
  search: searchReducer,
  quickSearch: quickSearchBoxReducer,
  sidebar: sidebarReducer,
  dataSummary: dataSummaryPageReducer,
});

export const defaultRootState = {
  auth: defaultAuthState,
  analysis: defaultAnalysisState,
  search: defaultSearchState,
  quickSearch: defaultQuickSearchState,
  sidebar: defaultSidebarState,
  dataSummary: defaultDataSummaryState,
};
