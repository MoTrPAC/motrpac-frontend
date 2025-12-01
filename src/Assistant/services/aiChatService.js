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
  const apiUrl = import.meta.env.VITE_API_RAG_SERVICE_ADDRESS;

  // Limit history to last 10 messages to avoid payload bloat
  const recentHistory = history.slice(-10).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  try {
    await axios.post(
      `${apiUrl}/ask`,
      {
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
          const lines = responseText.split('\n');

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
 * Helper to format conversation history for API
 * @param {Array} messages - Array of message objects
 * @returns {Array} Formatted history for API
 */
export const formatHistory = (messages) => {
  return messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));
};
