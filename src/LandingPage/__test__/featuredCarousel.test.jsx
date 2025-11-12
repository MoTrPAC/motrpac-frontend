import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import FeaturedCarousel from '../components/featuredCarousel';

// Wrapper component for tests
const TestWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FeaturedCarousel Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('renders first carousel item by default', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    expect(screen.getByText("What's New")).toBeInTheDocument();
    expect(screen.getByText(/Stay up-to-date on the latest research findings/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Learn More/i })).toBeInTheDocument();
  });

  test('renders all carousel indicators', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    const indicators = screen.getAllByRole('button', { name: /Go to slide/i });
    expect(indicators).toHaveLength(4);
  });

  test('first indicator is active by default', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    const indicators = screen.getAllByRole('button', { name: /Go to slide/i });
    expect(indicators[0]).toHaveClass('active');
  });

  test('clicking indicator changes active slide', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    const indicators = screen.getAllByRole('button', { name: /Go to slide/i });
    
    await user.click(indicators[2]);
    
    vi.advanceTimersByTime(400);

    await waitFor(() => {
      expect(screen.getByText('Data Download')).toBeInTheDocument();
    });
  });

  test('carousel auto-advances after 5 seconds', async () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    // Initially shows first slide
    expect(screen.getByText("What's New")).toBeInTheDocument();

    // Advance time by 5 seconds + transition
    vi.advanceTimersByTime(5300);

    await waitFor(() => {
      expect(screen.getByText('Browse by Gene')).toBeInTheDocument();
    });
  });

  test('carousel loops back to first item after last item', async () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    // Advance through all 4 slides (5 seconds each + transitions)
    vi.advanceTimersByTime(5300); // Slide 2
    vi.advanceTimersByTime(5000); // Slide 3
    vi.advanceTimersByTime(5000); // Slide 4
    vi.advanceTimersByTime(5300); // Back to Slide 1

    await waitFor(() => {
      expect(screen.getByText("What's New")).toBeInTheDocument();
    });
  });

  test('renders correct link for each carousel item', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    const link = screen.getByRole('link', { name: /Learn More/i });
    expect(link).toHaveAttribute('href', '/announcements');
  });

  test('renders Bootstrap icons for each carousel item', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    const icon = document.querySelector('.bi-stars');
    expect(icon).toBeInTheDocument();
  });

  test('carousel items have correct structure', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    expect(screen.getByText("What's New")).toHaveClass('carousel-title');
    expect(screen.getByRole('link', { name: /View Updates/i })).toHaveClass('carousel-cta');
  });
});
