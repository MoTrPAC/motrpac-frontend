import React from 'react';
import PropTypes from 'prop-types';

// Function to toggle show/hide sectional content
function ToggleShowHide({ icon, toggleState, toggleTarget }) {
  return (
    <div>
      <button
        className="btn btn-link show-collapse-button d-flex align-items-center"
        type="button"
        data-toggle="collapse"
        data-target={`#${toggleTarget}`}
        aria-expanded="true"
        aria-controls={toggleTarget}
        onClick={toggleState}
      >
        <span className="material-icons">{icon}</span>
      </button>
    </div>
  );
}

ToggleShowHide.propTypes = {
  icon: PropTypes.string.isRequired,
  toggleState: PropTypes.func.isRequired,
  toggleTarget: PropTypes.string.isRequired,
};

export default ToggleShowHide;
