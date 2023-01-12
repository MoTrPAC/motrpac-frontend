import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders Bootstrap's spinner component
 *
 * @param {Boolean} isFetching  Redux state for data fetching status.
 *
 * @returns {Object} JSX representation of Bootstrap's spinner UI.
 */
function BootstrapSpinner({ isFetching }) {
  if (!isFetching) return null;

  return (
    <div className="d-flex justify-content-center">
      <div
        className="spinner-border spinner-border-lg text-primary"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

BootstrapSpinner.propTypes = {
  isFetching: PropTypes.bool.isRequired,
};

export default BootstrapSpinner;
