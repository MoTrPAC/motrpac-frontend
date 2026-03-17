import React from 'react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../testUtils/test-utils';
import AskAssistant from '../assistant';
import { defaultRootState } from '../../App/reducers';
import * as aiChatService from '../services/aiChatService';

vi.mock('react-syntax-highlighter', () => ({
  Prism: vi.fn(({ children }) => <pre>{children}</pre>),
}));

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  tomorrow: {},
}));

vi.mock('../services/aiChatService', () => ({
  askAI: vi.fn(),
  saveConversation: vi.fn().mockResolvedValue(false),
}));

// Mock scrollIntoView — not implemented in JSDOM
window.Element.prototype.scrollIntoView = vi.fn();

// Build a sessionStorage mock with store tracking.
// setupTests.jsx assigns a plain object to global.sessionStorage, so we can
// overwrite its methods here to add store-aware behavior for assertions.
let _store = {};
const sessionStorageMock = {
  getItem: vi.fn((key) => _store[key] ?? null),
  setItem: vi.fn((key, value) => {
    _store[key] = String(value);
  }),
  removeItem: vi.fn((key) => {
    delete _store[key];
  }),
  clear: vi.fn(() => {
    _store = {};
  }),
};

// Replace the methods on the global mock installed by setupTests.jsx
Object.assign(global.sessionStorage, sessionStorageMock);

