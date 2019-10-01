import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Sidebar } from '../sidebar';

const internalUser = require('../../testData/testUser');

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

const internalLoggedInState = {
  isAuthenticated: true,
  profile: internalUser,
};

const externalLoggedInState = {
  isAuthenticated: true,
  profile: externalUser,
};

const sidebarActions = {
  clearForm: action('clearing form'),
  resetDepth: action('resetting depth'),
};

storiesOf('Sidebar', module)
  .add('Default', () => <Sidebar profile={internalUser} />)
  .add('Internal user logged-in', () => <Sidebar {...internalLoggedInState} {...sidebarActions} />)
  .add('External user logged-in', () => <Sidebar {...externalLoggedInState} {...sidebarActions} />);
