import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Navbar } from '../navbar';

const testUser = require('../../testData/testUser');

const loggedOutState = {
  isAuthenticated: false,
};

const loggedInState = {
  isAuthenticated: true,
  profile: testUser,
};

const actions = {
  logout: action('Logging Out'),
  handleQuickSearchInputChange: action('Quick search input value changed'),
  handleQuickSearchRequestSubmit: action('Quick search form submitted'),
  resetQuickSearch: action('Quick search form reset'),
  getSearchForm: action('Go to advanced search page'),
};

storiesOf('Navbar', module)
  .add('default', () => <Navbar {...loggedOutState} />)
  .add('Logged in', () => <Navbar {...loggedInState} {...actions} />);
