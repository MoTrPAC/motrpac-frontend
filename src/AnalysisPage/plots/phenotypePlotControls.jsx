import React from 'react';
import PropTypes from 'prop-types';

const plotViewLabels = {
  one_week_program: 'One-Week Program',
  two_week_program: 'Two-Week Program',
  four_week_program: 'Four-Week Program',
  eight_week_program: 'Eight-Week Program',
};

/**
 * Renders dropdown menu controls for plotting release sample metrics
 *
 * @param {String} plot           Redux state of plot view
 * @param {Function} togglePlot   Redux action to change plot state
 *
 * @returns {object} JSX representation of the dropdown menu controls
 */
function PhenotypePlotControls({ plot, togglePlot }) {
  return (
    <div className="controlPanelContainer">
      <div className="controlPanel">
        <div className="controlRow">
          <div className="dropdown">
            <button
              className="btn btn-sm btn-primary dropdown-toggle"
              type="button"
              id="plotViewMenu"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {plotViewLabels[plot]}
            </button>
            <div
              className="dropdown-menu animate slideIn"
              aria-labelledby="plotViewMenu"
            >
              <button
                className="dropdown-item"
                type="button"
                onClick={togglePlot.bind(this, 'one_week_program')}
              >
                One-Week Program
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={togglePlot.bind(this, 'two_week_program')}
              >
                Two-Week Program
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={togglePlot.bind(this, 'four_week_program')}
              >
                Four-Week Program
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={togglePlot.bind(this, 'eight_week_program')}
              >
                Eight-Week Program
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PhenotypePlotControls.propTypes = {
  plot: PropTypes.string,
  togglePlot: PropTypes.func.isRequired,
};

PhenotypePlotControls.defaultProps = {
  plot: 'one_week_program',
};

export default PhenotypePlotControls;
