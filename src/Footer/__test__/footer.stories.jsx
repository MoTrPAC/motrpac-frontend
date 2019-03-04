import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Footer } from '../footer';

const loggedOutState = {
  isAuthenticated: false,
  login: action('Logging In'),
};

const loggedInState = {
  isAuthenticated: true,
};

storiesOf('Footer', module)
  .add('default', () => <Footer {...loggedOutState} />)
  .add('Logged in', () => <Footer {...loggedInState} />);
