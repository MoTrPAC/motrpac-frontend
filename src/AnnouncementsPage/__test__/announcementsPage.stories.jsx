import React from 'react';
import { action } from '@storybook/addon-actions';
import AnnouncementsPage from '../announcementsPage';
import { Navbar } from '../../Navbar/navbar';
import Footer from '../../Footer/footer';

const navbarAction = {
  login: action('logging in'),
  logout: action('logging out'),
};

const footerAction = {
  login: action('logging in'),
};

export default {
  title: 'Announcements Page',

  decorators: [
    (story) => (
      <>
        <div className="App">
          <header>
            <Navbar {...navbarAction} />
          </header>
          <div className="row justify-content-center mt-5 pt-4">{story()}</div>
        </div>
        <Footer {...footerAction} />
      </>
    ),
  ],
};

export const Default = () => <AnnouncementsPage />;
