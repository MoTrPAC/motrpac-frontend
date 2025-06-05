import React from 'react';
import { action } from '@storybook/addon-actions';
import { DataAccessPage } from '../dataAccessPage';
import { Navbar } from '../../Navbar/navbar';
import Footer from '../../Footer/footer';

const navbarActions = {
  login: action('logging in'),
  logout: action('logging out'),
};

const footerActions = {
  login: action('logging in'),
};

export default {
  title: 'Data Access Page',

  decorators: [
    (story) => (
      <div className="App">
        <header>
          <Navbar {...navbarActions} />
        </header>
        <div className="row justify-content-center mt-5 pt-4">{story()}</div>
        <Footer {...footerActions} />
      </div>
    ),
  ],
};

export const Default = () => <DataAccessPage />;
