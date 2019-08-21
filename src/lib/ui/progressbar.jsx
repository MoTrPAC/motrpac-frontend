import React from 'react';
import PropTypes from 'prop-types';
import ToolTip from './tooltip';

/**
 * Renders the progress bar UI
 * 
 * @param {Number} currentValue   Value of current progress
 * @param {Number} expectedValue  Value of expected total
 * 
 * @returns {Object} JSX representation of the progress bar
 */
function ProgressBar({
  currentValue,
  expectedValue,
}) {
  const valueNow = parseFloat(currentValue / expectedValue) * 100;
  const widthStyle = { width: `${Math.round(valueNow)}%` };

  return (
    <div className="progress-bar-wrapper">
      <div className="progress">
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={widthStyle}
          aria-valuenow={Math.round(valueNow)}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
      <ToolTip
        content={`${Math.round(valueNow)}%: ${expectedValue} expected; ${currentValue} received`}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  currentValue: PropTypes.number.isRequired,
  expectedValue: PropTypes.number.isRequired,
};

export default ProgressBar;
