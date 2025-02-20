import React from 'react';
import { screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { renderWithProviders, testUser } from '../../testUtils/test-utils';
import { Dashboard } from '../dashboard';
import { defaultDashboardState } from '../dashboardReducer';

const controlActions = {
  toggleRelease: vi.fn(),
  togglePhase: vi.fn(),
  togglePlot: vi.fn(),
  toggleSort: vi.fn(),
  toggleQC: vi.fn(),
};

describe('Dashboard Component', () => {
  test('renders all expected widgets and controls', () => {
    renderWithProviders(
      <Dashboard
        isAuthenticated
        profile={testUser}
        {...defaultDashboardState}
        {...controlActions}
      />
    );

    // Check for main sections
    expect(screen.getByText('Summary of Animal Study Assays')).toBeInTheDocument();
    
    // Check for control buttons (internal user view)
    expect(screen.getByRole('button', { name: 'Internal Release' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'External Release' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'PASS1A 6-Month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'PASS1B 6-Month' })).toBeInTheDocument();

    // Check for main content sections
    expect(screen.getByText('Overview')).toBeInTheDocument();
    
    // Verify active states of buttons
    const internalReleaseBtn = screen.getByRole('button', { name: 'Internal Release' });
    const pass1aBtn = screen.getByRole('button',  { name: 'PASS1A 6-Month' });
    expect(internalReleaseBtn).toHaveClass('active');
    expect(pass1aBtn).toHaveClass('active');
  });

  test('external user view does not show release toggle buttons', () => {
    const externalUser = {
      ...testUser,
      user_metadata: {
        ...testUser.user_metadata,
        userType: 'external'
      }
    };

    renderWithProviders(
      <Dashboard
        isAuthenticated
        profile={externalUser}
        {...defaultDashboardState}
        {...controlActions}
      />
    );

    // Should not show internal/external toggle buttons
    expect(screen.queryByText('Internal Release')).not.toBeInTheDocument();
    expect(screen.queryByText('External Release')).not.toBeInTheDocument();

    // Should show the external user warning message
    expect(screen.getByText(/publication embargo on MoTrPAC data has been extended/i)).toBeInTheDocument();
  });
});
