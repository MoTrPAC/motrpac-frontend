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

const headersConfig = {
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_ES_ACCESS_TOKEN_DEV}`,
  },
};

// Handle search and results filtering events
function handleSearch(params, scope) {
  const searchParams = { ...params };
  searchParams.filters.adj_p_value = !searchParams.filters.adj_p_value
    ? Number(searchParams.filters.adj_p_value)
    : null;
  searchParams.filters.p_value = !searchParams.filters.p_value
    ? Number(searchParams.filters.p_value)
    : null;
  searchParams.filters.logFC = !searchParams.filters.logFC
    ? Number(searchParams.filters.logFC)
    : null;

  return (dispatch) => {
    dispatch(searchSubmit(params, scope));
    return axios
      .post(
        `${process.env.REACT_APP_ES_PROXY_HOST_DEV}/search/api`,
        searchParams,
        headersConfig
      )
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
  downloadSearchParams.filters.adj_p_value = !downloadSearchParams.filters.adj_p_value
    ? Number(downloadSearchParams.filters.adj_p_value)
    : null;
  downloadSearchParams.filters.p_value = !downloadSearchParams.filters.p_value
    ? Number(downloadSearchParams.filters.p_value)
    : null;
  downloadSearchParams.filters.logFC = !downloadSearchParams.filters.logFC
    ? Number(downloadSearchParams.filters.logFC)
    : null;

  return (dispatch) => {
    dispatch(downloadSubmit());
    return axios
      .post(
        `${process.env.REACT_APP_ES_PROXY_HOST_DEV}/search/api`,
        downloadSearchParams,
        headersConfig
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
