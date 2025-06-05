import axios from 'axios';

export const TOGGLE_WEIGHT_PLOT = 'TOGGLE_WEIGHT_PLOT';
export const TOGGLE_BODY_FAT_PLOT = 'TOGGLE_BODY_FAT_PLOT';
export const TOGGLE_VO2_PLOT = 'TOGGLE_VO2_PLOT';
export const TOGGLE_LACTATE_PLOT = 'TOGGLE_LACTATE_PLOT';
export const GENE_SEARCH_INPUT_CHANGE = 'GENE_SEARCH_INPUT_CHANGE';
export const GENE_SEARCH_SUBMIT = 'GENE_SEARCH_SUBMIT';
export const GENE_SEARCH_FAILURE = 'GENE_SEARCH_FAILURE';
export const GENE_SEARCH_SUCCESS = 'GENE_SEARCH_SUCCESS';
export const GENE_SEARCH_RESET = 'GENE_SEARCH_RESET';
export const GENE_SEARCH_CHANGE_FILTER = 'GENE_SEARCH_CHANGE_FILTER';
export const PASS1AC06_ANALYSIS_CATEGORY_OPTION_CHANGE = 'PASS1AC06_ANALYSIS_CATEGORY_OPTION_CHANGE';

function toggleWeightPlot(weightPlot) {
  return {
    type: TOGGLE_WEIGHT_PLOT,
    weightPlot,
  };
}

function toggleBodyFatPlot(bodyFatPlot) {
  return {
    type: TOGGLE_BODY_FAT_PLOT,
    bodyFatPlot,
  };
}

function toggleVo2Plot(vo2Plot) {
  return {
    type: TOGGLE_VO2_PLOT,
    vo2Plot,
  };
}

function toggleLactatePlot(lactatePlot) {
  return {
    type: TOGGLE_LACTATE_PLOT,
    lactatePlot,
  };
}

function geneSearchInputChange(geneInputValue = '') {
  return {
    type: GENE_SEARCH_INPUT_CHANGE,
    inputValue: geneInputValue,
  };
}

function geneSearchSubmit(scope, input) {
  return {
    type: GENE_SEARCH_SUBMIT,
    scope,
    input,
  };
}

function geneSearchFailure(geneSearchError = '') {
  return {
    type: GENE_SEARCH_FAILURE,
    geneSearchError,
  };
}

function geneSearchSuccess(geneSearchResults, scope) {
  return {
    type: GENE_SEARCH_SUCCESS,
    geneSearchResults,
    scope,
  };
}

function geneSearchReset(scope) {
  return {
    type: GENE_SEARCH_RESET,
    scope,
  };
}

function geneSearchChangeFilter(field, filterValue) {
  return {
    type: GENE_SEARCH_CHANGE_FILTER,
    field,
    filterValue,
  };
}

function pass1ac06AnalysisCategoryOptionChange(category, option) {
  return {
    type: PASS1AC06_ANALYSIS_CATEGORY_OPTION_CHANGE,
    category,
    option,
  };
}

const accessToken =
  import.meta.env.DEV
    ? import.meta.env.VITE_ES_ACCESS_TOKEN_DEV
    : import.meta.env.VITE_ES_ACCESS_TOKEN;
const host =
  import.meta.env.DEV
    ? import.meta.env.VITE_ES_PROXY_HOST_DEV
    : import.meta.env.VITE_ES_PROXY_HOST;
const endpoint = import.meta.env.VITE_ES_ENDPOINT;

const headersConfig = {
  headers: {
    Authorization: `bearer ${accessToken}`,
  },
};

// Handle gene-centric search
function handleGeneCentricSearch(params, geneInputValue, scope) {
  params.keys = geneInputValue;
  // Reset all filters if scope is 'all'
  if (scope === 'all') {
    params.filters = {
      assay: [],
      tissue: [],
    };
  }
  return (dispatch) => {
    dispatch(geneSearchSubmit(scope, geneInputValue));
    return axios
      .post(`${host}${endpoint}`, params, headersConfig)
      .then((response) => {
        if (response.data.error) {
          dispatch(geneSearchFailure(response.data.error));
        }
        dispatch(geneSearchSuccess(response.data, scope));
      })
      .catch((err) => {
        dispatch(geneSearchFailure(`${err.name}: ${err.message}`));
      });
  };
}

const AnalysisActions = {
  toggleWeightPlot,
  toggleBodyFatPlot,
  toggleVo2Plot,
  toggleLactatePlot,
  geneSearchInputChange,
  handleGeneCentricSearch,
  geneSearchReset,
  geneSearchChangeFilter,
  pass1ac06AnalysisCategoryOptionChange,
};

export default AnalysisActions;
