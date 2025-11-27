import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AskAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [hasInternalKnowledge, setHasInternalKnowledge] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get Auth0 token from Redux
  const accessToken = useSelector(state => state.auth.accessToken);

  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const question = query.trim();
    if (!question || isLoading) return;
    
    // Add user message to conversation history
    const userMessage = {
      id: Date.now(),
      text: question,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setError(null);
    setIsLoading(true);
    setHasInternalKnowledge(false);
    
    // Create placeholder for bot response that will be updated via streaming
    const botMessageId = Date.now() + 1;
    const botMessage = {
      id: botMessageId,
      text: '',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      hasInternalKnowledge: false,
    };
    setMessages(prev => [...prev, botMessage]);
    
    try {
      const headers = { 'Content-Type': 'application/json' };
      
      // Add token if authenticated
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      // Use environment-aware API endpoint
      const apiUrl = import.meta.env.DEV
        ? import.meta.env.VITE_API_SERVICE_ADDRESS_DEV
        : import.meta.env.VITE_API_SERVICE_ADDRESS;
      
      // Prepare conversation history for context
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));
      
      // Use axios with streaming support via responseType: 'stream'
      const res = await axios.post(
        `${apiUrl}/ask`,
        { 
          prompt: question,
          history: history,
        },
        {
          headers,
          responseType: 'text',
          adapter: 'fetch', // Use fetch adapter for streaming
          onDownloadProgress: (progressEvent) => {
            const responseText = progressEvent.event.target.responseText || '';
            const lines = responseText.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  
                  if (data.type === 'metadata') {
                    setHasInternalKnowledge(data.hasInternalKnowledge);
                    // Update bot message with metadata
                    setMessages(prev => prev.map(msg => 
                      msg.id === botMessageId 
                        ? { ...msg, hasInternalKnowledge: data.hasInternalKnowledge }
                        : msg
                    ));
                  } else if (data.type === 'content') {
                    // Update bot message incrementally
                    setMessages(prev => prev.map(msg => 
                      msg.id === botMessageId 
                        ? { ...msg, text: msg.text + data.text }
                        : msg
                    ));
                  } else if (data.type === 'done') {
                    setIsLoading(false);
                  }
                } catch (parseErr) {
                  // Skip malformed JSON lines
                }
              }
            }
          }
        }
      );
      
      // If streaming didn't work, handle as regular response
      if (res.data && typeof res.data === 'string') {
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, text: res.data }
            : msg
        ));
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An unknown error occurred');
      // Remove the placeholder bot message on error
      setMessages(prev => prev.filter(msg => msg.id !== botMessageId));
      setIsLoading(false);
    }
  };
  
  // Render individual message
  const Message = ({ message }) => {
    const isUser = message.sender === 'user';
    
    return (
      <div className={`d-flex align-items-start mb-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div 
          className={`rounded-circle p-2 ${isUser ? 'ml-3' : 'mr-3'}`}
          style={{ 
            width: '40px', 
            height: '40px', 
            flexShrink: 0,
            backgroundColor: isUser ? '#e9ecef' : '#fff',
            border: '1px solid #dee2e6'
          }}
        >
          <i 
            className={`bi ${isUser ? 'bi-person-fill' : 'bi-robot'} text-${isUser ? 'secondary' : 'primary'}`}
            style={{ fontSize: '1.25rem' }}
          />
        </div>
        <div 
          className={`p-3 rounded ${isUser ? 'bg-primary text-white' : 'bg-light border'}`}
          style={{ maxWidth: '75%' }}
        >
          <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {message.text || (
              // Show loading skeleton for empty bot messages
              !isUser && isLoading && (
                <div>
                  <div className="mb-2">
                    <div className="bg-white rounded" style={{ height: '0.75rem', width: '75%' }}>&nbsp;</div>
                  </div>
                  <div className="mb-2">
                    <div className="bg-white rounded" style={{ height: '0.75rem', width: '100%' }}>&nbsp;</div>
                  </div>
                  <div>
                    <div className="bg-white rounded" style={{ height: '0.75rem', width: '85%' }}>&nbsp;</div>
                  </div>
                </div>
              )
            )}
          </div>
          {message.hasInternalKnowledge && (
            <small className="d-block mt-2 text-info">
              <i className="bi bi-lock-fill mr-1" />
              Internal knowledge used
            </small>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="row justify-content-center h-100">
        <div className="col-lg-8 col-xl-7 d-flex flex-column h-100 py-3">
          <div className="card shadow-sm d-flex flex-column" style={{ height: '100%' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-robot mr-2" />
                MoTrPAC AI Assistant
              </h5>
              <small className="text-white-50">
                Ask questions about the MoTrPAC data repository
              </small>
            </div>
            
            {/* Messages area */}
            <div className="card-body flex-grow-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {messages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-chat-dots" style={{ fontSize: '3rem' }} />
                  <p className="mt-3">Start a conversation by asking a question below.</p>
                  <small>Example: "What are the latest dataset releases?"</small>
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    <Message key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* Error alert */}
            {error && (
              <div className="mx-3 mb-3">
                <div className="alert alert-danger d-flex align-items-start mb-0" role="alert">
                  <i className="bi bi-exclamation-triangle-fill mr-2 mt-1" />
                  <div>
                    <strong>Error</strong>
                    <div>{error}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Input form */}
            <div className="card-footer bg-white border-top">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={messages.length > 0 ? "Ask a follow-up question..." : "e.g., What are the latest dataset releases?"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <div className="input-group-append">
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={isLoading || !query.trim()}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill mr-2" />
                          Send
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAssistant;
