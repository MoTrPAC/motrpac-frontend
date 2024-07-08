import React from 'react';
import PropTypes from 'prop-types';

import '@styles/loader.scss';

/**
 * Renders the animated loading SVG icon
 *
 * @param {Boolean} isFetching  Redux state for data fetching status.
 *
 * @returns {Object} JSX representation of the animated loading UI.
 */
function AnimatedLoadingIcon({ isFetching }) {
  if (!isFetching) return null;

  return (
    <div className="col w-100 mt-5 pt-5 text-center animated-loading-icon">
      <div className="lds-spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

AnimatedLoadingIcon.propTypes = {
  isFetching: PropTypes.bool.isRequired,
};

export default AnimatedLoadingIcon;
