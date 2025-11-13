import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import FeaturedCarousel from '../components/featuredCarousel';

// Mock Embla Carousel
vi.mock('embla-carousel-react', () => ({
  default: vi.fn(() => [vi.fn(), null]),
}));

vi.mock('embla-carousel-autoplay', () => ({
  default: vi.fn(() => ({})),
}));

vi.mock('../components/featuredCarouselButton', () => ({
  DotButton: ({ children, onClick, className }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
  useDotButton: () => ({
    selectedIndex: 0,
    scrollSnaps: [0, 1, 2, 3],
    onDotButtonClick: vi.fn(),
  }),
}));

// Wrapper component for tests
const TestWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FeaturedCarousel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders carousel wrapper with embla classes', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    expect(document.querySelector('.embla')).toBeInTheDocument();
    expect(document.querySelector('.embla__viewport')).toBeInTheDocument();
    expect(document.querySelector('.embla__container')).toBeInTheDocument();
  });

  test('renders all 4 carousel items', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    expect(screen.getAllByText("What's New")).toHaveLength(2); // Title + button
    expect(screen.getAllByText('Browse by Gene')).toHaveLength(2);
    expect(screen.getAllByText('Data Download')).toHaveLength(2);
    expect(screen.getAllByText('Working with MoTrPAC Data')).toHaveLength(2);
  });

  test('renders all carousel items with descriptions', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    expect(screen.getByText(/Stay up-to-date on the latest research findings/i)).toBeInTheDocument();
    expect(screen.getByText(/Search and analyze gene-centric exercise response data/i)).toBeInTheDocument();
    expect(screen.getByText(/Access comprehensive, publicly available datasets/i)).toBeInTheDocument();
    expect(screen.getByText(/Look up clinical biospecimen data curated/i)).toBeInTheDocument();
  });

  test('renders all carousel navigation buttons', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    const navButtons = screen.getAllByRole('button');
    expect(navButtons).toHaveLength(4);
    expect(screen.getByText("What's New", { selector: 'button' })).toBeInTheDocument();
    expect(screen.getByText('Browse by Gene', { selector: 'button' })).toBeInTheDocument();
    expect(screen.getByText('Data Download', { selector: 'button' })).toBeInTheDocument();
    expect(screen.getByText('Working with MoTrPAC Data', { selector: 'button' })).toBeInTheDocument();
  });

  test('renders Bootstrap icons for each carousel item', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    expect(document.querySelector('.bi-stars')).toBeInTheDocument();
    expect(document.querySelector('.bi-search')).toBeInTheDocument();
    expect(document.querySelector('.bi-cloud-arrow-down-fill')).toBeInTheDocument();
    expect(document.querySelector('.bi-bar-chart-line-fill')).toBeInTheDocument();
  });

  test('carousel items have correct structure', () => {
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    const carouselItems = document.querySelectorAll('.embla__slide');
    expect(carouselItems).toHaveLength(4);

    carouselItems.forEach(item => {
      expect(item.querySelector('.featured-carousel-item-header')).toBeInTheDocument();
      expect(item.querySelector('.featured-carousel-item-icon')).toBeInTheDocument();
      expect(item.querySelector('.featured-carousel-item-title')).toBeInTheDocument();
      expect(item.querySelector('.featured-carousel-item-description')).toBeInTheDocument();
    });
  });

  test('navigation buttons can be clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <FeaturedCarousel />
      </TestWrapper>
    );

    const browseByGeneButton = screen.getByText('Browse by Gene', { selector: 'button' });
    await user.click(browseByGeneButton);
    
    // Verify the button click doesn't throw errors
    expect(browseByGeneButton).toBeInTheDocument();
  });
});
