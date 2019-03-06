import React from 'react';
import { storiesOf } from '@storybook/react';
import { Sidebar } from '../sidebar';

const loggedInState = {
  isAuthenticated: true,
};

storiesOf('Sidebar', module)
  .add('default', () => <Sidebar />)
  .add('Logged in', () => <Sidebar {...loggedInState} />);
