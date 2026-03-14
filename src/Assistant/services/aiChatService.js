import axios from 'axios';

/**
 * AI Chat Service - Handles all API communication with the RAG backend
 * Abstracts axios calls and streaming logic for better testability and maintainability
 */

/**
 * Send a message to the AI assistant with streaming response
 * @param {string} prompt - User's question
 * @param {Array} history - Conversation history (last 10 messages)
 * @param {string|null} accessToken - Auth0 JWT token
 * @param {Function} onChunk - Callback for streaming chunks
 * @param {Function} onMetadata - Callback for metadata updates
 * @param {Function} onComplete - Callback when streaming completes
 * @returns {Promise} Axios promise
 */
export const askAI = async ({
  prompt,
  history = [],
  accessToken = null,
  onChunk = () => {},
  onMetadata = () => {},
  onComplete = () => {},
  onError = () => {},
}) => {
  const headers = { 'Content-Type': 'application/json' };

  // Add authentication token if available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Get the appropriate API URL
  const apiUrl = import.meta.env.VITE_API_SERVICE_ADDRESS;
  const apiEndpoint = import.meta.env.VITE_API_RAG_SERVICE_ENDPOINT;
  const apiKey = import.meta.env.VITE_API_SERVICE_KEY;

  // Add API key as a header instead of a query parameter
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  // Limit history to last 10 messages to avoid payload bloat
  const recentHistory = history.slice(-10).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    content: m.content,
  }));

  let processed = 0;

  try {
    await axios.post(
      `${apiUrl}${apiEndpoint}`,
      {
        action: 'ask',  // Explicit action (backend defaults to 'ask' if omitted)
        prompt,
        history: recentHistory,
      },
      {
        headers,
        responseType: 'text',
        onDownloadProgress: (progressEvent) => {
          // Access response text from XHR target
          const xhr = progressEvent.target || progressEvent.currentTarget;
          if (!xhr) return;

          const responseText = xhr.responseText || '';
          const newText = responseText.slice(processed);
          processed = responseText.length;
          const lines = newText.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'metadata') {
                  onMetadata(data);
                } else if (data.type === 'content') {
                  onChunk(data.text);
                } else if (data.type === 'done') {
                  onComplete();
                }
              } catch {
                // Skip malformed JSON lines
              }
            }
          }
        },
      },
    );
  } catch (err) {
    onError(
      err.response?.data?.error || err.message || 'An unknown error occurred',
    );
    throw err;
  }
};

/**
 * Save conversation to backend for persistence and analytics
 * @param {string} conversationId - UUID for this conversation
 * @param {Array} messages - All messages in conversation
 * @param {string} accessToken - Auth0 JWT
 * @param {number} offset - Index of first new message to save (for incremental saves)
 * @returns {Promise<boolean>}
 */
export const saveConversation = async (conversationId, messages, accessToken, offset = 0) => {
  if (!conversationId || !messages || messages.length === 0) {
    return false;
  }

  // Get the appropriate API URL
  const apiUrl = import.meta.env.VITE_API_SERVICE_ADDRESS;
  const apiEndpoint = import.meta.env.VITE_API_RAG_SERVICE_ENDPOINT;
  const apiKey = import.meta.env.VITE_API_SERVICE_KEY;

  try {
    await axios.post(
      `${apiUrl}${apiEndpoint}?key=${apiKey}`,
      {
        action: 'save_conversation',  // Action-based routing
        conversationId,
        messages,
        offset,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000, // 10 second timeout
      },
    );

    return true;
  } catch (err) {
    // Non-blocking - log error but don't throw
    console.error('Failed to save conversation:', err.message);
    return false;
  }
};
