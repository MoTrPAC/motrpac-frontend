import React from 'react';
import PropTypes from 'prop-types';

const tableSortLabels = {
  default: 'Tissue code',
  ascending: 'Tissue name ascending',
  descending: 'Tissue name descending',
};

/**
 * Renders dropdown menu controls for sort release sample count metrics
 *
 * @param {String} sort           Redux state of table sort
 * @param {Function} toggleSort   Redux action to change sort state
 * @param {Boolean} showQC        Redux state of QC sample visibility
 * @param {Function} toggleQC     Redux action to change visibility state
 *
 * @returns {object} JSX representation of the dropdown menu controls
 */
function TableControls({ sort, toggleSort, showQC, toggleQC }) {
  return (
    <div className="controlPanelContainer mb-3 mx-3">
      <div className="controlPanel d-flex align-items-center">
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
            <div
              className="dropdown-menu animate slideIn"
              aria-labelledby="tableSortMenu"
            >
              <button
                className="dropdown-item"
                type="button"
                onClick={toggleSort.bind(this, 'default')}
              >
                Tissue code
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
        <div className="controlRow show-qc-sample-table ml-3">
          <button
            className="btn btn-sm shadow-none"
            type="button"
            onClick={toggleQC.bind(this, !showQC)}
          >
            <span className="d-flex align-items-center justify-content-start">
              <i className="material-icons show-qc-icon mr-1">
                {showQC ? 'check_box' : 'check_box_outline_blank'}
              </i>
              QC-Reference
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

TableControls.propTypes = {
  sort: PropTypes.string,
  toggleSort: PropTypes.func.isRequired,
  showQC: PropTypes.bool,
  toggleQC: PropTypes.func.isRequired,
};

TableControls.defaultProps = {
  sort: 'default',
  showQC: false,
};

export default TableControls;
