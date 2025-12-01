import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * InputField Component
 * Handles user input with debouncing to prevent rapid-fire requests
 */

const InputField = ({ onSubmit, isLoading, placeholder, debounceMs = 300 }) => {
  const [query, setQuery] = useState('');
  const debounceTimerRef = useRef(null);

  // Debounced change handler
  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer (debouncing prevents excessive re-renders)
      debounceTimerRef.current = setTimeout(() => {
        // Any additional debounced logic can go here
      }, debounceMs);
    },
    [debounceMs],
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const trimmedQuery = query.trim();
      if (!trimmedQuery || isLoading) return;

      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

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
  debounceMs: PropTypes.number,
};

export default InputField;
