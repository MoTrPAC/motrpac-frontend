import React from 'react';
import { action } from '@storybook/addon-actions';
import { LandingPage } from '../landingPage';
import { Navbar } from '../../Navbar/navbar';
import Footer from '../../Footer/footer';

const footerActions = {
  login: action('logging in'),
  logout: action('logging out'),
};

export default {
  title: 'Landing Page',

  decorators: [
    (story) => (
      <div className="App">
        <header>
          <Navbar />
        </header>
        <div className="componentHolder mt-5 pt-2">{story()}</div>
        <Footer {...footerActions} />
      </div>
    ),
  ],
};

export const Default = {
  render: () => <LandingPage />,
  name: 'default',
};
