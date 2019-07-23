import { SearchReducer, defaultSearchState } from '../searchReducer';
import {
  SEARCH_FORM_CHANGE,
  SEARCH_FORM_ADD_PARAM,
  SEARCH_FORM_REMOVE_PARAM,
  SEARCH_FORM_SUBMIT,
  SEARCH_FORM_SUBMIT_FAILURE,
  SEARCH_FORM_SUBMIT_SUCCESS,
  SEARCH_FORM_RESET,
  GET_SEARCH_FORM,
} from '../searchActions';

describe('Search Reducer', () => {
  // Shared variables
  const state = { ...defaultSearchState };
  const params = [
    { term: 'biospecimenid', value: '901', operator: '' },
    { term: 'tissue', value: 'liver', operator: 'AND' },
    { term: 'site', value: 'stanford', operator: 'AND' },
  ];

  // Default state
  test('Returns initial state if no action or state', () => {
    expect(SearchReducer(undefined, {})).toEqual({ ...defaultSearchState });
  });

  // No action, no state changes
  test('Returns state given if no action', () => {
    expect(SearchReducer({ ...defaultSearchState, searchQueryString: '' }, {})).toEqual({ ...defaultSearchState, searchQueryString: '' });
  });

  // Search term/param is changed
  test('Updates term param name after form change', () => {
    const searchFormChangeAction = {
      type: SEARCH_FORM_CHANGE,
      index: 0,
      field: 'term',
      inputValue: 'tissue',
    };
    expect(SearchReducer(defaultSearchState, searchFormChangeAction).advSearchParams[0].term)
      .toEqual(searchFormChangeAction.inputValue);
  });

  // Search input value for the respective term/param is changed
  test('Updates term input value after form change', () => {
    const searchFormChangeAction = {
      type: SEARCH_FORM_CHANGE,
      index: 0,
      field: 'value',
      inputValue: 'liver',
    };
    expect(SearchReducer(defaultSearchState, searchFormChangeAction).advSearchParams[0].value)
      .toEqual(searchFormChangeAction.inputValue);
  });

  // Add a new row/set of operator/term/value to search form
  test('Adds a new set of search params after clicking Add button', () => {
    const len = state.advSearchParams.length;
    const searchFormAddParamAction = {
      type: SEARCH_FORM_ADD_PARAM,
    };
    expect(SearchReducer(defaultSearchState, searchFormAddParamAction).advSearchParams)
      .toHaveLength(Number(len) + 1);
  });

  // Remove a row/set of operator/term/value from search form
  test('Removes an existing set of search params after clicking Remove button', () => {
    const newState = {
      ...state,
      advSearchParams: [...params],
    };
    const len = newState.advSearchParams.length;
    const searchFormRemoveParamAction = {
      type: SEARCH_FORM_REMOVE_PARAM,
      index: 1,
    };
    expect(SearchReducer(newState, searchFormRemoveParamAction).advSearchParams)
      .toHaveLength(Number(len) - 1);
  });

  // User clicks the 'Search' button to submit the search form
  test('Submits search form after clicking Search button', () => {
    const newState = {
      ...state,
      advSearchParams: [...params],
    };
    const searchFormSubmitAction = {
      type: SEARCH_FORM_SUBMIT,
      params: newState.advSearchParams,
    };
    const submitFormState = SearchReducer(newState, searchFormSubmitAction);
    expect(submitFormState.advSearchParams.length).toEqual(3);
    expect(submitFormState.searchQueryString.length).toBeGreaterThan(0);
    expect(submitFormState.isSearchFetching).toBeTruthy();
  });

  // Submitted search fails due to some error
  test('Search submission unsuccessful', () => {
    const newState = {
      ...state,
      advSearchParams: [...params],
      isSearchFetching: true,
    };
    const searchFormSubmitFailureAction = {
      type: SEARCH_FORM_SUBMIT_FAILURE,
      searchError: 'Error 404',
    };
    const submitFormFailState = SearchReducer(newState, searchFormSubmitFailureAction);
    expect(submitFormFailState.advSearchParams.length).toEqual(3);
    expect(submitFormFailState.searchPayload).not.toHaveProperty('data');
    expect(submitFormFailState.isSearchFetching).toBeFalsy();
    expect(submitFormFailState.searchError).toEqual('Error 404');
  });

  // Submitted search successfully returns data
  test('Search submission successfully returns data', () => {
    const newState = {
      ...state,
      advSearchParams: [...params],
      isSearchFetching: true,
    };
    const searchFormSubmitSuccessAction = {
      type: SEARCH_FORM_SUBMIT_SUCCESS,
      searchPayload: { data: { length: 1 } },
    };
    const submitFormSuccessState = SearchReducer(newState, searchFormSubmitSuccessAction);
    expect(submitFormSuccessState.advSearchParams.length).toEqual(3);
    expect(submitFormSuccessState.searchPayload).toHaveProperty('data');
    expect(submitFormSuccessState.isSearchFetching).toBeFalsy();
  });

  // User clicks on the 'Reset' button of the search form
  test('Resets search form after clicking Reset button', () => {
    const newState = {
      ...state,
      advSearchParams: [...params],
    };
    const searchFormResetAction = {
      type: SEARCH_FORM_RESET,
    };
    expect(SearchReducer(newState, searchFormResetAction))
      .toEqual(state);
  });

  // User either clicks on the 'Advanced' link in the header's quick search box
  // or clicks on a tissue samples link on the data summary page (if a prior search
  // was attempted and returned results)
  test('Removes prior search results while retaining prior search criteria', () => {
    const newState = {
      ...state,
      advSearchParams: [...params],
      searchPayload: { data: { length: 1 } },
    };
    const getSearchFormAction = {
      type: GET_SEARCH_FORM,
    };
    const getFormState = SearchReducer(newState, getSearchFormAction);
    expect(getFormState.advSearchParams.length).toEqual(3);
    expect(getFormState.searchPayload).not.toHaveProperty('data');
    expect(getFormState.searchQueryString.length).toBeLessThan(1);
  });
});
