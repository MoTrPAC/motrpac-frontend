import React from 'react';
import { useAuth0 } from '../Auth/Auth';

/**
 * Renders the Contact Us page in both
 * unauthenticated and authenticated states.
 *
 * @returns {Object} JSX representation of the Contact Us page.
 */
function Contact() {
  // Custom Hook
  const { isAuthenticated } = useAuth0();

  return (
    <div className={`col-md-9 ${isAuthenticated ? 'ml-sm-auto' : ''} col-lg-10 px-4 contactPage`}>
      <div className={`${!isAuthenticated ? 'container' : ''}`}>
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>Contact Us</h3>
        </div>
        <div className="card-deck contact-content-container">
          <div className="card mb-4 shadow-sm">
            <h5 className="card-header">Accessing Data</h5>
            <div className="card-body">
              <p className="card-text">
                Data generated to date is not yet publicly accessible. For updates when publicly
                accessible data are available, please contact the MoTrPAC Bioinformatics Center at&nbsp;
                <a href="mailto:motrpac-data-requests@lists.stanford.edu" target="_new">motrpac-data-requests@lists.stanford.edu</a>
              </p>
            </div>
          </div>
          <div className="card mb-4 shadow-sm">
            <h5 className="card-header">Uploading Study Data</h5>
            <div className="card-body">
              <p className="card-text">
                If you are a member of one of the sites involved with MoTrPAC, please sign in using your
                login credentials via the &quot;Submitter Login&quot; link at the top and bottom right of this website. If you have issues
                logging in, please contact the MoTrPAC Bioinformatics Center helpdesk at&nbsp;
                <a href="mailto:motrpac-helpdesk@lists.stanford.edu" target="_new">motrpac-helpdesk@lists.stanford.edu</a>
              </p>
            </div>
          </div>
          <div className="card mb-4 shadow-sm">
            <h5 className="card-header">Questions and Inquiries</h5>
            <div className="card-body">
              <p className="card-text">
                For general inquiries about the MoTrPAC Data Hub, please contact the MoTrPAC Bioinformatics Center at&nbsp;
                <a href="mailto:motrpac-helpdesk@lists.stanford.edu" target="_new">motrpac-helpdesk@lists.stanford.edu</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
