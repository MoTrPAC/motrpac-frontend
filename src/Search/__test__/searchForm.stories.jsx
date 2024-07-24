import React from 'react';
import { action } from '@storybook/addon-actions';
import SearchForm from '../searchForm';
import { defaultSearchState } from '../searchReducer';

const defaultState = {
  ...defaultSearchState,
};

const multiTermState = {
  ...defaultState,
  advSearchParams: [
    {
      term: 'all',
      value: '',
      operator: '',
    },
    {
      term: 'all',
      value: '',
      operator: 'AND',
    },
    {
      term: 'all',
      value: '',
      operator: 'AND',
    },
  ],
};

const changedState = {
  ...defaultState,
  advSearchParams: [
    {
      term: 'assay',
      value: 'rna-seq',
      operator: '',
    },
    {
      term: 'tissue',
      value: 'liver',
      operator: 'AND',
    },
    {
      term: 'gender',
      value: 'male',
      operator: 'OR',
    },
  ],
};

const actions = {
  handleSearchFormChange: action('Advanced search form input value changed'),
  addSearchParam: action('Advanced search form term/value pair added'),
  removeSearchParam: action('Advanced search form term/value pair removed'),
  handleSearchFormSubmit: action('Advanced search form submitted'),
  resetSearchForm: action('Advanced search form reset'),
};

export default {
  title: 'Search Form',

  decorators: [
    (story) => <div className="searchPage container-fluid">{story()}</div>,
  ],
};

export const Default = () => <SearchForm {...defaultState} {...actions} />;

export const MultipleTermValuePairs = {
  render: () => <SearchForm {...multiTermState} {...actions} />,

  name: 'Multiple term/value pairs',
};

export const FormFieldValuesChanged = {
  render: () => <SearchForm {...changedState} {...actions} />,

  name: 'Form field values changed',
};
