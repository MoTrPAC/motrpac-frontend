import {
  CHANGE_RESULT_FILTER,
  CHANGE_PARAM,
  SEARCH_SUBMIT,
  SEARCH_FAILURE,
  SEARCH_SUCCESS,
  SEARCH_RESET,
  DOWNLOAD_SUBMIT,
  DOWNLOAD_FAILURE,
  DOWNLOAD_SUCCESS,
} from './searchActions';

export const defaultSearchState = {
  searchResults: {},
  searchParams: {
    ktype: 'gene',
    keys: [],
    omics: [],
    study: ["pass1b06", "precawg"],
    analysis: 'all',
    filters: {
      tissue: [],
      assay: [],
      sex: [],
      timepoint: [],
      adj_p_value: { min: '', max: '' },
      logFC: { min: '', max: '' },
      p_value: { min: '', max: '' },
      contrast_type: ['exercise_with_controls', 'acute'],
      must_not: {
        assay: ['epigen-atac-seq', 'epigen-rrbs', 'epigen-methylcap-seq'],
      },
    },
    fields: [
      'gene_symbol',
      'refmet_name',
      'feature_id',
      'tissue',
      'assay',
      'omics',
      'sex',
      'timepoint',
      'logFC',
      'p_value',
      'adj_p_value',
      'contrast1_randomGroupCode',
      'contrast_type',
    ],
    unique_fields: ['tissue', 'omics', 'assay', 'sex', 'timepoint'],
    size: 20,
    start: 0,
    save: false,
    convert_assay_code: 0,
    convert_tissue_code: 0,
  },
  scope: 'all',
  searching: false,
  searchError: '',
  downloadResults: {},
  downloading: false,
  downloadError: '',
  hasResultFilters: {},
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

    // Handle secondary filters: study, tissue, assay, sex, timepoint, etc
    case CHANGE_RESULT_FILTER: {
      const params = { ...state.searchParams };
      const { filters } = params;
      const isActiveFilter =
        Array.isArray(filters[action.field]) &&
        filters[action.field].indexOf(action.filterValue);
      const newFilters = { ...filters };

      // Handle selection of study filter
      if (action.field.match(/^(study|omics)$/)) {
        const isActiveParam = params[action.field].indexOf(action.filterValue);
        if (isActiveParam === -1) {
          // Adds filter if new
          params[action.field].push(action.filterValue);
        } else {
          // Removes filter if already exists
          const newArr = params[action.field].filter(
            (value) => !(value === action.filterValue)
          );
          params[action.field] = newArr;
        }
      }

      // Handle selection of a filter value
      if (action.field.match(/^(tissue|assay|sex|timepoint)$/)) {
        if (isActiveFilter === -1) {
          // Adds filter if new
          newFilters[action.field].push(action.filterValue);
        } else {
          // Removes filter if already exists
          const newArr = newFilters[action.field].filter(
            (value) => !(value === action.filterValue)
          );
          newFilters[action.field] = newArr;
        }
      }

      // Handle range filters
      if (action.field.match(/^(adj_p_value|logFC|p_value)$/)) {
        const rangeFilter = newFilters[action.field];
        if (rangeFilter) {
          rangeFilter[action.bound] = action.filterValue;
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
      const {
        ktype,
        keys,
        study,
        omics,
        analysis,
        filters,
        fields,
        unique_fields,
        size,
        start,
      } = action.params;
      return {
        ...state,
        searchResults: {},
        searchParams: {
          ktype,
          keys,
          study,
          omics,
          analysis,
          filters,
          fields,
          unique_fields,
          size,
          start,
          debug: true,
          save: false,
          convert_assay_code: 0,
          convert_tissue_code: 0,
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
    case SEARCH_SUCCESS: {
      const { study } = action.params;
      const updatedParams = {
        ...state.searchParams,
        study: action.scope === 'filters' ? study : [],
      };

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
        hasResultFilters:
          action.searchResults.uniqs && action.scope === 'all'
            ? action.searchResults.uniqs
            : state.hasResultFilters,
        searchParams: updatedParams,
      };
    }

    // Revert param/filter values to default
    case SEARCH_RESET: {
      // Action to handle secondary filter reset
      if (action.scope === 'filters') {
        const params = { ...state.searchParams };
        params.filters = {
          tissue: [],
          assay: [],
          sex: [],
          timepoint: [],
          adj_p_value: { min: '', max: '' },
          logFC: { min: '', max: '' },
          p_value: { min: '', max: '' },
        };
        return {
          ...state,
          searchParams: params,
        };
      }

      const defaultParams = { ...defaultSearchState.searchParams };
      defaultParams.keys = [];
      defaultParams.filters = {
        tissue: [],
        assay: [],
        sex: [],
        timepoint: [],
        adj_p_value: { min: '', max: '' },
        logFC: { min: '', max: '' },
        p_value: { min: '', max: '' },
      };
      return {
        ...defaultSearchState,
        searchParams: defaultParams,
        hasResultFilters: {},
      };
    }

    // Handle download submit event
    case DOWNLOAD_SUBMIT:
      return {
        ...state,
        downloadResults: {},
        downloading: true,
      };

    // Handle download request error
    case DOWNLOAD_FAILURE:
      return {
        ...state,
        downloadError: action.downloadError,
        downloading: false,
      };

    // Hanlde download query response
    case DOWNLOAD_SUCCESS:
      return {
        ...state,
        downloadResults:
          action.downloadResults.message || action.downloadResults.errors
            ? {
              errors:
                  action.downloadResults.message
                  || action.downloadResults.errors,
            }
            : action.downloadResults,
        downloading: false,
      };

    default:
      return state;
  }
}

export default SearchReducer;
