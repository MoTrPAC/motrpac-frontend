import React from 'react';
import { storiesOf, action } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import { AuthLoading } from '../components/authLoading';

const authActions = {
  authSuccess: action('Authorized!'),
};
storiesOf('Authentication Loading', module)
  .addDecorator(StoryRouter())
  .add('Default', () => <AuthLoading authenticating {...authActions} />);
