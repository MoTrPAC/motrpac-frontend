import axios from 'axios';

export const SEARCH_FORM_CHANGE = 'SEARCH_FORM_CHANGE';
export const SEARCH_FORM_ADD_PARAM = 'SEARCH_FORM_ADD_PARAM';
export const SEARCH_FORM_REMOVE_PARAM = 'SEARCH_FORM_REMOVE_PARAM';
export const SEARCH_FORM_SUBMIT = 'SEARCH_FORM_SUBMIT';
export const SEARCH_FORM_SUBMIT_FAILURE = 'SEARCH_FORM_SUBMIT_FAILURE';
export const SEARCH_FORM_SUBMIT_SUCCESS = 'SEARCH_FORM_SUBMIT_SUCCESS';
export const SEARCH_FORM_RESET = 'SEARCH_FORM_RESET';

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

function searchFormSubmit() {
  return {
    type: SEARCH_FORM_SUBMIT,
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

// FIXME: This function is not yet properly implemented
function handleSearchFormSubmit() {
  return (dispatch) => {
    dispatch(searchFormSubmit());
    return axios.get('https://api.github.com/search/repositories', {
      params: {
        q: 'reactjs',
        sort: 'stars',
        order: 'desc',
      },
    }).then((response) => {
      dispatch(searchFormSubmitSuccess(response));
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
};

export default SearchActions;
