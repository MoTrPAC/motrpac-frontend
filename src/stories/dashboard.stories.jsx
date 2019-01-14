import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Dashboard } from '../components/dashboard';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';

const data = require('../testData/testUser');

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
      <Footer isAuthenticated {...footerActions} profile={data} />
    </div>

  ))
  .add('default', () => <Dashboard profile={data} isAuthenticated />);
