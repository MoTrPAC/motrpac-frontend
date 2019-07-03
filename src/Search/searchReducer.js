import {
  SEARCH_FORM_CHANGE,
  SEARCH_FORM_ADD_PARAM,
  SEARCH_FORM_REMOVE_PARAM,
  SEARCH_FORM_SUBMIT,
  SEARCH_FORM_SUBMIT_FAILURE,
  SEARCH_FORM_SUBMIT_SUCCESS,
  SEARCH_FORM_RESET,
  GET_SEARCH_FORM,
} from './searchActions';

export const defaultSearchState = {
  searchPayload: {},
  searchError: '',
  searchQueryString: '',
  advSearchParams: [
    {
      term: 'all',
      value: '',
      operator: '',
    },
  ],
  isSearchFetching: false,
};

// Reducer to handle actions sent from components related to advanced search form
export function SearchReducer(state = { ...defaultSearchState }, action) {
  // Handle states given the action types
  switch (action.type) {
    // Handle form input change event
    case SEARCH_FORM_CHANGE: {
      const newParamList = [...state.advSearchParams];

      if (action.field === 'term') {
        newParamList[action.index].term = action.inputValue;
      } else if (action.field === 'value') {
        newParamList[action.index].value = action.inputValue;
      } else if (action.field === 'operator') {
        newParamList[action.index].operator = action.inputValue;
      }

      return {
        ...state,
        advSearchParams: newParamList,
      };
    }

    // Handle search param addition
    case SEARCH_FORM_ADD_PARAM: {
      const newParamList = [
        ...state.advSearchParams,
        { term: 'all', value: '', operator: 'AND' },
      ];

      return {
        ...state,
        advSearchParams: newParamList,
      };
    }

    // Hanlde search param removal
    case SEARCH_FORM_REMOVE_PARAM: {
      const newParamList = [...state.advSearchParams];
      newParamList.splice(action.index, 1);

      return {
        ...state,
        advSearchParams: newParamList,
      };
    }

    // Handle form submit event
    case SEARCH_FORM_SUBMIT: {
      const paramsList = [...action.params];
      const query = paramsList.map((item) => {
        const operator = item.operator && item.operator.length ? item.operator : '';
        return `${operator} (${item.term}:${encodeURI(item.value)})`;
      }).join(' ');

      return {
        ...state,
        searchQueryString: query,
        isSearchFetching: true,
      };
    }

    // Handle form submit error
    case SEARCH_FORM_SUBMIT_FAILURE:
      return {
        ...state,
        searchError: action.searchError,
        isSearchFetching: false,
      };

    // Hanlde query response
    case SEARCH_FORM_SUBMIT_SUCCESS:
      return {
        ...state,
        searchPayload: action.searchPayload,
        isSearchFetching: false,
      };

    // Revert form values to default
    case SEARCH_FORM_RESET:
      return {
        ...defaultSearchState,
      };

    // Handle 'Advanced' search link click event
    case GET_SEARCH_FORM:
      return {
        ...state,
        searchPayload: {},
        searchQueryString: '',
      };

    default:
      return state;
  }
}

export default SearchReducer;
