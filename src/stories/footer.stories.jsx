import React from 'react';
import { storiesOf } from '@storybook/react';
import Footer from '../components/footer';

const loggedInState = {
  loggedIn: true,
  user: {
    name: 'Test User',
  },
};
storiesOf('Footer', module)
  .add('default', () => <Footer />)
  .add('Logged in', () => <Footer {...loggedInState} />);
