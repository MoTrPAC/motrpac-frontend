import React from 'react';
import { storiesOf } from '@storybook/react';
import { Sidebar } from '../sidebar';

storiesOf('Sidebar', module)
  .add('default', () => <Sidebar />)
  .add('Logged in', () => <Sidebar isAuthenticated />);
