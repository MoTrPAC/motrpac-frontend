import React from 'react';
import PropTypes from 'prop-types';
import IconLoading from '../assets/loading.svg';

/**
 * Renders the animated loading SVG icon
 * 
 * @param {Boolean} isFetching  Redux state for data fetching status.
 * 
 * @returns {Object} JSX representation of the animated loading UI.
 */
function AnimatedLoadingWidget({ isFetching }) {
  if (!isFetching) return null;

  return (
    <div className="col w-100 mt-5 pt-5 data-loading-indicator">
      <img src={IconLoading} className="loading-icon" alt="Loading..." />
    </div>
  );
}

AnimatedLoadingWidget.propTypes = {
  isFetching: PropTypes.bool.isRequired,
};

export default AnimatedLoadingWidget;
