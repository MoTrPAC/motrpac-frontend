import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Methods } from '../methods';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';
import { Sidebar } from '../../Sidebar/sidebar';

const internalUser = require('../../testData/testUser');

const internalLoggedInState = {
  isAuthenticated: true,
  profile: internalUser,
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

storiesOf('Methods Page', module)
  .addDecorator((story) => (
    <div className="App">
      <header>
        <Navbar isAuthenticated {...navbarAction} profile={internalUser} />
      </header>
      <div className="componentHolder">
        <div className="container-fluid">
          <div className="row">
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
  ))
  .add('Default', () => <Methods {...internalLoggedInState} />);
