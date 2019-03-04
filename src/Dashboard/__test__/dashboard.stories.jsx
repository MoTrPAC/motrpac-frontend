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

const footerActions = {
  login: action('logging in'),
  logout: action('logging out'),
};

storiesOf('Dashboard', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar isAuthenticated profile={testUser} />
      </header>
      <div className="componentHolder">
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            {story()}
          </div>
        </div>
      </div>
      <Footer isAuthenticated {...footerActions} />
    </div>

  ))
  .add('With Test Data', () => <Dashboard profile={testUser} previousUploads={previousUploads} allUploads={allUploads} disconnectComponents isAuthenticated />);
