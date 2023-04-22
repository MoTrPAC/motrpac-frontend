import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';
import ContactHelpdesk from '../lib/ui/contactHelpdesk';

/**
 * Renders the Contact Us page in both
 * unauthenticated and authenticated states.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Boolean} expanded        Redux state for sidebar
 *
 * @returns {Object} JSX representation of the Contact Us page.
 */
function Contact() {
  const pageContent = (
    <>
      <PageTitle title="Contact Us" />
      <div className="card-deck contact-content-container">
        <div className="card mb-4 shadow-sm">
          <h5 className="card-header">Data Access</h5>
          <div className="card-body">
            <p className="card-text">
              The MoTrPAC{' '}
              <Link to="/data-download">
                Endurance Exercise Training Animal Study data
              </Link>{' '}
              is now available to the public. This is in addition to the Limited
              Acute Exercise data made available to the public in a prior
              release. Please agree to the data use agreement and register for
              an account on the <Link to="/data-access">Data Access</Link> page
              if you are interested in obtaining access to the Limited Acute
              Exercise data. For updates when subsequent publicly accessible
              data become available, please <ContactHelpdesk />
            </p>
          </div>
        </div>
        <div className="card mb-4 shadow-sm">
          <h5 className="card-header">Study Data Submission</h5>
          <div className="card-body">
            <p className="card-text">
              If you are a member of one of the sites involved with MoTrPAC,
              please <ContactHelpdesk /> about obtaining access to our cloud
              storage and data submission guidelines.
            </p>
          </div>
        </div>
        <div className="card mb-4 shadow-sm">
          <h5 className="card-header">Questions and Inquiries</h5>
          <div className="card-body">
            <p className="card-text">
              For general inquiries about the MoTrPAC Data Hub, please{' '}
              <ContactHelpdesk />
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="contactPage px-3 px-md-4 mb-3 container">
      <div>{pageContent}</div>
    </div>
  );
}

export default Contact;
