import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * InputField Component
 * Handles user input for the AI assistant chat
 */

const InputField = ({ onSubmit, isLoading, placeholder }) => {
  const [query, setQuery] = useState('');

  const handleChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const trimmedQuery = query.trim();
      if (!trimmedQuery || isLoading) return;

      onSubmit(trimmedQuery);
      setQuery('');
    },
    [query, isLoading, onSubmit],
  );

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      // Cmd+Enter or Ctrl+Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          required
          aria-label="Message input"
          aria-describedby="send-button"
        />
        <div className="input-group-append">
          <button
            id="send-button"
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !query.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                  aria-hidden="true"
                />
                Sending
              </>
            ) : (
              <>
                <i className="bi bi-send-fill mr-2" aria-hidden="true" />
                Send
              </>
            )}
          </button>
        </div>
      </div>
      <small className="form-text text-muted mt-2">
        <i className="bi bi-keyboard mr-1" aria-hidden="true" />
        Tip: Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to send
      </small>
    </form>
  );
};

InputField.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default InputField;
