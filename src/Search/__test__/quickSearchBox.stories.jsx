import React from 'react';
import { storiesOf } from '@storybook/react';
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

storiesOf('Quick Search Box', module)
  .addDecorator(story => (
    <div className="quick-search-component container d-flex justify-content-end">
      {story()}
    </div>
  ))
  .add('Default', () => (
    <QuickSearchBox {...defaultState} {...actions} />
  ))
  .add('Input value changed', () => (
    <QuickSearchBox {...changedState} {...actions} />
  ));
