import {
  CHANGE_RESULT_FILTER,
  CHANGE_PARAM,
  SEARCH_SUBMIT,
  SEARCH_FAILURE,
  SEARCH_SUCCESS,
  SEARCH_RESET,
} from './searchActions';

export const defaultSearchState = {
  searchResults: {},
  searchParams: {
    ktype: 'gene',
    keys: '',
    omics: 'all',
    filters: {
      tissue: '',
      assay: '',
      sex: '',
      comparison_group: '',
      adj_p_value: [],
      logFC: [],
      p_value: [],
    },
    debug: true,
    save: true,
  },
  scope: 'all',
  searching: false,
  searchError: '',
};

// Reducer to handle actions sent from components related to advanced search form
export function SearchReducer(state = { ...defaultSearchState }, action) {
  // Handle states given the action types
  switch (action.type) {
    // Handle primary param values: ktype, keys, omics
    case CHANGE_PARAM: {
      const updatedParams = { ...state.searchParams };

      updatedParams[action.field] = action.paramValue;

      return {
        ...state,
        searchParams: updatedParams,
      };
    }

    // Handle secondary filters: tissue, assay, sex, timepoint, etc
    case CHANGE_RESULT_FILTER: {
      const params = { ...state.searchParams };
      const { filters } = params;
      const isActiveFilter = filters[action.field].indexOf(action.filterValue);
      const newFilters = { ...filters };

      // Handle selection of a filter value
      if (action.field.match(/^(tissue|assay|sex|comparison_group)$/)) {
        let newArr = newFilters[action.field].length
          ? newFilters[action.field].split(',')
          : [];
        if (isActiveFilter === -1) {
          // Adds filter if new
          const mergeArr = [...newArr, ...[action.filterValue]];
          newFilters[action.field] = mergeArr.join();
        } else {
          // Removes filter if already exists
          newArr = newArr.filter((filter) => !(filter === action.filterValue));
          newFilters[action.field] = newArr.join();
        }
      }

      // Handle range filters
      if (action.field.match(/^(adj_p_value|logFC|p_value)$/)) {
        if (action.bound === 'min') {
          if (!newFilters[action.field].length) {
            // Empty array: create new array with value
            newFilters[action.field] = [action.filterValue, ''];
          } else {
            newFilters[action.field][0] = action.filterValue;
          }
        }
        if (action.bound === 'max') {
          if (!newFilters[action.field].length) {
            // Empty array: create new array with value
            newFilters[action.field] = ['', action.filterValue];
          } else {
            newFilters[action.field][1] = action.filterValue;
          }
        }
        if (
          newFilters[action.field][0] === '' &&
          newFilters[action.field][1] === ''
        ) {
          newFilters[action.field].length = 0;
        }
      }

      params.filters = newFilters;

      return {
        ...state,
        searchParams: params,
      };
    }

    // Handle form submit event
    case SEARCH_SUBMIT: {
      const { ktype, keys, omics, filters } = action.params;
      return {
        ...state,
        searchParams: {
          ktype,
          keys,
          omics,
          filters,
          debug: true,
          save: true,
        },
        scope: action.scope,
        searching: true,
      };
    }

    // Handle form submit error
    case SEARCH_FAILURE:
      return {
        ...state,
        searchError: action.searchError,
        searching: false,
      };

    // Hanlde query response
    case SEARCH_SUCCESS:
      return {
        ...state,
        searchResults:
          action.searchResults.message || action.searchResults.errors
            ? {
                errors:
                  action.searchResults.message || action.searchResults.errors,
              }
            : action.searchResults,
        searching: false,
      };

    // Revert param/filter values to default
    case SEARCH_RESET: {
      if (action.scope === 'filters') {
        const params = { ...state.searchParams };

        params.filters = {
          tissue: '',
          assay: '',
          sex: '',
          comparison_group: '',
          adj_p_value: [],
          logFC: [],
          p_value: [],
        };

        return {
          ...state,
          searchParams: params,
        };
      }

      return {
        ...defaultSearchState,
      };
    }

    default:
      return state;
  }
}

export default SearchReducer;
