import React from 'react';
import { action } from '@storybook/addon-actions';
import { Methods } from '../methods';
import { Navbar } from '../../Navbar/navbar';
import Footer from '../../Footer/footer';
import { Sidebar } from '../../Sidebar/sidebar';

import testUser from '../../testData/testUser';

const loggedInState = {
  isAuthenticated: true,
  profile: testUser,
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

export default {
  title: 'Methods Page',

  decorators: [
    (story) => (
      <div className="App">
        <header>
          <Navbar isAuthenticated {...navbarAction} profile={testUser} />
        </header>
        <div className="componentHolder">
          <div className="container-fluid">
            <div className="row mt-5 pt-1">
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

export const Default = () => <Methods {...loggedInState} />;
