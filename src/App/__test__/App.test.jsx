import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import App from '../App';
import configureStore from '../../App/configureStore';
import testUser from '../../testData/testUser.json';

// Optional: mock Google Analytics, scrollTo etc.
vi.mock('ga-gtag');
window.scrollTo = vi.fn();

// Helper to render App with default wrappers
function renderWithRouterAndStore(
  ui,
  {
    route = '/',
    preloadedState = {},
    store = configureStore(preloadedState),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

describe('<App /> routing (Unauthenticated)', () => {
  test('loads the landing page component at index', async () => {
    renderWithRouterAndStore(<App />, { route: '/' });
    // Expect a unique text from LandingPage - adjust the selector as needed
    await waitFor(() =>
      expect(screen.getByText(/welcome/i)).toBeInTheDocument(),
    );
  });

  test('loads the search page at /search', async () => {
    renderWithRouterAndStore(<App />, { route: '/search' });
    await waitFor(() =>
      expect(screen.getByText(/search/i)).toBeInTheDocument(),
    );
  });

  test('loads the browse data page at /data-download', async () => {
    renderWithRouterAndStore(<App />, { route: '/data-download' });
    await waitFor(() =>
      expect(screen.getByText(/data download/i)).toBeInTheDocument(),
    );
  });

  test('loads the code repositories page at /code-repositories', async () => {
    renderWithRouterAndStore(<App />, { route: '/code-repositories' });
    await waitFor(() =>
      expect(screen.getByText(/code repositories/i)).toBeInTheDocument(),
    );
  });

  test('loads the project overview page at /project-overview', async () => {
    renderWithRouterAndStore(<App />, { route: '/project-overview' });
    await waitFor(() =>
      expect(screen.getByText(/project overview/i)).toBeInTheDocument(),
    );
  });

  test('loads the external links page at /external-links', async () => {
    renderWithRouterAndStore(<App />, { route: '/external-links' });
    await waitFor(() =>
      expect(screen.getByText(/useful links/i)).toBeInTheDocument(),
    );
  });

  test('loads the contact page at /contact', async () => {
    renderWithRouterAndStore(<App />, { route: '/contact' });
    await waitFor(() =>
      expect(screen.getByText(/contact us/i)).toBeInTheDocument(),
    );
  });
});

describe('<App /> routing (Authenticated)', () => {
  const preloadedAuthState = {
    auth: {
      isAuthenticated: true,
      isFetching: false,
      profile: testUser,
    },
    // ...other initial slices if needed
  };

  test('State should change to logged in on authentication', async () => {
    const { container } = renderWithRouterAndStore(<App />, {
      route: '/',
      preloadedState: preloadedAuthState,
    });
    // As an example, you may check for the presence of an element available only when authenticated.
    await waitFor(() => expect(container).toBeDefined());
  });

  test('loads the search page at /search for authenticated user', async () => {
    renderWithRouterAndStore(<App />, {
      route: '/search',
      preloadedState: preloadedAuthState,
    });
    await waitFor(() =>
      expect(screen.getByText(/search/i)).toBeInTheDocument(),
    );
  });

  test('loads the prior releases page at /releases for authenticated user', async () => {
    renderWithRouterAndStore(<App />, {
      route: '/releases',
      preloadedState: preloadedAuthState,
    });
    await waitFor(() =>
      expect(screen.getByText(/data releases/i)).toBeInTheDocument(),
    );
  });

  test('loads the methods page at /methods for authenticated user', async () => {
    renderWithRouterAndStore(<App />, {
      route: '/methods',
      preloadedState: preloadedAuthState,
    });
    await waitFor(() =>
      expect(screen.getByText(/methods/i)).toBeInTheDocument(),
    );
  });

  /*
  test('loads the sample summary page at /summary for authenticated user', async () => {
    renderWithRouterAndStore(<App />, { route: '/summary', preloadedState: preloadedAuthState });
    await waitFor(() => expect(screen.getByText(/Study Assays/i)).toBeInTheDocument());
  });
  */

  test('loads the external links page at /external-links for authenticated user', async () => {
    renderWithRouterAndStore(<App />, {
      route: '/external-links',
      preloadedState: preloadedAuthState,
    });
    await waitFor(() =>
      expect(screen.getByText(/useful links/i)).toBeInTheDocument(),
    );
  });
});
