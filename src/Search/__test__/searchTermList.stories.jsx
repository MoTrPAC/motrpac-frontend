import React from 'react';
import { action } from '@storybook/addon-actions';
import SearchTermList from '../searchTermList';
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
};

export default {
  title: 'Search Term List',

  decorators: [
    (story) => (
      <div className="searchPage container-fluid">
        <div className="advanced-search-form-container">{story()}</div>
      </div>
    ),
  ],
};

export const Default = () => <SearchTermList {...defaultState} {...actions} />;

export const MultipleTermValuePairs = {
  render: () => <SearchTermList {...multiTermState} {...actions} />,

  name: 'Multiple term/value pairs',
};

export const FormFieldValuesChanged = {
  render: () => <SearchTermList {...changedState} {...actions} />,

  name: 'Form field values changed',
};
