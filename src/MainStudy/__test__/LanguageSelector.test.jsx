import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import LanguageSelector from '../components/LanguageSelector';

describe('LanguageSelector Component', () => {
  it('should render language selector dropdown', () => {
    const mockOnChange = vi.fn();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={mockOnChange} />);
    
    expect(screen.getByLabelText(/select page language/i)).toBeInTheDocument();
  });

  it('should display all language options', () => {
    const mockOnChange = vi.fn();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={mockOnChange} />);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
  });

  it('should show correct selected language', () => {
    const mockOnChange = vi.fn();
    render(<LanguageSelector currentLanguage="es" onLanguageChange={mockOnChange} />);
    
    const selector = screen.getByLabelText(/select page language/i);
    expect(selector.value).toBe('es');
  });

  it('should call onLanguageChange when language is changed', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={mockOnChange} />);
    
    const selector = screen.getByLabelText(/select page language/i);
    await user.selectOptions(selector, 'es');
    
    expect(mockOnChange).toHaveBeenCalledWith('es');
  });

  it('should call onLanguageChange with correct value for each option', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={mockOnChange} />);
    
    const selector = screen.getByLabelText(/select page language/i);
    
    // Change to Spanish
    await user.selectOptions(selector, 'es');
    expect(mockOnChange).toHaveBeenCalledWith('es');
    
    // Change to French
    await user.selectOptions(selector, 'fr');
    expect(mockOnChange).toHaveBeenCalledWith('fr');
    
    // Change back to English
    await user.selectOptions(selector, 'en');
    expect(mockOnChange).toHaveBeenCalledWith('en');
  });

  it('should have accessible label', () => {
    const mockOnChange = vi.fn();
    render(<LanguageSelector currentLanguage="en" onLanguageChange={mockOnChange} />);
    
    const selector = screen.getByLabelText(/select page language/i);
    expect(selector).toHaveAttribute('aria-label', 'Select page language');
  });

  it('should have globe icon', () => {
    const mockOnChange = vi.fn();
    const { container } = render(<LanguageSelector currentLanguage="en" onLanguageChange={mockOnChange} />);
    
    const icon = container.querySelector('.bi-globe');
    expect(icon).toBeInTheDocument();
  });

  it('should update selected value when currentLanguage prop changes', () => {
    const mockOnChange = vi.fn();
    const { rerender } = render(
      <LanguageSelector currentLanguage="en" onLanguageChange={mockOnChange} />
    );
    
    let selector = screen.getByLabelText(/select page language/i);
    expect(selector.value).toBe('en');
    
    rerender(<LanguageSelector currentLanguage="fr" onLanguageChange={mockOnChange} />);
    
    selector = screen.getByLabelText(/select page language/i);
    expect(selector.value).toBe('fr');
  });
});
