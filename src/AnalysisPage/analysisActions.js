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

function geneSearchSubmit() {
  return {
    type: GENE_SEARCH_SUBMIT,
  };
}

function geneSearchFailure(geneSearchError = '') {
  return {
    type: GENE_SEARCH_FAILURE,
    geneSearchError,
  };
}

function geneSearchSuccess(geneSearchResults) {
  return {
    type: GENE_SEARCH_SUCCESS,
    geneSearchResults,
  };
}

function geneSearchReset() {
  return {
    type: GENE_SEARCH_RESET,
  };
}

function geneSearchChangeFilter(field, filterValue) {
  return {
    type: GENE_SEARCH_CHANGE_FILTER,
    field,
    filterValue,
  };
}

// Handle gene-centric search
function handleGeneCentricSearch(params) {
  return (dispatch) => {
    dispatch(geneSearchSubmit());
    return axios
      .post(`${process.env.REACT_APP_ES_PROXY_HOST}/search/api`, params)
      .then((response) => {
        if (response.data.error) {
          dispatch(geneSearchFailure(response.data.error));
        }
        dispatch(geneSearchSuccess(response.data));
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
};

export default AnalysisActions;
