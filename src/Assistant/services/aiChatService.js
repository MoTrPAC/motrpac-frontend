import axios from 'axios';

/**
 * AI Chat Service - Handles all API communication with the RAG backend
 * Abstracts axios calls and streaming logic for better testability and maintainability
 */

export const askAI = async ({
  prompt,
  history = [],
  conversationId = null,
  userId = null,
  onChunk = () => {},
  onMetadata = () => {},
  onComplete = () => {},
  onError = () => {},
}) => {
  const apiUrl = import.meta.env.VITE_API_SERVICE_ADDRESS;
  const apiEndpoint = import.meta.env.VITE_API_RAG_SERVICE_ENDPOINT;
  const apiKey = import.meta.env.VITE_API_SERVICE_KEY;

  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  // Limit history to last 10 messages to avoid payload bloat
  const recentHistory = history.slice(-10).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    content: m.content,
  }));

  let processed = 0;
  let sseBuffer = '';

  try {
    await axios.post(
      `${apiUrl}${apiEndpoint}`,
      {
        action: 'ask',
        prompt,
        history: recentHistory,
        conversationId,
        userId,
      },
      {
        headers,
        responseType: 'text',
        onDownloadProgress: (progressEvent) => {
          // Access response text from XHR target
          const xhr = progressEvent.target || progressEvent.currentTarget;
          if (!xhr) return;

          const responseText = xhr.responseText || '';
          const newText = sseBuffer + responseText.slice(processed);
          processed = responseText.length;
          const lines = newText.split('\n');

          // Last element may be incomplete; buffer it for the next chunk
          sseBuffer = lines.pop();

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
 * @param {string} userId - Authenticated user ID
 * @param {number} offset - Index of first new message to save (for incremental saves)
 * @returns {Promise<boolean>}
 */
export const saveConversation = async (conversationId, messages, userId, offset = 0) => {
  if (!conversationId || !messages || messages.length === 0 || !userId) {
    return false;
  }

  // Get the appropriate API URL
  const apiUrl = import.meta.env.VITE_API_SERVICE_ADDRESS;
  const apiEndpoint = import.meta.env.VITE_API_RAG_SERVICE_ENDPOINT;
  const apiKey = import.meta.env.VITE_API_SERVICE_KEY;

  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  try {
    await axios.post(
      `${apiUrl}${apiEndpoint}`,
      {
        action: 'save_conversation',
        conversationId,
        userId,
        messages,
        offset,
      },
      {
        headers,
        timeout: 10000,
      },
    );

    return true;
  } catch (err) {
    // Non-blocking - log error but don't throw
    console.error('Failed to save conversation:', err.message);
    return false;
  }
};
