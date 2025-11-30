import React from 'react';
import PropTypes from 'prop-types';

/**
 * ReferencePanel Component
 * Right panel for displaying documentation, code snippets, and visualizations
 * Currently a placeholder for future enhancement (Claude Desktop-style split view)
 */

const ReferencePanel = ({ isVisible = false, onToggle = () => {} }) => {
  if (!isVisible) return null;

  return (
    <aside
      className="reference-panel border-left bg-light"
      style={{
        minWidth: '300px',
        maxWidth: '40%',
        height: '100%',
        overflowY: 'auto',
      }}
      aria-label="Reference panel"
    >
      <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <i className="bi bi-book mr-2" aria-hidden="true" />
          References
        </h6>
        <button
          className="btn btn-sm btn-link text-muted p-0"
          onClick={onToggle}
          aria-label="Close reference panel"
        >
          <i className="bi bi-x-lg" />
        </button>
      </div>

      <div className="p-3">
        <div className="text-center text-muted py-5">
          <i className="bi bi-journal-code" style={{ fontSize: '3rem' }} />
          <p className="mt-3">Reference panel coming soon!</p>
          <small>
            Future features:
            <ul className="list-unstyled mt-2">
              <li>• Documentation references</li>
              <li>• Code snippets</li>
              <li>• Data visualizations</li>
              <li>• Related resources</li>
            </ul>
          </small>
        </div>
      </div>
    </aside>
  );
};

ReferencePanel.propTypes = {
  isVisible: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ReferencePanel;
