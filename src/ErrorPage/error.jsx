import React from 'react';

/**
 * Renders the Error page.
 *
 * @returns {Object} JSX representation of the Error page.
 */
function ErrorPage() {
  return (
    <div className="col-md-9 col-lg-10 px-4 errorPage">
      <div className="container">
        <div className="page-title pt-3 pb-2">
          <h3>Access denied</h3>
        </div>
        <div className="contact-content-container">
          <p className="alert alert-warning">
            You have not been authorized to access the MoTrPAC Data Hub
            portal. Please contact the MoTrPAC Helpdesk at&nbsp;
            <a href="mailto:motrpac-helpdesk@lists.stanford.edu" target="_new">motrpac-helpdesk@lists.stanford.edu</a>
            &nbsp;and request access to the portal.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
