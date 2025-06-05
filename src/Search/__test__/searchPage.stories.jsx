import React from 'react';
import { action } from '@storybook/addon-actions';
import { SearchPage } from '../searchPage';
import { Navbar } from '../../Navbar/navbar';
import Footer from '../../Footer/footer';
import { Sidebar } from '../../Sidebar/sidebar';
import { defaultSearchState } from '../searchReducer';

import testUser from '../../testData/testUser';

const defaultState = {
  ...defaultSearchState,
  isAuthenticated: true,
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

const navbarAction = {
  logout: action('logging out'),
};

const footerAction = {
  login: action('logging in'),
};

const sidebarActions = {
  clearForm: action('clearing form'),
  resetDepth: action('resetting depth'),
};

export default {
  title: 'Search Page',

  decorators: [
    (story) => (
      <div className="App">
        <header>
          <Navbar isAuthenticated {...navbarAction} profile={testUser} />
        </header>
        <div className="componentHolder">
          <div className="container-fluid">
            <div className="row">
              <Sidebar isAuthenticated profile={testUser} {...sidebarActions} />
              {story()}
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Footer isAuthenticated {...footerAction} profile={testUser} />
        </div>
      </div>
    ),
  ],
};

export const Default = () => <SearchPage {...defaultState} {...actions} />;

export const MultipleTermValuePairs = {
  render: () => <SearchPage {...multiTermState} {...actions} />,

  name: 'Multiple term/value pairs',
};

export const FormFieldValuesChanged = {
  render: () => <SearchPage {...changedState} {...actions} />,

  name: 'Form field values changed',
};
