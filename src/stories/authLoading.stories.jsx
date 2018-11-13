import React from 'react';
import { storiesOf, action } from '@storybook/react';
import { AuthLoading } from '../components/authLoading';

const authActions = {
  authSuccess: action('Authorized!'),
};
storiesOf('Authentication Loading', module)
  .add('Default', () => <AuthLoading authenticating {...authActions} />);
