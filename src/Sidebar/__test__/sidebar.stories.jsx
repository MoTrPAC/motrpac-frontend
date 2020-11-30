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

const internalLoggedInStateExpanded = {
  isAuthenticated: true,
  profile: internalUser,
  expanded: true,
};

const externalLoggedInState = {
  isAuthenticated: true,
  profile: externalUser,
};

const externalLoggedInStateExpanded = {
  isAuthenticated: true,
  profile: externalUser,
  expanded: true,
};

const sidebarActions = {
  clearForm: action('clearing form'),
  resetDepth: action('resetting depth'),
  toggleSidebar: action('toggling sidebar'),
};

storiesOf('Sidebar', module)
  .add('Default', () => <Sidebar profile={internalUser} />)
  .add('Internal user logged-in', () => (
    <Sidebar {...internalLoggedInState} {...sidebarActions} />
  ))
  .add('Internal user logged-in with sidebar expanded', () => (
    <Sidebar {...internalLoggedInStateExpanded} {...sidebarActions} />
  ))
  .add('External user logged-in', () => (
    <Sidebar {...externalLoggedInState} {...sidebarActions} />
  ))
  .add('External user logged-in with sidebar expanded', () => (
    <Sidebar {...externalLoggedInStateExpanded} {...sidebarActions} />
  ));
