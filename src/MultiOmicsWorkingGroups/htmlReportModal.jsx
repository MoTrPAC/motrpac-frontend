import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

function HtmlReportModal({ selectedReport, selectedReportLabel }) {
  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  return (
    <div
      className="modal fade"
      id="html-report-modal"
      tabIndex="-1"
      aria-labelledby="html-report-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content" style={{ height: '90vh' }}>
          <div className="modal-header">
            <h5 className="modal-title" id="html-report-modal-label">
              {selectedReportLabel}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="embed-responsive embed-responsive-1by1">
              {!iframeLoaded && (
                <div className="bootstrap-spinner d-flex justify-content-center py-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                title="HTML Report"
                src={`/static-assets/dawg-pac/${selectedReport}`}
                className="embed-responsive-item"
                allowFullScreen
                onLoad={handleIframeLoad}
                style={{ height: '77vh' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

HtmlReportModal.propTypes = {
  selectedReport: PropTypes.string,
  selectedReportLabel: PropTypes.string,
};

HtmlReportModal.defaultProps = {
  selectedReport: null,
  selectedReportLabel: null,
};

export default HtmlReportModal;
