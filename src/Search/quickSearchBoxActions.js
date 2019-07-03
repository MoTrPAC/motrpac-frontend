import axios from 'axios';
import history from '../App/history';

export const QUICK_SEARCH_INPUT_CHANGE = 'QUICK_SEARCH_INPUT_CHANGE';
export const QUICK_SEARCH_REQUEST_SUBMIT = 'QUICK_SEARCH_REQUEST_SUBMIT';
export const QUICK_SEARCH_REQUEST_FAILURE = 'QUICK_SEARCH_REQUEST_FAILURE';
export const QUICK_SEARCH_REQUEST_SUCCESS = 'QUICK_SEARCH_REQUEST_SUCCESS';
export const QUICK_SEARCH_RESET = 'QUICK_SEARCH_RESET';

function quickSearchInputChange(e) {
  return {
    type: QUICK_SEARCH_INPUT_CHANGE,
    inputValue: e.target.value,
  };
}

function quickSearchRequestSubmit(quickSearchTerm) {
  return {
    type: QUICK_SEARCH_REQUEST_SUBMIT,
    quickSearchTerm,
  };
}

function quickSearchRequestFailure(quickSearchError = '') {
  return {
    type: QUICK_SEARCH_REQUEST_FAILURE,
    quickSearchError,
  };
}

function quickSearchRequestSuccess(quickSearchPayload) {
  return {
    type: QUICK_SEARCH_REQUEST_SUCCESS,
    quickSearchPayload,
  };
}

function quickSearchReset() {
  return {
    type: QUICK_SEARCH_RESET,
  };
}

// FIXME: This function is not yet properly implemented
function handleQuickSearchRequestSubmit(quickSearchTerm) {
  return (dispatch) => {
    dispatch(quickSearchRequestSubmit(quickSearchTerm));
    return axios.get('https://api.github.com/search/repositories?q=reactjs%20redux').then((response) => {
      dispatch(quickSearchRequestSuccess(response));
      history.push(`/search?q=${encodeURI(quickSearchTerm)}`);
    }).catch((err) => {
      dispatch(quickSearchRequestFailure(`${err.error}: ${err.errorDescription}`));
    });
  };
}

const QuickSearchBoxActions = {
  handleQuickSearchRequestSubmit,
  quickSearchInputChange,
  quickSearchReset,
};

export default QuickSearchBoxActions;
