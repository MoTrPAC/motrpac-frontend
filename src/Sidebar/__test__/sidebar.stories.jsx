import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Sidebar } from '../sidebar';

const testUser = require('../../testData/testUser');

const loggedInState = {
  isAuthenticated: true,
  profile: testUser,
};

const sidebarActions = {
  clearForm: action('clearing form'),
  resetDepth: action('resetting depth'),
};

storiesOf('Sidebar', module)
  .add('default', () => <Sidebar profile={testUser} />)
  .add('Logged in', () => <Sidebar {...loggedInState} {...sidebarActions} />);
