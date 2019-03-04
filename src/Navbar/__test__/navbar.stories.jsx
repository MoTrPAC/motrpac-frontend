import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Navbar } from '../navbar';

const testUser = require('../../testData/testUser');

const loggedOutState = {
  isAuthenticated: false,
};

const loggedInState = {
  isAuthenticated: true,
  profile: testUser,
  logout: action('Logging Out'),
};

storiesOf('Navbar', module)
  .add('default', () => <Navbar {...loggedOutState} />)
  .add('Logged in', () => <Navbar {...loggedInState} />);
