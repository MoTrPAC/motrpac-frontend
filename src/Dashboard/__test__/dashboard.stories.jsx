import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Dashboard } from '../dashboard';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';
import { Sidebar } from '../../Sidebar/sidebar';

const testUser = require('../../testData/testUser');
const previousUploads = require('../../testData/testPreviousUploads');
const allUploads = require('../../testData/testAllUploads');

const navbarAction = {
  logout: action('logging out'),
};

const footerAction = {
  login: action('logging in'),
};

storiesOf('Dashboard', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar isAuthenticated {...navbarAction} profile={testUser} />
      </header>
      <div className="componentHolder">
        <div className="container-fluid">
          <div className="row">
            <Sidebar isAuthenticated />
            {story()}
          </div>
        </div>
      </div>
      <Footer isAuthenticated {...footerAction} />
    </div>

  ))
  .add('With Test Data', () => <Dashboard previousUploads={previousUploads} allUploads={allUploads} disconnectComponents isAuthenticated />);
