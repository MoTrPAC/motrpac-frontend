import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { v4 as uuidv4 } from 'uuid';
import MessageList from './MessageList.jsx';
import InputField from './InputField.jsx';
import ReferencePanel from './ReferencePanel.jsx';
import { askAI, saveConversation } from './services/aiChatService';

import '@styles/aiAssistant.scss';

/**
 * AskAssistant Component
 * Main AI Assistant interface with chat functionality
 */

const AskAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReferencePanel, setShowReferencePanel] = useState(false);
  const messagesEndRef = useRef(null);
  const lastSavedCountRef = useRef(0);
  const saveInFlightRef = useRef(false);
  const saveVersionRef = useRef(0);

  // Auth state
  const { isAuthenticated, profile, accessToken } = useSelector(
    (state) => state.auth,
  );
  const userType = profile.user_metadata && profile.user_metadata.userType;
  const userId = profile.nickname || profile.email || '';

  // Namespaced sessionStorage keys to prevent cross-user leakage
  const convKey = `motrpac-conversation-id-${userId}`;
  const histKey = `motrpac-chat-history-${userId}`;
  const savedCountKey = `motrpac-saved-count-${userId}`;

  // Get or create conversation ID (persists across page refreshes)
  const [conversationId, setConversationId] = useState(
    () => sessionStorage.getItem(convKey) || uuidv4()
  );

  // Save conversation ID to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(convKey, conversationId);
  }, [conversationId, convKey]);

  // Reset state when user identity changes (load their conversation)
  useEffect(() => {
    saveVersionRef.current += 1;

    const savedConvId = sessionStorage.getItem(convKey);
    if (savedConvId) {
      setConversationId(savedConvId);
    } else {
      setConversationId(uuidv4());
    }

    const saved = sessionStorage.getItem(histKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
        const count = parseInt(sessionStorage.getItem(savedCountKey), 10);
        lastSavedCountRef.current = Number.isFinite(count) ? count : 0;
      } catch {
        setMessages([]);
        lastSavedCountRef.current = 0;
      }
    } else {
      setMessages([]);
      lastSavedCountRef.current = 0;
    }
    saveInFlightRef.current = false;
  }, [userId, convKey, histKey, savedCountKey]);

  // Save chat history (sessionStorage + backend with debounce)
  useEffect(() => {
    if (messages.length === 0) return;

    // Save to sessionStorage immediately (fast local backup)
    sessionStorage.setItem(histKey, JSON.stringify(messages));

    // Debounced save to backend (3 seconds after last message)
    const versionAtSchedule = saveVersionRef.current;
    const timeoutId = setTimeout(async () => {
      if (accessToken && !saveInFlightRef.current) {
        saveInFlightRef.current = true;
        const offset = lastSavedCountRef.current;
        const ok = await saveConversation(conversationId, messages, accessToken, offset);
        saveInFlightRef.current = false;
        if (ok && saveVersionRef.current === versionAtSchedule) {
          lastSavedCountRef.current = messages.length;
          sessionStorage.setItem(savedCountKey, String(messages.length));
        }
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [messages, conversationId, accessToken, histKey, savedCountKey]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Redirect unauthenticated non-internal users to homepage
  if (!isAuthenticated || userType !== 'internal') {
    return <Navigate to="/" />;
  }

  // Clear chat function
  const clearChat = () => {
    saveVersionRef.current += 1;
    setMessages([]);
    setError(null);
    const newId = uuidv4();
    setConversationId(newId);
    sessionStorage.setItem(convKey, newId);
    sessionStorage.removeItem(histKey);
    sessionStorage.removeItem(savedCountKey);
    lastSavedCountRef.current = 0;
    saveInFlightRef.current = false;
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
    <div
      className="container-fluid d-flex ai-assistant mb-4"
      role="main"
      aria-label="AI Assistant"
    >
      <Helmet>
        <html lang="en" />
        <title>ExerWise - MoTrPAC Data Hub</title>
      </Helmet>
      <div className="row justify-content-center flex-grow-1 h-100">
        <div
          className={`${showReferencePanel ? 'col-lg-7' : 'col-lg-10 col-xl-8'} d-flex flex-column h-100 py-3`}
        >
          <div
            className="card shadow-sm d-flex flex-column"
            style={{ height: '100%' }}
          >
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 card-title mb-0 d-flex align-items-center">
                  <div
                    className="assistant-header-icon mr-1" aria-hidden="true"
                  >
                    <i className="bi bi-robot text-light" />
                  </div>
                  <span>MoTrPAC ExerWise</span>
                </h1>
              </div>
              <div className="d-flex align-items-center">
                {messages.length > 0 && (
                  <>
                    {/*
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
                    */}
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
                    Example: &ldquo;Give me a brief summary of the MoTrPAC rats
                    endurance training study.&rdquo;
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
            <div className="card-footer bg-white border-top pt-4 pb-3">
              <InputField
                onSubmit={handleSubmit}
                isLoading={isLoading}
                placeholder={
                  messages.length > 0
                    ? 'Ask a follow-up question...'
                    : 'e.g., Give me an overview of the MoTrPAC adult study design'
                }
              />
            </div>
          </div>
          <div className="text-right mt-1 mb-2">
            <small className="text-muted">
              ExerWise is AI and can make mistakes. Please double-check
              responses.
            </small>
          </div>
        </div>
      </div>

      {/* Reference Panel (future split-view) */}
      <ReferencePanel
        isVisible={showReferencePanel}
        onToggle={() => setShowReferencePanel(false)}
      />
    </div>
  );
};

export default AskAssistant;
