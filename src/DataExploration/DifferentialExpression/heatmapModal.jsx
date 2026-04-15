import React from 'react';
import PropTypes from 'prop-types';
import Heatmap from './heatmap';

import figureTissueProps from './figureTissueProps';
import figureAssayProps from './figureAssayProps';

/**
 * Renders bootstrap modal containing heatmap of top 50 DE genes
 * in pass1b-06 rat training data
 *
 * @param {String} tissue         Tissue abbreviation
 * @param {String} assay          Assay
 * @param {Function} dismissModal Handler to close modal
 *
 * @returns {Object} JSX representation of the heatmap modal
 */
function HeatmapModal({ tissue = '', assay = '', dismissModal = null }) {
  // Transform tissue abbreviation to full name
  function renderTissueName() {
    let tissueName = '';
    if (tissue && tissue.length && tissue in figureTissueProps) {
      tissueName = figureTissueProps[tissue].label;
    }
    return tissueName;
  }

  // Transform assay type to descriptive label
  function renderAssayLabel() {
    let assayLabel = '';
    if (assay && assay.length && assay in figureAssayProps) {
      assayLabel = figureAssayProps[assay].label;
    }
    return assayLabel;
  }

  return (
    <>
      <div
        className="modal fade show"
        id="heatmapModal"
        tabIndex="-1"
        aria-labelledby="heatmapModalTitle"
        aria-hidden="false"
        aria-modal="true"
        role="dialog"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="heatmapModalTitle">
                Top 50 differentially expressed genes in{' '}
                {`${renderTissueName()} - ${renderAssayLabel()}`}
              </h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={dismissModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Heatmap tissue={tissue} assay={assay} />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

HeatmapModal.propTypes = {
  tissue: PropTypes.string,
  assay: PropTypes.string,
  dismissModal: PropTypes.func,
};

export default HeatmapModal;
