import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Dashboard } from '../dashboard';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';

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
        <Navbar isAuthenticated />
      </header>
      <div className="componentHolder">
        {story()}
      </div>
      <Footer isAuthenticated {...footerActions} profile={testUser} />
    </div>

  ))
  .add('With Test Data', () => <Dashboard profile={testUser} previousUploads={previousUploads} allUploads={allUploads} disconnectComponents isAuthenticated />);
