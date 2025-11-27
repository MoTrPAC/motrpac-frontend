import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AskAssistant = () => {
  const [response, setResponse] = useState('');
  const [hasInternalKnowledge, setHasInternalKnowledge] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get Auth0 token from Redux
  const accessToken = useSelector(state => state.auth.accessToken);
  
  const askQuestion = async (question) => {
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
      const apiUrl = import.meta.env.VITE_API_RAG_SERVICE_ADDRESS;
      
      const res = await fetch(`${apiUrl}/ask`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt: question })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Request failed');
      }
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const lines = decoder.decode(value).split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'metadata') {
              setHasInternalKnowledge(data.hasInternalKnowledge);
            } else if (data.type === 'content') {
              setResponse(prev => prev + data.text);
            } else if (data.type === 'done') {
              setIsLoading(false);
            }
          }
        }
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <form onSubmit={(e) => { 
        e.preventDefault(); 
        const question = e.target.question.value.trim();
        if (question) {
          askQuestion(question);
          e.target.reset();
        }
      }}>
        <input 
          name="question"
          placeholder="Ask a question..."
          className="w-100 p-2 border rounded"
          required
        />
        <button type="submit" disabled={isLoading} className="btn btn-primary ml-2">
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      
      {error && (
        <div className="alert alert-danger mt-2" role="alert">
          {error}
        </div>
      )}
      
      {hasInternalKnowledge && (
        <div className="alert alert-info mt-2" role="alert">
          🔒 Response includes internal knowledge
        </div>
      )}
      
      {response && (
        <div className="mt-4 p-3 border rounded bg-light">
          <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {response}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AskAssistant;
