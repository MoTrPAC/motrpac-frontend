import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

function HtmlReportModal({ selectedReport, selectedReportLabel, profile }) {
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
            <div className="d-flex align-items-center">
              <h5 className="modal-title" id="html-report-modal-label">
                {selectedReportLabel}
              </h5>
              <a
                role="button"
                className="btn btn-primary btn-report-download ml-3"
                href={`/static-assets/dawg-pac/${selectedReport}`}
                download
                onClick={(e) => {
                  // track event in Google Analytics 4
                  trackEvent(
                    'Multi-omics Working Groups',
                    'html_report_download',
                    profile && profile.userid
                      ? profile.userid.substring(
                          profile.userid.indexOf('|') + 1,
                        )
                      : 'anonymous',
                    selectedReport,
                  );
                }}
              >
                <span>Download Report</span>
              </a>
            </div>
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
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
};

HtmlReportModal.defaultProps = {
  selectedReport: null,
  selectedReportLabel: null,
  profile: {},
};

export default HtmlReportModal;
