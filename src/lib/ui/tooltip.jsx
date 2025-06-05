import React from 'react';

import '@styles/tooltip.scss';

/**
 * Renders the hover tooltip UI
 *
 * @param {Object} props  Object argument with data
 *
 * @returns {Object} JSX representation of the tooltip UI
 */
function ToolTip(props) {
  const { content } = props;
  return (
    <div className="tooltip-on-top">
      {content}
      <i />
    </div>
  );
}

export default ToolTip;
