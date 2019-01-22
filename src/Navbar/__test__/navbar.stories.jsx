import React from 'react';
import { storiesOf } from '@storybook/react';
import { Navbar } from '../navbar';

storiesOf('Navbar', module)
  .add('default', () => <Navbar />)
  .add('Logged in', () => <Navbar isAuthenticated />);
