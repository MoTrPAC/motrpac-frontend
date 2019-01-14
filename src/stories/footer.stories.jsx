import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Footer } from '../components/footer';

const loggedOutState = {
  isAuthenticated: false,
  login: action('Logging In'),
  logout: action('Logging Out'),
};

const loggedInState = {
  isAuthenticated: true,
  profile: {
    name: 'Test User',
    picture: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y',
    user_metadata: {
      name: 'Test User',
      givenName: 'TestUser',
    },
  },
  login: action('Logging In'),
  logout: action('Logging Out'),
};

storiesOf('Footer', module)
  .add('default', () => <Footer {...loggedOutState} />)
  .add('Logged in', () => <Footer {...loggedInState} />);
