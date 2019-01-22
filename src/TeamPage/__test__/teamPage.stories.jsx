import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TeamPage from '../teamPage';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';

const testUser = require('../../testData/testUser');

const footerActions = {
  login: action('logging in'),
  logout: action('logging out'),
};

storiesOf('Team Page', module)
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
  .add('default', () => <TeamPage />);
