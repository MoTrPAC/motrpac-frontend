import axios from 'axios';

export const CHANGE_RESULT_FILTER = 'CHANGE_RESULT_FILTER';
export const CHANGE_PARAM = 'CHANGE_PARAM';
export const SEARCH_SUBMIT = 'SEARCH_SUBMIT';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_RESET = 'SEARCH_RESET';
export const DOWNLOAD_SUBMIT = 'DOWNLOAD_SUBMIT';
export const DOWNLOAD_FAILURE = 'DOWNLOAD_FAILURE';
export const DOWNLOAD_SUCCESS = 'DOWNLOAD_SUCCESS';

function changeResultFilter(field, filterValue, bound) {
  return {
    type: CHANGE_RESULT_FILTER,
    field,
    filterValue,
    bound,
  };
}

function changeParam(field, paramValue) {
  return {
    type: CHANGE_PARAM,
    field,
    paramValue,
  };
}

function searchSubmit(params, scope) {
  return {
    type: SEARCH_SUBMIT,
    params,
    scope,
  };
}

function searchFailure(searchError = '') {
  return {
    type: SEARCH_FAILURE,
    searchError,
  };
}

function searchSuccess(searchResults) {
  return {
    type: SEARCH_SUCCESS,
    searchResults,
  };
}

function searchReset(scope) {
  return {
    type: SEARCH_RESET,
    scope,
  };
}

function downloadSubmit() {
  return {
    type: DOWNLOAD_SUBMIT,
  };
}

function downloadFailure(downloadError = '') {
  return {
    type: DOWNLOAD_FAILURE,
    downloadError,
  };
}

function downloadSuccess(downloadResults) {
  return {
    type: DOWNLOAD_SUCCESS,
    downloadResults,
  };
}

// Handle search and results filtering events
function handleSearch(params, scope) {
  return (dispatch) => {
    dispatch(searchSubmit(params, scope));
    return axios
      .post(`${process.env.REACT_APP_ES_PROXY_HOST}/search/api`, params)
      .then((response) => {
        if (response.data.error) {
          dispatch(searchFailure(response.data.error));
        }
        dispatch(searchSuccess(response.data));
      })
      .catch((err) => {
        dispatch(searchFailure(`${err.name}: ${err.message}`));
      });
  };
}

// Handle download search results event
function handleSearchDownload(params, analysis) {
  const downloadSearchParams = { ...params };
  downloadSearchParams.fields = [];
  downloadSearchParams.save = true;
  downloadSearchParams.analysis = analysis;
  return (dispatch) => {
    dispatch(downloadSubmit());
    return axios
      .post(
        `${process.env.REACT_APP_ES_PROXY_HOST}/search/api`,
        downloadSearchParams
      )
      .then((response) => {
        if (response.data.error) {
          dispatch(downloadFailure(response.data.error));
        }
        dispatch(downloadSuccess(response.data));
      })
      .catch((err) => {
        dispatch(downloadFailure(`${err.name}: ${err.message}`));
      });
  };
}

const SearchActions = {
  changeParam,
  handleSearch,
  handleSearchDownload,
  searchReset,
  changeResultFilter,
};

export default SearchActions;
