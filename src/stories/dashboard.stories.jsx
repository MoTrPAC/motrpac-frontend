import React from 'react';
import { storiesOf } from '@storybook/react';
import { Dashboard } from '../components/dashboard';
import Navbar from '../components/navbar';
import { Footer } from '../components/footer';

const testUser = require('../testData/testUser');

storiesOf('Dashboard', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar />
      </header>
      <div className="componentHolder">
        {story()}
      </div>
      <Footer loggedIn user={{ name: 'Test User', site: 'CAS' }} />
    </div>

  ))
  .add('default', () => <Dashboard user={testUser} />);
