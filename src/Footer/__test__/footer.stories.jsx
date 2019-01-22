import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Footer } from '../footer';

const testUser = require('../../testData/testUser');

const loggedOutState = {
  isAuthenticated: false,
  login: action('Logging In'),
  logout: action('Logging Out'),
};

const loggedInState = {
  isAuthenticated: true,
  profile: testUser,
  login: action('Logging In'),
  logout: action('Logging Out'),
};

storiesOf('Footer', module)
  .add('default', () => <Footer {...loggedOutState} />)
  .add('Logged in', () => <Footer {...loggedInState} />);
