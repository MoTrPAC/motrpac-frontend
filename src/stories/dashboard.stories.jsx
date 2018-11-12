import React from 'react';
import { storiesOf, action } from '@storybook/react';
import { Dashboard } from '../components/dashboard';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';

const testUser = require('../testData/testUser');

const footerActions = {
  onLogIn: action('logging in'),
  onLogOut: action('logging out'),
};

storiesOf('Dashboard', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar />
      </header>
      <div className="componentHolder">
        {story()}
      </div>
      <Footer loggedIn {...footerActions} user={{ name: 'Test User', site: 'CAS' }} />
    </div>

  ))
  .add('default', () => <Dashboard user={testUser} loggedIn />);
