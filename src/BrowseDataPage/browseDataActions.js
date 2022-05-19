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
const LOAD_DATA_OBJECTS = 'LOAD_DATA_OBJECTS';
const DOWNLOAD_REQUEST_SUBMITTED = 'DOWNLOAD_REQUEST_SUBMITTED';
const DOWNLOAD_REQUEST_SUCCESS = 'DOWNLOAD_REQUEST_SUCCESS';
const DOWNLOAD_REQUEST_FAILURE = 'DOWNLOAD_REQUEST_FAILURE';
const DATA_FETCH_REQUESTED = 'DATA_FETCH_REQUESTED';
const DATA_FETCH_SUCCESS = 'DATA_FETCH_SUCCESS';
const DATA_FETCH_FAILURE = 'DATA_FETCH_FAILURE';

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
  LOAD_DATA_OBJECTS,
  DOWNLOAD_REQUEST_SUBMITTED,
  DOWNLOAD_REQUEST_SUCCESS,
  DOWNLOAD_REQUEST_FAILURE,
  DATA_FETCH_REQUESTED,
  DATA_FETCH_SUCCESS,
  DATA_FETCH_FAILURE,
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

function loadDataObjects(files) {
  return {
    type: LOAD_DATA_OBJECTS,
    files,
  };
}

function downloadRequested() {
  return {
    type: DOWNLOAD_REQUEST_SUBMITTED,
  };
}

function downloadRequestSuccess(results) {
  return {
    type: DOWNLOAD_REQUEST_SUCCESS,
    results,
  };
}

function downloadRequestFailure(error = '') {
  return {
    type: DOWNLOAD_REQUEST_FAILURE,
    error,
  };
}

function dataFetchRequested() {
  return {
    type: DATA_FETCH_REQUESTED,
  };
}

function dataFetchSuccess(results) {
  return {
    type: DATA_FETCH_SUCCESS,
    results,
  };
}

function dataFetchFailure(error = '') {
  return {
    type: DATA_FETCH_FAILURE,
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

// Request to download files
function handleDownloadRequest(email, name, selectedFiles) {
  if (!email || !name || selectedFiles.length === 0) {
    return false;
  }

  const fileObjects = [];
  selectedFiles.forEach((file) => {
    const fileObj = {
      object: file.original.object,
      object_size: file.original.object_size,
      key: file.original.key,
    };
    fileObjects.push(fileObj);
  });

  const requestBody = {
    email,
    name,
    files: fileObjects,
  };

  return (dispatch) => {
    dispatch(downloadRequested());
    return axios
      .post(
        `${process.env.REACT_APP_API_SERVICE_ADDRESS_DEV}${process.env.REACT_APP_FILE_DOWNLOAD_ENDPOINT}/?phase=${process.env.REACT_APP_FILE_DOWNLOAD_PHASE}&key=${process.env.REACT_APP_API_SERVICE_KEY_DEV}`,
        requestBody
      )
      .then((response) => {
        if (response.data.error) {
          dispatch(downloadRequestFailure(response.data.error));
        }
        dispatch(downloadRequestSuccess(response.data));
      })
      .catch((err) => {
        dispatch(downloadRequestFailure(`${err.name}: ${err.message}`));
      });
  };
}

// Fetch Data Objects when page loads
function handleDataFetch() {
  return (dispatch) => {
    dispatch(dataFetchRequested());
    return axios
      .get(
        `${process.env.REACT_APP_API_SERVICE_ADDRESS_DEV}${process.env.REACT_APP_FILE_DOWNLOAD_ENDPOINT}/?phase=${process.env.REACT_APP_FILE_DOWNLOAD_PHASE}&key=${process.env.REACT_APP_API_SERVICE_KEY_DEV}`
      )
      .then((response) => {
        if (response.data.error) {
          dispatch(dataFetchFailure(response.data.error));
        }
        dispatch(dataFetchSuccess(response.data.data));
      })
      .catch((err) => {
        dispatch(dataFetchFailure(`${err.name}: ${err.message}`));
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
  loadDataObjects,
  handleDownloadRequest,
  handleDataFetch,
};

export default actions;
