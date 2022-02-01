import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TeamPage } from '../teamPage';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';

const navbarAction = {
  login: action('logging in'),
  logout: action('logging out'),
};

const footerAction = {
  login: action('logging in'),
};

storiesOf('Team Page', module)
  .addDecorator((story) => (
    <div className="App">
      <header>
        <Navbar {...navbarAction} />
      </header>
      <div className="row justify-content-center mt-5 pt-4">{story()}</div>
      <Footer {...footerAction} />
    </div>
  ))
  .add('Default', () => <TeamPage />);
