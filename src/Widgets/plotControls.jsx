import React from 'react';
import PropTypes from 'prop-types';

const plotViewLabels = {
  tissue_name: 'Tissue by name',
  tissue_count: 'Tissue by count',
  assay_name: 'Assay by name',
  assay_count: 'Assay by count',
};

/**
 * Renders dropdown menu controls for plotting release sample metrics
 *
 * @param {String} plot           Redux state of plot view
 * @param {Function} togglePlot   Redux action to change plot state
 *
 * @returns {object} JSX representation of the dropdown menu controls
 */
function PlotControls({ plot, togglePlot }) {
  return (
    <div className="controlPanelContainer mb-3 mx-3">
      <div className="controlPanel">
        <div className="controlRow d-flex align-items-center">
          <div className="controlLabel">Samples:</div>
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
            <div className="dropdown-menu" aria-labelledby="plotViewMenu">
              <button
                className="dropdown-item"
                type="button"
                onClick={togglePlot.bind(this, 'tissue_name')}
              >
                Tissue by name
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={togglePlot.bind(this, 'tissue_count')}
              >
                Tissue by count
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={togglePlot.bind(this, 'assay_name')}
              >
                Assay by name
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={togglePlot.bind(this, 'assay_count')}
              >
                Assay by count
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PlotControls.propTypes = {
  plot: PropTypes.string,
  togglePlot: PropTypes.func.isRequired,
};

PlotControls.defaultProps = {
  plot: 'tissue_name',
};

export default PlotControls;
