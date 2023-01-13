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
    <div className="bootstrap-spinner d-flex justify-content-center py-5">
      <div className="spinner-border text-secondary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

BootstrapSpinner.propTypes = {
  isFetching: PropTypes.bool.isRequired,
};

export default BootstrapSpinner;
