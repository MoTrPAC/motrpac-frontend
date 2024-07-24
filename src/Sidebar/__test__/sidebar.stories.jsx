import React from 'react';
import { action } from '@storybook/addon-actions';
import { Sidebar } from '../sidebar';

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

export default {
  title: 'Sidebar',
};

export const Default = () => <Sidebar profile={internalUser} />;

export const InternalUserLoggedIn = {
  render: () => <Sidebar {...internalLoggedInState} {...sidebarActions} />,

  name: 'Internal user logged-in',
};

export const InternalUserLoggedInWithSidebarExpanded = {
  render: () => (
    <Sidebar {...internalLoggedInStateExpanded} {...sidebarActions} />
  ),

  name: 'Internal user logged-in with sidebar expanded',
};

export const ExternalUserLoggedIn = {
  render: () => <Sidebar {...externalLoggedInState} {...sidebarActions} />,

  name: 'External user logged-in',
};

export const ExternalUserLoggedInWithSidebarExpanded = {
  render: () => (
    <Sidebar {...externalLoggedInStateExpanded} {...sidebarActions} />
  ),

  name: 'External user logged-in with sidebar expanded',
};
