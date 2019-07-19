import React from 'react';

/**
 * Renders the hover tooltip UI
 * 
 * @param {Object} props  Object argument with data
 * 
 * @returns {Object} JSX representation of the tooltip UI
 */
function ToolTip(props) {
  return (
    <div className="tooltip-on-top">
      {props.content}
      <i />
    </div>
  );
}

export default ToolTip;
