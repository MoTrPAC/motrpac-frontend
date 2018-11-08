import React from 'react';
import { storiesOf, action } from '@storybook/react';
import Footer from '../components/footer';

const loggedOutState = {
  handleLogInOut: action('Logging In'),
};
const loggedInState = {
  loggedIn: true,
  user: {
    name: 'Test User',
  },
  handleLogInOut: action('Logging Out'),
};
storiesOf('Footer', module)
  .add('default', () => <Footer {...loggedOutState} />)
  .add('Logged in', () => <Footer {...loggedInState} />);
