
const ADD_TO_CART = 'ADD_TO_CART';
const CHANGE_FILTER = 'CHANGE_FILTER';
const VIEW_CART = 'VIEW_CART';
const SORT_CHANGE = 'SORT_CHANGE';
const CHANGE_PAGE = 'CHANGE_PAGE';
const RECIEVE_UPDATE_LIST = 'RECIEVE_UPDATE_LIST';
const ADD_ALL_TO_CART = 'ADD_ALL_TO_CART';
const EMPTY_CART = 'EMPTY_CART';
const REQUEST_UPDATE_LIST = 'REQUEST_UPDATE_LIST';
const APPLY_FILTERS = 'APPLY_FILTERS';

export const types = {
  ADD_TO_CART,
  CHANGE_FILTER,
  VIEW_CART,
  SORT_CHANGE,
  CHANGE_PAGE,
  RECIEVE_UPDATE_LIST,
  ADD_ALL_TO_CART,
  EMPTY_CART,
  REQUEST_UPDATE_LIST,
  APPLY_FILTERS,
};

function addToCart(cartItem) {
  return {
    type: ADD_TO_CART,
    cartItem,
  };
}
function addAllToCart() {
  return {
    type: ADD_ALL_TO_CART,
  };
}
function emptyCart() {
  return {
    type: EMPTY_CART,
  };
}
function changeFilter(category, filter) {
  return {
    type: CHANGE_FILTER,
    category,
    filter,
  };
}

function changePage(page) {
  return {
    type: CHANGE_PAGE,
    page,
  };
}

function requestUpdateList() {
  return {
    type: REQUEST_UPDATE_LIST,
  };
}

function recieveUpdateList(uploadCount, uploads) {
  return {
    type: RECIEVE_UPDATE_LIST,
    uploads,
    uploadCount,
  };
}

function viewCart() {
  return {
    type: VIEW_CART,
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

// Mock Async Getting List
const uploads = require('../testData/testPreviousUploads');

const uploadCount = uploads.length;

function getUpdatedList(params) {
  return (dispatch) => {
    dispatch(requestUpdateList());
    return setTimeout(() => {
      dispatch(recieveUpdateList(uploadCount, uploads.slice(0, 3)));
      dispatch(applyFilters());
    }, 1000);
  };
}

const actions = {
  addToCart,
  changeFilter,
  changePage,
  requestUpdateList,
  recieveUpdateList,
  viewCart,
  sortChange,
  getUpdatedList,
  addAllToCart,
  emptyCart,
};

export default actions;
