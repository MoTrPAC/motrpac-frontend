import React from 'react';
import PropTypes from 'prop-types';

const tableSortLabels = {
  default: 'Default',
  ascending: 'Tissue name ascending',
  descending: 'Tissue name descending',
};

/**
 * Renders dropdown menu controls for sort release sample count metrics
 *
 * @param {String} sort           Redux state of table sort
 * @param {Function} toggleSort   Redux action to change sort state
 *
 * @returns {object} JSX representation of the dropdown menu controls
 */
function TableControls({ sort, toggleSort }) {
  return (
    <div className="controlPanelContainer mb-3 mx-3">
      <div className="controlPanel">
        <div className="controlRow d-flex align-items-center">
          <div className="controlLabel">Sort:</div>
          <div className="dropdown">
            <button
              className="btn btn-sm btn-primary dropdown-toggle"
              type="button"
              id="tableSortMenu"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {tableSortLabels[sort]}
            </button>
            <div className="dropdown-menu" aria-labelledby="tableSortMenu">
              <button
                className="dropdown-item"
                type="button"
                onClick={toggleSort.bind(this, 'default')}
              >
                Default
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={toggleSort.bind(this, 'ascending')}
              >
                Tissue name ascending
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={toggleSort.bind(this, 'descending')}
              >
                Tissue name descending
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

TableControls.propTypes = {
  sort: PropTypes.string,
  toggleSort: PropTypes.func.isRequired,
};

TableControls.defaultProps = {
  sort: 'default',
};

export default TableControls;
