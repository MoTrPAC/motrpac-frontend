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

function searchSuccess(searchResults, params, scope) {
  return {
    type: SEARCH_SUCCESS,
    searchResults,
    params,
    scope,
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

const accessToken = import.meta.env.VITE_ES_ACCESS_TOKEN;
const searchServiceHost = import.meta.env.VITE_ES_PROXY_HOST;
const endpoint = import.meta.env.VITE_ES_ENDPOINT;

const headersConfig = {
  headers: {
    Authorization: `bearer ${accessToken}`,
  },
};

// Handle search and results filtering events
function handleSearch(params, inputValue, scope, userType) {
  params.keys = inputValue;

  // if user is 'internal', set 'study' to include 'pass1a06'
  // else set 'study' to exclude 'pass1a06'
  const includesPass1a06 = params.study.includes('pass1a06');
  if (userType && userType === 'internal') {
    if (!params.study.length) {
      params.study = ['pass1b06', 'precawg', 'pass1a06'];
    }
  } else if (!userType || userType === 'external') {
    if (!params.study.length) {
      params.study = ['pass1b06', 'precawg'];
    }
  }

  // Reset all filters if scope is 'all'
  if (scope === 'all') {
    params.filters = {
      tissue: [],
      assay: [],
      sex: [],
      timepoint: [],
      adj_p_value: { min: '', max: '' },
      logFC: { min: '', max: '' },
      p_value: { min: '', max: '' },
    };
  }
  // insert 'is_meta" field to fields array if ktype is 'metab'
  // and delete 'protein_name' field if it exists
  if (params.ktype === 'metab') {
    if (!params.fields.includes('is_meta')) {
      params.fields = ['is_meta', ...params.fields];
    }
    if (params.fields.includes('protein_name')) {
      const index = params.fields.indexOf('protein_name');
      params.fields.splice(index, 1);
    }
  }
  // delete 'is_meta' flag from fields array (if it exists)
  // if ktype is 'protein' or 'gene'
  if (params.ktype === 'protein' || params.ktype === 'gene') {
    if (params.fields.includes('is_meta')) {
      const index = params.fields.indexOf('is_meta');
      params.fields.splice(index, 1);
    }
  }

  return (dispatch) => {
    dispatch(searchSubmit(params, scope));
    return axios
      .post(`${searchServiceHost}${endpoint}`, requestParams, headersConfig)
      .then((response) => {
        if (response.data.error) {
          dispatch(searchFailure(response.data.error));
        }
        dispatch(searchSuccess(response.data, params, scope));
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
  downloadSearchParams.size = 0;

  return (dispatch) => {
    dispatch(downloadSubmit());
    return axios
      .post(`${searchServiceHost}${endpoint}`, downloadSearchParams, headersConfig)
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
