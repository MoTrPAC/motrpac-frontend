import { describe, it, expect } from 'vitest';
import { SearchReducer, defaultSearchState } from '../searchReducer';
import {
  CHANGE_RESULT_FILTER,
  CHANGE_PARAM,
  SEARCH_SUBMIT,
  SEARCH_FAILURE,
  SEARCH_SUCCESS,
  SEARCH_RESET,
} from '../searchActions';

describe('Search Reducer', () => {
  // Shared variables
  const state = { ...defaultSearchState };
  const searchParams = {
    ktype: 'gene',
    keys: '',
    omics: 'all',
    filters: {
      tissue: [],
      assay: [],
      sex: [],
      comparison_group: [],
      adj_p_value: { min: '', max: '' },
      logFC: { min: '', max: '' },
      p_value: { min: '', max: '' },
    },
    save: true,
  };

  // Default state
  it('Returns initial state if no action or state', () => {
    expect(SearchReducer(undefined, {})).toEqual({ ...defaultSearchState });
  });

  // No action, no state changes
  it('Returns state given if no action', () => {
    expect(
      SearchReducer({ ...defaultSearchState, searchResults: {} }, {}),
    ).toEqual({ ...defaultSearchState, searchResults: {} });
  });

  // Search result filter is changed
  it('Updates tissue filter value after a tissue is selected', () => {
    const searchResultFiltereAction = {
      type: CHANGE_RESULT_FILTER,
      field: 'tissue',
      filterValue: 'heart',
      bound: null,
    };
    expect(
      SearchReducer(defaultSearchState, searchResultFiltereAction).searchParams
        .filters.tissue,
    ).toContain(searchResultFiltereAction.filterValue);
  });

  // Search input value for the respective term/param is changed
  it('Updates keys param value after a gene is given', () => {
    const searchParamAction = {
      type: CHANGE_PARAM,
      field: 'keys',
      paramValue: 'foxo1',
    };
    expect(
      SearchReducer(defaultSearchState, searchParamAction).searchParams.keys,
    ).toEqual(searchParamAction.paramValue);
  });

  // User clicks the 'Search' button to submit the search request
  it('Submits search request after clicking Search button', () => {
    const newState = {
      ...state,
      searchParams: { ...searchParams },
    };
    const searchSubmitAction = {
      type: SEARCH_SUBMIT,
      params: newState.searchParams,
    };
    const submitFormState = SearchReducer(newState, searchSubmitAction);
    expect(submitFormState.searchParams.ktype).toEqual('gene');
    expect(submitFormState.searchParams.omics).toEqual('all');
    expect(submitFormState.searching).toBeTruthy();
  });

  // Submitted search fails due to some error
  it('Search submission unsuccessful', () => {
    const newState = {
      ...state,
      searchParams: { ...searchParams },
      searching: true,
    };
    const searchFailureAction = {
      type: SEARCH_FAILURE,
      searchError: 'Error 404',
    };
    const submitFormFailState = SearchReducer(newState, searchFailureAction);
    expect(submitFormFailState.searchResults).not.toHaveProperty('result');
    expect(submitFormFailState.searching).toBeFalsy();
    expect(submitFormFailState.searchError).toEqual('Error 404');
  });

  // Submitted search successfully returns data
  it('Search submission successfully returns data', () => {
    const newState = {
      ...state,
      searchParams: { ...searchParams },
      searching: true,
    };
    const searchSuccessAction = {
      type: SEARCH_SUCCESS,
      searchResults: { result: { length: 1 }, total: 1, path: '' },
    };
    const submitFormSuccessState = SearchReducer(newState, searchSuccessAction);
    expect(submitFormSuccessState.searchResults).toHaveProperty('result');
    expect(submitFormSuccessState.searchResults).toHaveProperty('total');
    expect(submitFormSuccessState.searching).toBeFalsy();
  });

  // User clicks on the 'Reset' button of the search form
  it('Resets search form after clicking Reset button', () => {
    const newState = {
      ...state,
      searchParams: { ...searchParams },
    };
    const searchResetAction = {
      type: SEARCH_RESET,
    };
    expect(
      SearchReducer(newState, searchResetAction).searchParams.filters.tissue,
    ).toHaveLength(0);
  });
});
