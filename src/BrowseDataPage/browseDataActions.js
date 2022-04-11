import axios from 'axios';

const CHANGE_FILTER = 'CHANGE_FILTER';
const SORT_CHANGE = 'SORT_CHANGE';
const RECIEVE_UPDATE_LIST = 'RECIEVE_UPDATE_LIST';
const REQUEST_UPDATE_LIST = 'REQUEST_UPDATE_LIST';
const APPLY_FILTERS = 'APPLY_FILTERS';
const RESET_FILTERS = 'RESET_FILTERS';
const URL_FETCH_START = 'URL_FETCH_START';
const URL_FETCH_SUCCESS = 'URL_FETCH_SUCCESS';
const URL_FETCH_FAILURE = 'URL_FETCH_FAILURE';

export const types = {
  CHANGE_FILTER,
  SORT_CHANGE,
  RECIEVE_UPDATE_LIST,
  REQUEST_UPDATE_LIST,
  APPLY_FILTERS,
  RESET_FILTERS,
  URL_FETCH_START,
  URL_FETCH_SUCCESS,
  URL_FETCH_FAILURE,
};

function changeFilter(category, filter) {
  return {
    type: CHANGE_FILTER,
    category,
    filter,
  };
}

function requestUpdateList() {
  return {
    type: REQUEST_UPDATE_LIST,
  };
}

function recieveUpdateList(fileCount, files) {
  return {
    type: RECIEVE_UPDATE_LIST,
    files,
    fileCount,
  };
}

function sortChange(column) {
  return {
    type: SORT_CHANGE,
    column,
  };
}

function applyFilters() {
  return {
    type: APPLY_FILTERS,
  };
}

function resetFilters() {
  return {
    type: RESET_FILTERS,
  };
}

function urlFetchStart() {
  return {
    type: URL_FETCH_START,
  };
}

function urlFetchSuccess(results, selectedFiles) {
  return {
    type: URL_FETCH_SUCCESS,
    results,
    selectedFiles,
  };
}

function urlFetchFailure(error = '') {
  return {
    type: URL_FETCH_FAILURE,
    error,
  };
}

// Mock Async Getting List
const files = [];

const fileCount = files.length;

function changePageRequest(maxRows, page) {
  return (dispatch) => {
    dispatch(requestUpdateList());
    return setTimeout(() => {
      // assumes database returned relevant uploads and total count
      dispatch(recieveUpdateList(fileCount, files.slice(maxRows * (page - 1), maxRows * page)));
      dispatch(applyFilters());
    }, 1000);
  };
}
/* Implement later when database more setup, will send request to database for results from a filter
function changeFilterRequest(maxRows, category, filters) {
  return (dispatch) => {
    dispatch(requestUpdateList());
    dispatch(changePage(1));
    return setTimeout(() => {
      // assumes database returned relevant uploads and total count
      dispatch(recieveUpdateList(uploadCount, uploads.slice(maxRows * (page - 1), maxRows * page)));
      dispatch(applyFilters());
    }, 1000);
  };
}
*/

function useNull() {
  return null;
}

function handleUrlFetch(selectedFiles) {
  if (selectedFiles.length === 0) {
    return false;
  }

  const bucket = process.env.REACT_APP_DATA_FILE_BUCKET;
  const api = process.env.REACT_APP_API_SERVICE_ADDRESS;
  const endpoint = process.env.REACT_APP_SIGNED_URL_ENDPOINT;
  const key = process.env.REACT_APP_API_SERVICE_KEY;
  const fileUrls = selectedFiles.map(
    (file) =>
      `${api}${endpoint}?bucket=${bucket}&object=${file.original.object}&key=${key}`
  );

  return (dispatch) => {
    dispatch(urlFetchStart());
    return Promise.all(fileUrls.map((url) => axios.get(url).catch(useNull)))
      .then((results) => {
        dispatch(urlFetchSuccess(results, selectedFiles));
      })
      .catch((err) => {
        dispatch(urlFetchFailure(`${err.error}: ${err.errorDescription}`));
      });
  };
}

const actions = {
  changeFilter,
  resetFilters,
  requestUpdateList,
  recieveUpdateList,
  sortChange,
  changePageRequest,
  handleUrlFetch,
};

export default actions;
