import '@testing-library/jest-dom';
import React from 'react';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import * as crypto from 'node:crypto';
import 'vitest-canvas-mock';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Automatically unmount and cleanup DOM after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock React Router - only mock Navigate and useNavigate, not useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    // eslint-disable-next-line react/prop-types
    Navigate: ({ to }) => <div data-testid="mock-navigate">Navigate to {to}</div>,
  };
});

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart">Bar Chart</div>,
  Pie: () => <div data-testid="mock-pie-chart">Pie Chart</div>,
  Doughnut: () => <div data-testid="mock-doughnut-chart">Doughnut Chart</div>,
}));

// Fix for 'crypto.getRandomValues() not supported' error
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

// Fix for HTMLMediaElement issues
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  set: () => {},
});

// Mocking Google Analytics
vi.mock('ga-gtag');

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Suppress jsdom navigation warnings (jsdom limitation - doesn't support full navigation)
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Not implemented: navigation')
  ) {
    return; // Suppress jsdom navigation warnings
  }
  originalError.call(console, ...args);
};

// Mock IntersectionObserver
class IntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};
global.sessionStorage = sessionStorageMock;
