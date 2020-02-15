import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AnnouncementsPage } from '../announcementsPage';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';

const testUser = require('../../testData/testUser');

const navAction = {
  logout: action('logging out'),
};

const footerAction = {
  login: action('logging in'),
};

storiesOf('Announcements Page', module)
  .addDecorator((story) => (
    <>
      <div className="App">
        <header>
          <Navbar isAuthenticated {...navAction} profile={testUser} />
        </header>
        <div className="row justify-content-center">
          {story()}
        </div>
      </div>
      <Footer isAuthenticated profile={testUser} {...footerAction} />
    </>
  ))
  .add('Default', () => <AnnouncementsPage />);
