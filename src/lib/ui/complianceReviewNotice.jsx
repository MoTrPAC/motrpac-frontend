import React from 'react';

function ComplianceReviewNotice() {
  return (
    <div className="position-fixed bottom-0 right-0 p-3 compliance-review-notice">
      <div id="compliance-review-notice-toast" className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-body">
          <div className="mb-2">
            This repository is under review for potential modification in compliance
            with Administration directives.
          </div>
          <div>
            This site is managed by Stanford University to host and share resources
            related to the Molecular Transducers of Physical Activity Consortium and
            remains fully operational throughout this review process.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplianceReviewNotice;
