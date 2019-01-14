import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Dashboard } from '../components/dashboard';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';

const testUser = require('../testData/testUser');
const previousUploads = require('../testData/testPreviousUploads');
const allUploads = require('../testData/testAllUploads');

const footerActions = {
  onLogIn: action('logging in'),
  onLogOut: action('logging out'),
};

storiesOf('Dashboard', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar loggedIn />
      </header>
      <div className="componentHolder">
        {story()}
      </div>
      <Footer loggedIn {...footerActions} user={{ name: 'Test User', site: 'CAS' }} />
    </div>

  ))
  .add('With Test Data', () => <Dashboard user={testUser} previousUploads={previousUploads} allUploads={allUploads} disconnectComponents loggedIn />);
