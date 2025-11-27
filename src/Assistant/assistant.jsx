import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AskAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [hasInternalKnowledge, setHasInternalKnowledge] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get Auth0 token from Redux
  const accessToken = useSelector(state => state.auth.accessToken);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const question = query.trim();
    if (!question) return;
    
    setIsLoading(true);
    setResponse('');
    setError(null);
    setHasInternalKnowledge(false);
    
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
      
      // Use axios with streaming support via responseType: 'stream'
      const res = await axios.post(
        `${apiUrl}/ask`,
        { prompt: question },
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
                  } else if (data.type === 'content') {
                    setResponse(prev => prev + data.text);
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
        setResponse(res.data);
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An unknown error occurred');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">
                <i className="fas fa-robot mr-2" />
                MoTrPAC AI Assistant
              </h5>
              <small className="text-white-50">
                Ask questions about the MoTrPAC data repository
              </small>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., What are the latest dataset releases?"
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
                            Asking...
                          </>
                        ) : (
                          'Ask'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              
              {/* Loading skeleton */}
              {isLoading && !response && (
                <div className="mt-3">
                  <div className="mb-2">
                    <div className="bg-light rounded" style={{ height: '1rem', width: '75%' }}>&nbsp;</div>
                  </div>
                  <div className="mb-2">
                    <div className="bg-light rounded" style={{ height: '1rem', width: '100%' }}>&nbsp;</div>
                  </div>
                  <div>
                    <div className="bg-light rounded" style={{ height: '1rem', width: '85%' }}>&nbsp;</div>
                  </div>
                </div>
              )}
              
              {/* Error alert */}
              {error && (
                <div className="alert alert-danger d-flex align-items-start mt-3" role="alert">
                  <i className="fas fa-exclamation-triangle mr-2 mt-1" />
                  <div>
                    <strong>Error</strong>
                    <div>{error}</div>
                  </div>
                </div>
              )}
              
              {/* Knowledge indicator */}
              {hasInternalKnowledge && (
                <div className="alert alert-info d-flex align-items-center mt-3 mb-0" role="alert">
                  <i className="fas fa-lock mr-2" />
                  Response includes internal knowledge
                </div>
              )}
              
              {/* Response */}
              {response && (
                <div className="mt-3 p-3 bg-light border rounded">
                  <div className="d-flex align-items-start">
                    <div className="bg-white border rounded-circle p-2 mr-3" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                      <i className="fas fa-robot text-primary" style={{ fontSize: '1.25rem' }} />
                    </div>
                    <div className="flex-grow-1">
                      <strong className="d-block mb-2">Answer:</strong>
                      <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {response}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAssistant;
