import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import configureStore from '../App/configureStore';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore(preloadedState),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        >
          {children}
        </MemoryRouter>
      </Provider>
    );
  }
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export function renderWithRouter(
  ui,
  {
    route = '/',
    preloadedState = {},
    store = configureStore(preloadedState),
  } = {},
) {
  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[route]}
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        {ui}
      </MemoryRouter>
    </Provider>,
  );
}

// Common test data
export const testUser = {
  email: 'email@example.com',
  picture:
    'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y',
  nickname: 'testUser1',
  name: 'TestUser1',
  user_metadata: {
    name: 'TestUser1',
    givenName: 'Test',
    siteName: 'Stanford',
    hasAccess: true,
    userType: 'internal',
  },
  userid: '',
};

// Common mock functions
export const mockActions = {
  login: vi.fn(),
  logout: vi.fn(),
  handleDataFetch: vi.fn(),
  resetBrowseState: vi.fn(),
  handleAnalysisTypeChange: vi.fn(),
  handleAnalysisSelection: vi.fn(),
  handleAnalysisSubmit: vi.fn(),
};
