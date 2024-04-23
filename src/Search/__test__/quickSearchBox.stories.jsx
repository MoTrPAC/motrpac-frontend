import React from 'react';
import { action } from '@storybook/addon-actions';
import QuickSearchBox from '../quickSearchBox';
import { defaultQuickSearchState } from '../quickSearchBoxReducer';

const defaultState = {
  ...defaultQuickSearchState,
};

const changedState = {
  ...defaultState,
  quickSearchTerm: 'brown adipose',
};

const actions = {
  handleQuickSearchInputChange: action('Quick search input value changed'),
  handleQuickSearchRequestSubmit: action('Quick search form submitted'),
  resetQuickSearch: action('Quick search form reset'),
  getSearchForm: action('Go to advanced search page'),
};

export default {
  title: 'Quick Search Box',

  decorators: [
    (story) => (
      <div className="quick-search-component container d-flex justify-content-end">
        {story()}
      </div>
    ),
  ],
};

export const Default = () => <QuickSearchBox {...defaultState} {...actions} />;

export const InputValueChanged = {
  render: () => <QuickSearchBox {...changedState} {...actions} />,

  name: 'Input value changed',
};
