import React from 'react';
import { action } from '@storybook/addon-actions';
import { AuthLoading } from '../authLoading';

const authActions = {
  authSuccess: action('Authorized!'),
};

export default {
  title: 'Authentication Loading',
};

export const Default = () => <AuthLoading authenticating {...authActions} />;
