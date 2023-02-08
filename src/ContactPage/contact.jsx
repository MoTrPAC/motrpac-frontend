import React from 'react';
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
          <h5 className="card-header">Accessing Data</h5>
          <div className="card-body">
            <p className="card-text">
              The first MoTrPAC public data release is now available. Please
              agree to the data use agreement and register for an account on the
              {' '}
              <a href="/data-access" className="inline-link">Data Access</a>
              {' '}
              page if you are interested in obtaining access to the data. For updates
              when subsequent publicly accessible data become available, please
              {' '}
              <ContactHelpdesk />
            </p>
          </div>
        </div>
        <div className="card mb-4 shadow-sm">
          <h5 className="card-header">Uploading Study Data</h5>
          <div className="card-body">
            <p className="card-text">
              If you are a member of one of the sites involved with MoTrPAC, please
              sign in using your login credentials via the &quot;Submitter
              Login&quot; link at the top and bottom right of this website. If
              you have issues logging in, please
              {' '}
              <ContactHelpdesk />
            </p>
          </div>
        </div>
        <div className="card mb-4 shadow-sm">
          <h5 className="card-header">Questions and Inquiries</h5>
          <div className="card-body">
            <p className="card-text">
              For general inquiries about the MoTrPAC Data Hub, please
              {' '}
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
