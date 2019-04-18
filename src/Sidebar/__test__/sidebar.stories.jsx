import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Sidebar } from '../sidebar';

const testUser = require('../../testData/testUser');

const loggedInState = {
  isAuthenticated: true,
  profile: testUser,
};

const uploadAction = {
  clearForm: action('clearing form'),
};

storiesOf('Sidebar', module)
  .add('default', () => <Sidebar profile={testUser} />)
  .add('Logged in', () => <Sidebar {...loggedInState} {...uploadAction} />);
