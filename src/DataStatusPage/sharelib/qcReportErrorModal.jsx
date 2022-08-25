import React from 'react';
import EmailLink from '../../lib/ui/emailLink';

// Render modal for error encountered in viewing QC report
function QcReportErrorModal() {
  return (
    <div
      className="modal fade qc-report-error-modal"
      id="qcReportErrorModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="qcReportErrorModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Error</h5>
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
            An error has occurred in retrieving the requested QC report. Please
            try again later, or contact the{' '}
            <EmailLink
              mailto="motrpac-helpdesks@lists.stanford.edu"
              label="MoTrPAC Helpdesk"
            />{' '}
            to report this problem.
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QcReportErrorModal;
