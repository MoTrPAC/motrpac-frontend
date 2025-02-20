import { describe, expect, test, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, testUser, mockActions } from '../../testUtils/test-utils';
import { Navbar } from '../navbar';

describe('Navbar', () => {
  test('renders without authentication by default', () => {
    renderWithProviders(<Navbar />);
    
    // Should show login button instead of logout
    expect(screen.queryByText(/log out/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    
    // Should show Downloads nav link
    expect(screen.getByText(/downloads/i)).toBeInTheDocument();
  });

  test('displays user info and logout button when authenticated', () => {
    renderWithProviders(
      <Navbar
        profile={testUser}
        isAuthenticated={true}
        {...mockActions}
      />
    );

    expect(screen.getByText(/log out/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /avatar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /avatar/i })).toBeInTheDocument();
  });

  test('renders internal user specific navigation items', () => {
    renderWithProviders(
      <Navbar
        profile={testUser}
        isAuthenticated={true}
        {...mockActions}
      />
    );

    expect(screen.getByText(/rat and human data/i)).toBeInTheDocument();
    
    // Verify dropdown menus exist
    expect(screen.getByText(/explore/i)).toBeInTheDocument();
    expect(screen.getByText(/data access/i)).toBeInTheDocument();
    expect(screen.getByText(/resources/i)).toBeInTheDocument();
    expect(screen.getByText(/help/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
  });
});
