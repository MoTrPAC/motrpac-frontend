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
} from './analysisActions';

export const defaultGeneSearchParams = {
  ktype: 'gene',
  keys: '',
  omics: 'all',
  index:
    'transcriptomics_training, transcriptomics_timewise, proteomics_untargeted_training, proteomics_untargeted_timewise',
  filters: {
    assay: '',
    tissue: '',
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
  debug: false,
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
  geneSearchResults: {},
  geneSearchParams: defaultGeneSearchParams,
  geneSearching: false,
  geneSearchError: '',
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
      const params = { ...state.geneSearchParams };
      const { inputValue } = action;
      params.keys = inputValue;
      return {
        ...state,
        geneSearchParams: params,
        geneSearchError: '',
      };
    }
    // Handle form submit event
    case GENE_SEARCH_SUBMIT: {
      return {
        ...state,
        geneSearchResults: {},
        geneSearching: true,
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
      };
    // Revert param values to default
    case GENE_SEARCH_RESET: {
      return {
        ...state,
        geneSearchResults: {},
        geneSearchParams: defaultGeneSearchParams,
        geneSearching: false,
        geneSearchError: '',
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

      params.filters = newFilters;

      return {
        ...state,
        geneSearchParams: params,
      };
    }
    default:
      return state;
  }
}
