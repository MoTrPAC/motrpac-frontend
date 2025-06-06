import {
  TOGGLE_WEIGHT_PLOT,
  TOGGLE_BODY_FAT_PLOT,
  TOGGLE_VO2_PLOT,
  TOGGLE_LACTATE_PLOT,
  GENE_SEARCH_INPUT_CHANGE,
  GENE_SEARCH_SUBMIT,
  GENE_SEARCH_FAILURE,
  GENE_SEARCH_SUCCESS,
  GENE_SEARCH_RESET,
  GENE_SEARCH_CHANGE_FILTER,
  PASS1AC06_ANALYSIS_CATEGORY_OPTION_CHANGE,
} from './analysisActions';

export const defaultGeneSearchParams = {
  ktype: 'gene',
  keys: '',
  omics: ['transcriptomics', 'proteomics'],
  filters: {
    assay: [],
    tissue: [],
  },
  fields: [
    'gene_symbol',
    'feature_ID',
    'tissue',
    'assay',
    'sex',
    'comparison_group',
    'logFC',
    'logFC_se',
    'p_value',
    'adj_p_value',
    'p_value_male',
    'p_value_female',
  ],
  unique_fields: ['tissue', 'assay'],
  size: 10000,
  start: 0,
  save: false,
};

export const defaultAnalysisState = {
  match: {
    params: {
      subjectType: '',
    },
  },
  currentAnalysis: '',
  currentAnalysisTitle: '',
  depth: 0,
  analysisSelected: false,
  weightPlot: 'one_week_program',
  bodyFatPlot: 'one_week_program',
  vo2Plot: 'one_week_program',
  lactatePlot: 'one_week_program',
  geneSearchInputValue: '',
  geneSearchResults: {},
  geneSearchParams: defaultGeneSearchParams,
  geneSearching: false,
  geneSearchError: '',
  scope: 'all',
  hasResultFilters: {},
  pass1ac06AnalysisCategoryOptions: {
    summaryStatistics: {
      weight_distribution: true,
      lactate_change: true,
      rat_work: true,
    },
    correlationAnalysis: {
      overall_correlation_matrix: true,
    },
  },
};

export default function AnalysisReducer(
  state = { ...defaultAnalysisState },
  action
) {
  switch (action.type) {
    case 'ANALYSIS_SELECT':
      return {
        ...state,
        currentAnalysis: action.analysis,
        currentAnalysisTitle: action.analysisTitle,
        analysisSelected: true,
        depth: 1,
      };
    case 'GO_BACK':
      return {
        ...state,
        depth: state.depth > 0 ? state.depth - 1 : 0,
      };
    case 'RESET_DEPTH':
      return {
        ...state,
        currentAnalysis: '',
        currentAnalysisTitle: '',
        depth: 0,
        analysisSelected: false,
      };
    case TOGGLE_WEIGHT_PLOT:
      return {
        ...state,
        weightPlot: action.weightPlot,
      };
    case TOGGLE_BODY_FAT_PLOT:
      return {
        ...state,
        bodyFatPlot: action.bodyFatPlot,
      };
    case TOGGLE_VO2_PLOT:
      return {
        ...state,
        vo2Plot: action.vo2Plot,
      };
    case TOGGLE_LACTATE_PLOT:
      return {
        ...state,
        lactatePlot: action.lactatePlot,
      };
    // Handle form input change event
    case GENE_SEARCH_INPUT_CHANGE: {
      const { inputValue } = action;
      return {
        ...state,
        geneSearchInputValue: inputValue,
        geneSearchError: '',
      };
    }
    // Handle form submit event
    case GENE_SEARCH_SUBMIT: {
      const params = { ...state.geneSearchParams };
      params.keys = action.input;
      // Reset all filters if scope is 'all'
      if (action.scope === 'all') {
        params.filters = {
          assay: [],
          tissue: [],
        };
      }

      return {
        ...state,
        geneSearchResults: {},
        geneSearchParams: params,
        geneSearching: true,
        scope: action.scope,
      };
    }
    // Handle form submit error
    case GENE_SEARCH_FAILURE:
      return {
        ...state,
        geneSearchError: action.geneSearchError,
        geneSearching: false,
      };
    // Hanlde query response
    case GENE_SEARCH_SUCCESS:
      return {
        ...state,
        geneSearchResults:
          action.geneSearchResults.message || action.geneSearchResults.errors
            ? {
                errors:
                  action.geneSearchResults.message ||
                  action.geneSearchResults.errors,
              }
            : action.geneSearchResults,
        geneSearching: false,
        hasResultFilters:
          action.geneSearchResults.uniqs && action.scope === 'all'
            ? action.geneSearchResults.uniqs
            : state.hasResultFilters,
      };
    // Revert param values to default
    case GENE_SEARCH_RESET: {
      // Action to handle secondary filter reset
      if (action.scope === 'filters') {
        const params = { ...state.geneSearchParams };
        params.filters = {
          tissue: [],
          assay: [],
        };
        return {
          ...state,
          geneSearchParams: params,
        };
      }

      const cloneDefaultGeneSearchParams = { ...defaultGeneSearchParams };
      cloneDefaultGeneSearchParams.keys = '';
      cloneDefaultGeneSearchParams.filters.assay = [];
      cloneDefaultGeneSearchParams.filters.tissue = [];

      return {
        ...state,
        geneSearchInputValue: '',
        geneSearchResults: {},
        geneSearchParams: cloneDefaultGeneSearchParams,
        geneSearching: false,
        geneSearchError: '',
        scope: 'all',
        hasResultFilters: {},
      };
    }
    // Handle secondary filters: tissue, assay
    case GENE_SEARCH_CHANGE_FILTER: {
      const params = { ...state.geneSearchParams };
      const { filters } = params;
      const isActiveFilter = filters[action.field].indexOf(action.filterValue);
      const newFilters = { ...filters };

      // Handle selection of a filter value
      if (action.field.match(/^(tissue|assay)$/)) {
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

      params.filters = newFilters;

      return {
        ...state,
        geneSearchParams: params,
      };
    }
    // Handle analysis category option change
    case PASS1AC06_ANALYSIS_CATEGORY_OPTION_CHANGE: {
      const { category, option } = action;
      const newOptions = { ...state.pass1ac06AnalysisCategoryOptions };
      newOptions[category][option] = !newOptions[category][option];

      return {
        ...state,
        pass1ac06AnalysisCategoryOptions: newOptions,
      };
    }
    default:
      return state;
  }
}
