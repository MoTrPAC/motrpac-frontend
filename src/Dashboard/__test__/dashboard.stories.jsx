import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Dashboard } from '../dashboard';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';
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
  expanded: false,
  release: 'internal',
  phase: 'pass1a_06',
  plot: 'tissue_name',
  sort: 'default',
  showQC: true,
};

const externalLoggedInState = {
  isAuthenticated: true,
  profile: externalUser,
  expanded: false,
  release: 'external',
  phase: 'pass1a_06',
  plot: 'tissue_name',
  sort: 'default',
  showQC: true,
};

const defaultActions = {
  toggleRelease: action('toggle release filter'),
  togglePhase: action('toggle phase filter'),
  togglePlot: action('toggle plot selection'),
  toggleSort: action('toggle sort selection'),
  toggleQC: action('toggle QC checkbox'),
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
  toggleSidebar: action('toggling sidebar'),
};

storiesOf('Dashboard', module)
  .addDecorator((story) => (
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
      <Footer isAuthenticated profile={internalUser} {...footerAction} />
    </div>
  ))
  .add('Internal user view', () => (
    <Dashboard {...internalLoggedInState} {...defaultActions} />
  ))
  .add('External user view', () => (
    <Dashboard {...externalLoggedInState} {...defaultActions} />
  ));
