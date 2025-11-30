import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageList from './MessageList.jsx';
import InputField from './InputField.jsx';
import ReferencePanel from './ReferencePanel.jsx';
import { askAI } from './services/aiChatService';

const AskAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReferencePanel, setShowReferencePanel] = useState(false);
  const messagesEndRef = useRef(null);

  // Get Auth0 token from Redux
  const accessToken = useSelector((state) => state.auth.accessToken);

  // Load chat history from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('motrpac-chat-history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // Invalid saved data, ignore
      }
    }
  }, []);

  // Save chat history to sessionStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('motrpac-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear chat function
  const clearChat = () => {
    setMessages([]);
    setError(null);
    sessionStorage.removeItem('motrpac-chat-history');
  };

  const handleSubmit = async (question) => {
    if (!question || isLoading) return;

    // Add user message to conversation history
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: question,
        timestamp: Date.now(),
      },
    ]);
    setError(null);
    setIsLoading(true);

    // Add empty assistant message that will be updated via streaming
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        hasInternalKnowledge: false,
      },
    ]);

    try {
      await askAI({
        prompt: question,
        history: messages,
        accessToken,
        onChunk: (text) => {
          // Update last message incrementally
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              ...prev[prev.length - 1],
              content: prev[prev.length - 1].content + text,
            },
          ]);
        },
        onMetadata: (data) => {
          // Update last message with metadata
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              ...prev[prev.length - 1],
              hasInternalKnowledge: data.hasInternalKnowledge,
            },
          ]);
        },
        onComplete: () => {
          setIsLoading(false);
        },
        onError: (errorMessage) => {
          setError(errorMessage);
          // Remove the placeholder assistant message on error
          setMessages((prev) => prev.slice(0, -1));
          setIsLoading(false);
        },
      });
    } catch {
      // Error already handled in onError callback
    }
  };

  return (
    <main
      className="container-fluid d-flex"
      style={{ height: 'calc(100vh - 120px)' }}
      role="main"
      aria-label="AI Assistant"
    >
      <div className="row justify-content-center flex-grow-1 h-100">
        <div
          className={`${showReferencePanel ? 'col-lg-7' : 'col-lg-8 col-xl-7'} d-flex flex-column h-100 py-3`}
        >
          <div
            className="card shadow-sm d-flex flex-column"
            style={{ height: '100%' }}
          >
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h5 card-title mb-0">
                  <i className="bi bi-robot mr-2" aria-hidden="true" />
                  MoTrPAC AI Assistant
                </h1>
                <small className="text-white-50">
                  Ask questions about the MoTrPAC data repository
                </small>
              </div>
              <div className="d-flex align-items-center">
                {messages.length > 0 && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-light mr-2"
                      onClick={() => setShowReferencePanel(!showReferencePanel)}
                      aria-label="Toggle reference panel"
                      aria-pressed={showReferencePanel}
                    >
                      <i
                        className="bi bi-layout-sidebar-inset-reverse"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={clearChat}
                      aria-label="Clear conversation"
                    >
                      <i className="bi bi-trash" aria-hidden="true" /> Clear
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div
              className="card-body flex-grow-1 overflow-auto"
              style={{ maxHeight: 'calc(100vh - 300px)' }}
              tabIndex={0}
            >
              {messages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i
                    className="bi bi-chat-dots"
                    style={{ fontSize: '3rem' }}
                    aria-hidden="true"
                  />
                  <p className="mt-3">
                    Start a conversation by asking a question below.
                  </p>
                  <small>
                    Example: &ldquo;What are the latest dataset releases?&rdquo;
                  </small>
                </div>
              ) : (
                <MessageList
                  messages={messages}
                  isLoading={isLoading}
                  messagesEndRef={messagesEndRef}
                />
              )}
            </div>

            {/* Error alert */}
            {error && (
              <div className="mx-3 mb-3">
                <div
                  className="alert alert-danger d-flex align-items-start mb-0"
                  role="alert"
                >
                  <i
                    className="bi bi-exclamation-triangle-fill mr-2 mt-1"
                    aria-hidden="true"
                  />
                  <div>
                    <strong>Error</strong>
                    <div>{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Input form */}
            <div className="card-footer bg-white border-top">
              <InputField
                onSubmit={handleSubmit}
                isLoading={isLoading}
                placeholder={
                  messages.length > 0
                    ? 'Ask a follow-up question...'
                    : 'e.g., What are the latest dataset releases?'
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reference Panel (future split-view) */}
      <ReferencePanel
        isVisible={showReferencePanel}
        onToggle={() => setShowReferencePanel(false)}
      />
    </main>
  );
};

export default AskAssistant;
