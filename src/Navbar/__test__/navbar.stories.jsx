import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Navbar } from '../navbar';

import internalUser from '../../testData/testUser';

const externalUser = {
  ...internalUser,
  user_metadata: {
    name: 'Test User',
    givenName: 'TestUser',
    siteName: 'Stanford',
    hasAccess: true,
    userType: 'external',
  },
};

const loggedOutState = {
  isAuthenticated: false,
};

const internalLoggedInState = {
  isAuthenticated: true,
  profile: internalUser,
};

const externalLoggedInState = {
  isAuthenticated: true,
  profile: externalUser,
};

const actions = {
  logout: action('Logging Out'),
  handleQuickSearchInputChange: action('Quick search input value changed'),
  handleQuickSearchRequestSubmit: action('Quick search form submitted'),
  resetQuickSearch: action('Quick search form reset'),
  getSearchForm: action('Go to advanced search page'),
};

storiesOf('Navbar', module)
  .add('Default', () => <Navbar {...loggedOutState} />)
  .add('Internal user logged-in', () => (
    <Navbar {...internalLoggedInState} {...actions} />
  ))
  .add('External user logged-in', () => (
    <Navbar {...externalLoggedInState} {...actions} />
  ));
