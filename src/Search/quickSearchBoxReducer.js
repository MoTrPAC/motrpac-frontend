import {
  QUICK_SEARCH_INPUT_CHANGE,
  QUICK_SEARCH_REQUEST_SUBMIT,
  QUICK_SEARCH_REQUEST_FAILURE,
  QUICK_SEARCH_REQUEST_SUCCESS,
  QUICK_SEARCH_RESET,
} from './quickSearchBoxActions';

export const defaultQuickSearchState = {
  quickSearchPayload: {},
  quickSearchError: '',
  quickSearchQueryString: '',
  quickSearchTerm: '',
  isQuickSearchFetching: false,
};

// Reducer to handle actions sent from components related to quick search box
export function QuickSearchBoxReducer(state = { ...defaultQuickSearchState }, action) {
  // Handle states given the action types
  switch (action.type) {
    // Handle form input change event
    case QUICK_SEARCH_INPUT_CHANGE:
      return {
        ...state,
        quickSearchTerm: action.inputValue,
      };

    // Handle form submit event
    case QUICK_SEARCH_REQUEST_SUBMIT:
      return {
        ...state,
        quickSearchQueryString: encodeURI(action.quickSearchTerm),
        quickSearchTerm: action.quickSearchTerm,
        isQuickSearchFetching: true,
      };

    // Handle form submit error
    case QUICK_SEARCH_REQUEST_FAILURE:
      return {
        ...state,
        quickSearchError: action.quickSearchError,
        isQuickSearchFetching: false,
      };

    // Hanlde query response
    case QUICK_SEARCH_REQUEST_SUCCESS:
      return {
        ...state,
        quickSearchPayload: action.quickSearchPayload,
        isQuickSearchFetching: false,
      };

    // Revert form values to default
    case QUICK_SEARCH_RESET:
      return {
        ...defaultQuickSearchState,
      };

    default:
      return state;
  }
}

export default QuickSearchBoxReducer;
