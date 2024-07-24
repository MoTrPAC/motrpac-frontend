import React from 'react';
import { action } from '@storybook/addon-actions';
import SearchTermRow from '../searchTermRow';

const defaultState = {
  advSearchParams: [
    {
      term: 'all',
      value: '',
      operator: '',
    },
  ],
  item: {
    term: 'all',
    value: '',
    operator: '',
  },
  termId: 'term-0',
  valueId: 'value-0',
  idx: 0,
};

const newTermState = {
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
  ],
  item: {
    term: 'all',
    value: '',
    operator: 'AND',
  },
  termId: 'term-1',
  valueId: 'value-1',
  idx: 1,
};

const changedState = {
  ...defaultState,
  advSearchParams: [
    {
      term: 'all',
      value: '',
      operator: '',
    },
    {
      term: 'assay',
      value: 'rna-seq',
      operator: 'AND',
    },
  ],
  item: {
    term: 'assay',
    value: 'rna-seq',
    operator: 'AND',
  },
  termId: 'term-1',
  valueId: 'value-1',
  idx: 1,
};

const actions = {
  handleSearchFormChange: action('Advanced search form input value changed'),
  addSearchParam: action('Advanced search form term/value pair added'),
  removeSearchParam: action('Advanced search form term/value pair removed'),
};

export default {
  title: 'Serach Term Item',

  decorators: [
    (story) => (
      <div className="searchPage container-fluid">
        <div className="advanced-search-form-container">
          <ul className="param-list">
            <li className="param-item form-group d-flex align-items-center justify-content-start">
              {story()}
            </li>
          </ul>
        </div>
      </div>
    ),
  ],
};

export const Default = () => <SearchTermRow {...defaultState} {...actions} />;

export const NewTermValuePair = {
  render: () => <SearchTermRow {...newTermState} {...actions} />,

  name: 'New term/value pair',
};

export const FormFieldValuesChanged = {
  render: () => <SearchTermRow {...changedState} {...actions} />,

  name: 'Form field values changed',
};
