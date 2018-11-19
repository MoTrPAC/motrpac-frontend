import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Footer } from '../components/footer';

const loggedOutState = {
  loggedIn: false,
  onLogIn: action('Logging In'),
  onLogOut: action('Logging Out'),
};
const loggedInState = {
  loggedIn: true,
  user: {
    name: 'Test User',
  },
  onLogIn: action('Logging In'),
  onLogOut: action('Logging Out'),
};
storiesOf('Footer', module)
  .add('default', () => <Footer {...loggedOutState} />)
  .add('Logged in', () => <Footer {...loggedInState} />);
