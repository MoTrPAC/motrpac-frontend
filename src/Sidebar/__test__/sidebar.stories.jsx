import React from 'react';
import { storiesOf } from '@storybook/react';
import { Sidebar } from '../sidebar';

const testUser = require('../../testData/testUser');

const loggedInState = {
  isAuthenticated: true,
  profile: testUser,
};

storiesOf('Sidebar', module)
  .add('default', () => <Sidebar profile={testUser} />)
  .add('Logged in', () => <Sidebar {...loggedInState} />);