describe('AI Assistant Component', () => {
  const mockAccessToken = 'mock-jwt-token-12345';

  const authenticatedState = {
    ...defaultRootState,
    auth: {
      ...defaultRootState.auth,
      isAuthenticated: true,
      accessToken: mockAccessToken,
      profile: {
        nickname: 'testUser1',
        user_metadata: {
          hasAccess: true,
          userType: 'internal',
        },
      },
    },
  };

  beforeEach(() => {
    // Clear store before clearing mocks (clearAllMocks resets implementations)
    _store = {};
    vi.clearAllMocks();
    // Re-assign store-aware implementations after clearAllMocks wipes them
    sessionStorageMock.getItem.mockImplementation((key) => _store[key] ?? null);
    sessionStorageMock.setItem.mockImplementation((key, value) => {
      _store[key] = String(value);
    });
    sessionStorageMock.removeItem.mockImplementation((key) => {
      delete _store[key];
    });
    sessionStorageMock.clear.mockImplementation(() => {
      _store = {};
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Access Control Tests', () => {
    test('redirects unauthenticated users to homepage', () => {
      renderWithProviders(<AskAssistant />, { preloadedState: defaultRootState });

      expect(screen.queryByText(/motrpac exerwise/i)).not.toBeInTheDocument();
    });

    test('redirects non-internal users to homepage', () => {
      const externalUserState = {
        ...defaultRootState,
        auth: {
          ...defaultRootState.auth,
          isAuthenticated: true,
          accessToken: mockAccessToken,
          profile: {
            user_metadata: {
              hasAccess: true,
              userType: 'external',
            },
          },
        },
      };

      renderWithProviders(<AskAssistant />, { preloadedState: externalUserState });

      expect(screen.queryByText(/motrpac exerwise/i)).not.toBeInTheDocument();
    });
  });

  describe('Component Rendering Tests', () => {
    test('renders the assistant interface with empty state', () => {
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      expect(screen.getByText(/motrpac exerwise/i)).toBeInTheDocument();
      expect(screen.getByText(/start a conversation/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/give me an overview of the motrpac adult study design/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    test('displays example question in empty state', () => {
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      expect(screen.getByText(/give me a brief summary/i)).toBeInTheDocument();
    });

    test('submit button is disabled when input is empty', () => {
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });

    test('submit button is disabled when loading', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      const input = screen.getByPlaceholderText(/give me an overview/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });

      await user.type(input, 'Test question');

      aiChatService.askAI.mockImplementation(() => new Promise(() => {})); // never resolves

      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    test('renders clear conversation button when messages exist', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      expect(screen.queryByRole('button', { name: /clear conversation/i })).not.toBeInTheDocument();

      const input = screen.getByPlaceholderText(/give me an overview/i);
      await user.type(input, 'Test question');

      aiChatService.askAI.mockImplementation(({ onChunk, onComplete }) => {
        onChunk('Test response');
        onComplete();
        return Promise.resolve();
      });

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /clear conversation/i })).toBeInTheDocument();
      });
    });
  });

  describe('User Interaction Tests', () => {
    test('submits question and displays response', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      const input = screen.getByPlaceholderText(/give me an overview/i);
      const question = 'What datasets are available?';

      await user.type(input, question);

      aiChatService.askAI.mockImplementation(({ onChunk, onComplete }) => {
        onChunk('Available datasets include PASS1A.');
        onComplete();
        return Promise.resolve();
      });

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText(question)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText(/available datasets include/i)).toBeInTheDocument();
      });

      expect(input).toHaveValue('');
    });

    test('handles API errors gracefully', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      const input = screen.getByPlaceholderText(/give me an overview/i);
      await user.type(input, 'Test question');

      aiChatService.askAI.mockImplementation(({ onError }) => {
        onError('Network error occurred');
        return Promise.resolve();
      });

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        // The alert contains both <strong>Error</strong> and the message div
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/network error occurred/i)).toBeInTheDocument();
      });
    });

    test('clears chat history and sessionStorage', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      const input = screen.getByPlaceholderText(/give me an overview/i);
      await user.type(input, 'Test question');

      aiChatService.askAI.mockImplementation(({ onChunk, onComplete }) => {
        onChunk('Test response');
        onComplete();
        return Promise.resolve();
      });

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Test question')).toBeInTheDocument();
      });

      const clearButton = screen.getByRole('button', { name: /clear conversation/i });
      await user.click(clearButton);

      expect(screen.queryByText('Test question')).not.toBeInTheDocument();
      expect(screen.getByText(/start a conversation/i)).toBeInTheDocument();
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('motrpac-chat-history-testUser1');
    });

    test('keyboard shortcut (Cmd+Enter) submits question', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      const input = screen.getByPlaceholderText(/give me an overview/i);
      await user.type(input, 'Test question');

      aiChatService.askAI.mockImplementation(({ onChunk, onComplete }) => {
        onChunk('Response');
        onComplete();
        return Promise.resolve();
      });

      await user.click(input);
      await user.keyboard('{Meta>}{Enter}{/Meta}');

      await waitFor(() => {
        expect(screen.getByText('Test question')).toBeInTheDocument();
      });
    });
  });

  describe('SessionStorage Persistence Tests', () => {
    test('loads messages from sessionStorage on mount', () => {
      const savedMessages = [
        { role: 'user', content: 'Previous question', timestamp: Date.now() },
        { role: 'assistant', content: 'Previous answer', timestamp: Date.now() + 1 },
      ];

      sessionStorageMock.getItem.mockImplementation((key) => {
        if (key === 'motrpac-chat-history-testUser1') return JSON.stringify(savedMessages);
        return null;
      });

      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      expect(screen.getByText('Previous question')).toBeInTheDocument();
      expect(screen.getByText('Previous answer')).toBeInTheDocument();
    });

    test('saves messages to sessionStorage after submission', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      const input = screen.getByPlaceholderText(/give me an overview/i);
      await user.type(input, 'New question');

      aiChatService.askAI.mockImplementation(({ onChunk, onComplete }) => {
        onChunk('New answer');
        onComplete();
        return Promise.resolve();
      });

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
          'motrpac-chat-history-testUser1',
          expect.stringContaining('New question')
        );
      });
    });

    test.skip('triggers debounced backend save after 3 seconds', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      const input = screen.getByPlaceholderText(/give me an overview/i);
      await user.type(input, 'Test question');

      aiChatService.askAI.mockImplementation(({ onChunk, onComplete }) => {
        onChunk('Test answer');
        onComplete();
        return Promise.resolve();
      });

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Test question')).toBeInTheDocument();
      });

      // saveConversation should NOT have been called yet (debounce pending)
      expect(aiChatService.saveConversation).not.toHaveBeenCalled();

      // Advance past 3-second debounce
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(aiChatService.saveConversation).toHaveBeenCalledWith(
          expect.any(String),   // conversationId (UUID)
          expect.any(Array),    // messages
          mockAccessToken,
          0                     // offset (first save)
        );
      });
    });
  });

  describe('Service Integration Tests', () => {
    test('calls aiChatService with correct parameters', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      const input = screen.getByPlaceholderText(/give me an overview/i);
      const question = 'Test API call';

      await user.type(input, question);

      aiChatService.askAI.mockImplementation(({ onChunk, onComplete }) => {
        onChunk('Response');
        onComplete();
        return Promise.resolve();
      });

      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(aiChatService.askAI).toHaveBeenCalledWith(
          expect.objectContaining({
            prompt: question,
            history: [],
            accessToken: mockAccessToken,
            onChunk: expect.any(Function),
            onMetadata: expect.any(Function),
            onComplete: expect.any(Function),
            onError: expect.any(Function),
          })
        );
      });
    });

    test('includes conversation history in subsequent requests', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProviders(<AskAssistant />, { preloadedState: authenticatedState });

      const input = screen.getByPlaceholderText(/give me an overview/i);

      await user.type(input, 'First question');
      aiChatService.askAI.mockImplementation(({ onChunk, onComplete }) => {
        onChunk('First answer');
        onComplete();
        return Promise.resolve();
      });
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('First question')).toBeInTheDocument();
      });

      const followUpInput = screen.getByPlaceholderText(/ask a follow-up question/i);
      await user.type(followUpInput, 'Second question');
      aiChatService.askAI.mockImplementation(({ onChunk, onComplete }) => {
        onChunk('Second answer');
        onComplete();
        return Promise.resolve();
      });
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(aiChatService.askAI).toHaveBeenLastCalledWith(
          expect.objectContaining({
            prompt: 'Second question',
            history: expect.arrayContaining([
              expect.objectContaining({ role: 'user', content: 'First question' }),
              expect.objectContaining({ role: 'assistant', content: 'First answer' }),
            ]),
          })
        );
      });
    });
  });
});
