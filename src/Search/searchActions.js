import axios from 'axios';
import history from '../App/history';

export const SEARCH_FORM_CHANGE = 'SEARCH_FORM_CHANGE';
export const SEARCH_FORM_ADD_PARAM = 'SEARCH_FORM_ADD_PARAM';
export const SEARCH_FORM_REMOVE_PARAM = 'SEARCH_FORM_REMOVE_PARAM';
export const SEARCH_FORM_SUBMIT = 'SEARCH_FORM_SUBMIT';
export const SEARCH_FORM_SUBMIT_FAILURE = 'SEARCH_FORM_SUBMIT_FAILURE';
export const SEARCH_FORM_SUBMIT_SUCCESS = 'SEARCH_FORM_SUBMIT_SUCCESS';
export const SEARCH_FORM_RESET = 'SEARCH_FORM_RESET';
export const GET_SEARCH_FORM = 'GET_SEARCH_FORM';

function searchFormChange(index, field, e) {
  return {
    type: SEARCH_FORM_CHANGE,
    index,
    field,
    inputValue: e.target.value,
  };
}

function searchFormAddParam() {
  return {
    type: SEARCH_FORM_ADD_PARAM,
  };
}

function searchFormRemoveParam(index) {
  return {
    type: SEARCH_FORM_REMOVE_PARAM,
    index,
  };
}

function searchFormSubmit(params) {
  return {
    type: SEARCH_FORM_SUBMIT,
    params,
  };
}

function searchFormSubmitFailure(message = '') {
  return {
    type: SEARCH_FORM_SUBMIT_FAILURE,
    message,
  };
}

function searchFormSubmitSuccess(payload) {
  return {
    type: SEARCH_FORM_SUBMIT_SUCCESS,
    payload,
  };
}

function searchFormReset() {
  return {
    type: SEARCH_FORM_RESET,
  };
}

function getSearchForm() {
  return {
    type: GET_SEARCH_FORM,
  };
}

// Append search query to URL
function pushHistoryWithQuery(params) {
  const query = params.map((item) => {
    const operator = item.operator && item.operator.length ? item.operator : '';
    return `${operator} (${item.term}:${encodeURI(item.value)})`;
  }).join(' ');

  history.push(`/search?q=${query}`);
}

// FIXME: This function is not yet properly implemented
function handleSearchFormSubmit(params) {
  return (dispatch) => {
    dispatch(searchFormSubmit(params));
    return axios.get('https://api.github.com/search/repositories', {
      params: {
        q: 'reactjs',
        sort: 'stars',
        order: 'desc',
      },
    }).then((response) => {
      dispatch(searchFormSubmitSuccess(response));
      pushHistoryWithQuery(params);
    }).catch((err) => {
      dispatch(searchFormSubmitFailure(`${err.error}: ${err.errorDescription}`));
    });
  };
}

const SearchActions = {
  handleSearchFormSubmit,
  searchFormChange,
  searchFormAddParam,
  searchFormRemoveParam,
  searchFormReset,
  getSearchForm,
};

export default SearchActions;
