import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ExerciseBenefits from '../exerciseBenefits';

// Mock the ReactWordcloud component to avoid canvas issues in tests
vi.mock('react-wordcloud', () => ({
  default: () => <div data-testid="word-cloud">Word Cloud Mock</div>,
}));

// Helper to render component with router
function renderWithRouter(ui, { route = '/exercise-benefits' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
}

describe('ExerciseBenefits Component', () => {
  describe('Default Language (English)', () => {
    it('should render English content by default', async () => {
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        expect(screen.getByText('Benefits of Exercise')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/supported by extensive evidence/i)).toBeInTheDocument();
      expect(screen.getByText('Health Benefit')).toBeInTheDocument();
      expect(screen.getByText('Evidence')).toBeInTheDocument();
    });

    it('should render the language selector', async () => {
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/select page language/i)).toBeInTheDocument();
      });
    });

    it('should render word cloud', async () => {
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        expect(screen.getByTestId('word-cloud')).toBeInTheDocument();
      });
    });

    it('should render benefits table', async () => {
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        expect(screen.getByText(/Reduced risk of all-cause mortality/i)).toBeInTheDocument();
      });
    });

    it('should render references section', async () => {
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        expect(screen.getByText('References:')).toBeInTheDocument();
      });
    });
  });

  describe('Spanish Language', () => {
    it('should render Spanish content when lang=es in URL', async () => {
      renderWithRouter(<ExerciseBenefits />, { route: '/exercise-benefits?lang=es' });
      
      await waitFor(() => {
        expect(screen.getByText('Beneficios del Ejercicio')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/evidencia extensa/i)).toBeInTheDocument();
      expect(screen.getByText('Beneficio para la Salud')).toBeInTheDocument();
      expect(screen.getByText('Evidencia')).toBeInTheDocument();
    });

    it('should update language when Spanish is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        expect(screen.getByText('Benefits of Exercise')).toBeInTheDocument();
      });
      
      const languageSelector = screen.getByLabelText(/select page language/i);
      await user.selectOptions(languageSelector, 'es');
      
      await waitFor(() => {
        expect(screen.getByText('Beneficios del Ejercicio')).toBeInTheDocument();
      });
    });
  });

  describe('French Language', () => {
    it('should render French content when lang=fr in URL', async () => {
      renderWithRouter(<ExerciseBenefits />, { route: '/exercise-benefits?lang=fr' });
      
      await waitFor(() => {
        expect(screen.getByText('Bienfaits de l\'Exercice')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/preuves exhaustives/i)).toBeInTheDocument();
      expect(screen.getByText('Bienfait pour la Santé')).toBeInTheDocument();
      expect(screen.getByText('Preuve')).toBeInTheDocument();
    });

    it('should update language when French is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        expect(screen.getByText('Benefits of Exercise')).toBeInTheDocument();
      });
      
      const languageSelector = screen.getByLabelText(/select page language/i);
      await user.selectOptions(languageSelector, 'fr');
      
      await waitFor(() => {
        expect(screen.getByText('Bienfaits de l\'Exercice')).toBeInTheDocument();
      });
    });
  });

  describe('Invalid Language Handling', () => {
    it('should default to English for unsupported language code', async () => {
      renderWithRouter(<ExerciseBenefits />, { route: '/exercise-benefits?lang=de' });
      
      await waitFor(() => {
        expect(screen.getByText('Benefits of Exercise')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/supported by extensive evidence/i)).toBeInTheDocument();
    });

    it('should default to English for invalid language code', async () => {
      renderWithRouter(<ExerciseBenefits />, { route: '/exercise-benefits?lang=invalid' });
      
      await waitFor(() => {
        expect(screen.getByText('Benefits of Exercise')).toBeInTheDocument();
      });
    });
  });

  describe('Citation Links', () => {
    it('should render citation links correctly', async () => {
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        const citationLinks = screen.getAllByText(/^\d+$/);
        expect(citationLinks.length).toBeGreaterThan(0);
      });
    });

    it('should have citation anchors in references section', async () => {
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        const cite1 = document.getElementById('cite-1');
        expect(cite1).toBeInTheDocument();
      });
    });
  });

  describe('Language Selector Options', () => {
    it('should have all three language options available', async () => {
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        const selector = screen.getByLabelText(/select page language/i);
        const options = selector.querySelectorAll('option');
        expect(options).toHaveLength(3);
        expect(options[0].value).toBe('en');
        expect(options[1].value).toBe('es');
        expect(options[2].value).toBe('fr');
      });
    });

    it('should display native language names in options', async () => {
      renderWithRouter(<ExerciseBenefits />);
      
      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument();
        expect(screen.getByText('Español')).toBeInTheDocument();
        expect(screen.getByText('Français')).toBeInTheDocument();
      });
    });
  });
});
