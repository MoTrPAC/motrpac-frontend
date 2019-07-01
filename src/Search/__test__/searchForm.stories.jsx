import React from 'react';
import { storiesOf } from '@storybook/react';
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

storiesOf('Search Form', module)
  .addDecorator(story => (
    <div className="searchPage container-fluid">{story()}</div>
  ))
  .add('Default', () => <SearchForm {...defaultState} {...actions} />)
  .add('Multiple term/value pairs', () => <SearchForm {...multiTermState} {...actions} />)
  .add('Form field values changed', () => <SearchForm {...changedState} {...actions} />);
