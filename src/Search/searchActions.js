import axios from 'axios';

export const CHANGE_RESULT_FILTER = 'CHANGE_RESULT_FILTER';
export const CHANGE_PARAM = 'CHANGE_PARAM';
export const SEARCH_SUBMIT = 'SEARCH_SUBMIT';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_RESET = 'SEARCH_RESET';

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

function searchSubmit(params) {
  return {
    type: SEARCH_SUBMIT,
    params,
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

function searchReset() {
  return {
    type: SEARCH_RESET,
  };
}

function handleSearch(params) {
  return (dispatch) => {
    dispatch(searchSubmit(params));
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

const SearchActions = {
  changeParam,
  handleSearch,
  searchReset,
  changeResultFilter,
};

export default SearchActions;
