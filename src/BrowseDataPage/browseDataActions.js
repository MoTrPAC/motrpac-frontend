import axios from 'axios';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';
import { entitledPrefixes, loadCollections } from '../lib/collectionFiles';

const CHANGE_FILTER = 'CHANGE_FILTER';
const SORT_CHANGE = 'SORT_CHANGE';
const RECIEVE_UPDATE_LIST = 'RECIEVE_UPDATE_LIST';
const REQUEST_UPDATE_LIST = 'REQUEST_UPDATE_LIST';
const APPLY_FILTERS = 'APPLY_FILTERS';
const RESET_FILTERS = 'RESET_FILTERS';
const URL_FETCH_START = 'URL_FETCH_START';
const URL_FETCH_SUCCESS = 'URL_FETCH_SUCCESS';
const URL_FETCH_FAILURE = 'URL_FETCH_FAILURE';
const DOWNLOAD_REQUEST_SUBMITTED = 'DOWNLOAD_REQUEST_SUBMITTED';
const DOWNLOAD_REQUEST_SUCCESS = 'DOWNLOAD_REQUEST_SUCCESS';
const DOWNLOAD_REQUEST_FAILURE = 'DOWNLOAD_REQUEST_FAILURE';
const RESET_BROWSE_STATE = 'RESET_BROWSE_STATE';
const SELECT_COLLECTIONS_START = 'SELECT_COLLECTIONS_START';
const SELECT_COLLECTIONS_SUCCESS = 'SELECT_COLLECTIONS_SUCCESS';
const SELECT_COLLECTIONS_FAILURE = 'SELECT_COLLECTIONS_FAILURE';
const SELECT_PASS1B_06_DATA = 'SELECT_PASS1B_06_DATA';
const SELECT_PASS1A_06_DATA = 'SELECT_PASS1A_06_DATA';
const SELECT_HUMAN_PRECOVID_SED_ADU_DATA = 'SELECT_HUMAN_PRECOVID_SED_ADU_DATA';
const SELECT_HUMAN_PRECOVID_SED_ADU_EXTERNAL_DATA = 'SELECT_HUMAN_PRECOVID_SED_ADU_EXTERNAL_DATA';

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
  DOWNLOAD_REQUEST_SUBMITTED,
  DOWNLOAD_REQUEST_SUCCESS,
  DOWNLOAD_REQUEST_FAILURE,
  RESET_BROWSE_STATE,
  SELECT_COLLECTIONS_START,
  SELECT_COLLECTIONS_SUCCESS,
  SELECT_COLLECTIONS_FAILURE,
  SELECT_PASS1B_06_DATA,
  SELECT_PASS1A_06_DATA,
  SELECT_HUMAN_PRECOVID_SED_ADU_DATA,
  SELECT_HUMAN_PRECOVID_SED_ADU_EXTERNAL_DATA,
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

function resetBrowseState() {
  return {
    type: RESET_BROWSE_STATE,
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

const bucket = import.meta.env.VITE_DATA_FILE_BUCKET;
const api =
  import.meta.env.DEV
    ? import.meta.env.VITE_API_SERVICE_ADDRESS_DEV
    : import.meta.env.VITE_API_SERVICE_ADDRESS;
const endpoint = import.meta.env.VITE_SIGNED_URL_ENDPOINT;
const fileDownloadEndpoint = import.meta.env.VITE_FILE_DOWNLOAD_ENDPOINT;
const key =
  import.meta.env.DEV
    ? import.meta.env.VITE_API_SERVICE_KEY_DEV
    : import.meta.env.VITE_API_SERVICE_KEY;

function handleUrlFetch(selectedFiles) {
  if (selectedFiles.length === 0) {
    return false;
  }

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
function handleDownloadRequest(email, name, userid, selectedFiles) {
  if (!email || !name || selectedFiles.length === 0) {
    return false;
  }

  // Remove 'auth0|' substring from userid
  const userID = userid
    ? userid.substring(userid.indexOf('|') + 1)
    : 'anonymous';

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
    name,
    user_id: userID,
    email,
    files: fileObjects,
  };

  // Track download request in Google Analytics
  // No longer capture full names and email addresses
  trackEvent(
    'Data Download',
    'selected_files',
    userID,
    JSON.stringify(fileObjects),
  );

  return (dispatch) => {
    dispatch(downloadRequested());
    return axios
      .post(`${api}${fileDownloadEndpoint}/?key=${key}`, requestBody)
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

/**
 * Load collections into the file browser.
 *
 * `prefixes` is what to load; `selection` is what the user actually picked, and
 * they differ in exactly one case: an empty selection means "no constraint", so
 * every collection in the study is loaded while nothing shows as checked. The
 * two are kept apart because the picker cannot otherwise tell "all of them are
 * selected" from "none of them are", which are the same set of files but
 * different UI states.
 *
 * `userType` gates the file rows, not just the collections: a public collection
 * can hold consortium-only files. It is read from the store rather than passed
 * in, so no call site can omit it and quietly widen what gets loaded.
 */
function selectCollections(prefixes, selection = prefixes) {
  return async (dispatch, getState) => {
    dispatch({ type: SELECT_COLLECTIONS_START, prefixes, selection });
    try {
      const userType = getState().auth?.profile?.user_metadata?.userType;
      const files = await loadCollections(prefixes, userType);
      dispatch({ type: SELECT_COLLECTIONS_SUCCESS, prefixes, selection, files });
      return files;
    } catch (error) {
      dispatch({ type: SELECT_COLLECTIONS_FAILURE, prefixes, error: error.message });
      return [];
    }
  };
}

function selectCollection(prefix) {
  return selectCollections([prefix]);
}

/**
 * Load every collection this user may see, so the tissue/assay facets can filter
 * across the whole corpus rather than one collection at a time.
 *
 * Not currently called: the Study picker scopes what loads, and the facets read
 * their options from the built vocabulary rather than from what is in memory.
 * Kept because "load everything I'm entitled to" is the obvious next control if
 * that changes.
 */
function selectAllEntitledCollections(userType) {
  return selectCollections(entitledPrefixes(userType));
}

const actions = {
  changeFilter,
  resetFilters,
  requestUpdateList,
  recieveUpdateList,
  sortChange,
  changePageRequest,
  handleUrlFetch,
  handleDownloadRequest,
  resetBrowseState,
  selectCollection,
  selectCollections,
  selectAllEntitledCollections,
};

export default actions;
