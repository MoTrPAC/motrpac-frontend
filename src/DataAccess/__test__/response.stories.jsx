import React from 'react';
import { action } from '@storybook/addon-actions';
import RegistrationResponse from '../response';
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
  title: 'New User Registration Response',

  decorators: [
    (story) => (
      <React.Fragment>
        <div className="App">
          <header>
            <Navbar {...navbarActions} />
          </header>
          <div className="justify-content-center dataAccessPage">
            <div className="container mt-5 pt-4">{story()}</div>
          </div>
        </div>
        <Footer {...footerActions} />
      </React.Fragment>
    ),
  ],
};

export const RegistrationSuccess = {
  render: () => <RegistrationResponse status="success" />,

  name: 'Registration success',
};

export const RegistrationError = {
  render: () => <RegistrationResponse status="error" />,
  name: 'Registration error',
};
