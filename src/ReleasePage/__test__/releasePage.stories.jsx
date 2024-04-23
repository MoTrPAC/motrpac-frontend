import React from 'react';
import { action } from '@storybook/addon-actions';
import { ReleasePage } from '../releasePage';
import { Navbar } from '../../Navbar/navbar';
import Footer from '../../Footer/footer';
import { Sidebar } from '../../Sidebar/sidebar';

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

const externalLoggedInState = {
  isAuthenticated: true,
  profile: externalUser,
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
  title: 'Release Page',

  decorators: [
    (story) => (
      <div className="App">
        <header>
          <Navbar isAuthenticated {...navbarAction} profile={internalUser} />
        </header>
        <div className="componentHolder">
          <div className="container-fluid">
            <div className="row mt-5 pt-1">
              <Sidebar
                isAuthenticated
                profile={internalUser}
                {...sidebarActions}
              />
              {story()}
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Footer isAuthenticated {...footerAction} profile={internalUser} />
        </div>
      </div>
    ),
  ],
};

export const InternalUserView = {
  render: () => <ReleasePage {...internalLoggedInState} />,

  name: 'Internal user view',
};

export const ExternalUserView = {
  render: () => <ReleasePage {...externalLoggedInState} />,

  name: 'External user view',
};
