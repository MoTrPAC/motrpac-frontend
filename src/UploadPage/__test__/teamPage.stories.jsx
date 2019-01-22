import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TeamPage from '../components/teamPage';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';

const footerActions = {
  onLogIn: action('logging in'),
  onLogOut: action('logging out'),
};

storiesOf('Team Page', module)
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
  .add('default', () => <TeamPage />);
