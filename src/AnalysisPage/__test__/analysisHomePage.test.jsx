import { describe, test, expect, beforeEach, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../testUtils/test-utils';
import AnalysisHomePageConnected, { AnalysisHomePage } from '../analysisHomePage';
import analysisTypes from '../../lib/analysisTypes';
import rootReducer, { defaultRootState } from '../../App/reducers';
import { defaultAnalysisState } from '../analysisReducer';

// Helpers and setup
const anyAnalysisActive = analysisTypes.some(analysis => analysis.active);

const loggedInRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
    profile: {
      user_metadata: {
        userType: 'internal'
      }
    }
  }
};

const analysisActions = {
  onPickAnalysis: vi.fn(),
  goBack: vi.fn(),
};

const constructMatchState = (subject) => ({
  ...defaultAnalysisState,
  isAuthenticated: true,
  match: {
    params: {
      subjectType: subject,
    },
  },
});

describe('Pure Analysis Home Page', () => {
  test('redirects to dashboard if not logged in or has invalid URL', () => {
    renderWithProviders(
      <AnalysisHomePage {...defaultAnalysisState} {...analysisActions} />
    );
    
    expect(screen.getByTestId('mock-navigate')).toBeInTheDocument();
  });

  test('shows correct header and components for valid URLs', () => {
    const matchingSubjects = ['human', 'animal', 'HUMAN', 'ANIMAL'];
    
    matchingSubjects.forEach(subject => {
      const { unmount } = renderWithProviders(
        <AnalysisHomePage
          {...constructMatchState(subject)}
          {...analysisActions}
          profile={{ user_metadata: { userType: 'internal' } }}
        />
      );

      const expectedTitle = `${subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase()} Data Analysis`;
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(expectedTitle);
      
      unmount();
    });
  });
});
