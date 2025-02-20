import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import RegistrationResponse from '../response';

describe('New user registration response', () => {
  test('renders completion message if succeeded', () => {
    render(<RegistrationResponse status="success" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Registration Completed');
    expect(screen.getByText(/thank you for registering/i)).toBeInTheDocument();
  });

  test('renders incompletion message if failed', () => {
    render(<RegistrationResponse status="error" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Registration Incomplete');
    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
  });

  test('renders auth0 specific error message when user exists', () => {
    render(<RegistrationResponse status="error" errMsg="user already exists" />);
    expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
  });
});
