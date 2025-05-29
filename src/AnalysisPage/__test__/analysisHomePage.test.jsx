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

describe('Connected Animal Analysis Page', () => {
  beforeEach(() => {
    renderWithProviders(
      <AnalysisHomePageConnected match={{ params: { subjectType: 'animal' } }} />,
      { preloadedState: loggedInRootState }
    );
  });

  test('shows analysis cards and handles navigation', async () => {
    if (anyAnalysisActive) {
      const user = userEvent.setup();
      
      // Initially shows analysis cards
      expect(screen.getAllByTestId('analysis-card')).not.toHaveLength(0);

      // Click first active analysis
      const activeAnalysis = screen.getByTestId('active-analysis-PHENOTYPE');
      await user.click(activeAnalysis);

      // Should show animal data analysis component
      expect(screen.getByTestId('animal-data-analysis')).toBeInTheDocument();
      
      // Click back button
      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      // Should show analysis cards again
      expect(screen.getAllByTestId('analysis-card')).not.toHaveLength(0);
    } else {
      expect(screen.queryByTestId('active-analysis')).not.toBeInTheDocument();
    }
  }, 10000); // Icrease timeout for async operations
});

// Disabling this test because this UI is not implemented
/*
describe('Connected Human Analysis Page', () => {
  test('shows only inactive analysis cards', () => {
    renderWithProviders(
      <AnalysisHomePageConnected match={{ params: { subjectType: 'human' } }} />,
      { preloadedState: loggedInRootState }
    );

    const analysisCards = screen.getAllByTestId('analysis-card');
    expect(analysisCards).not.toBeInTheDocument();
    
    // Verify no active analyses
    expect(screen.queryByTestId('active-analysis')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sub-analysis-card')).not.toBeInTheDocument();
  });
});
*/
