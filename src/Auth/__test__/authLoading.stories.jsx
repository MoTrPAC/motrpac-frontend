import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AuthLoading } from '../authLoading';

const authActions = {
  authSuccess: action('Authorized!'),
};
storiesOf('Authentication Loading', module)
  .add('Default', () => <AuthLoading authenticating {...authActions} />);
