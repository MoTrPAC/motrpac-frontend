import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import ContactForm from './contactForm';

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
  return (
    <div className="contactPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Contact Form - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Contact Us" />
      <div className="contact-content-container">
        <div className="contact-summary-container row mb-4">
          <div className="lead col-12">
            Please use the form below, or via{' '}
            <a href="mailto:motrpac-helpdesk@lists.stanford.edu">email</a>, to
            get in touch with the MoTrPAC Bioinformatics Center helpdesk for any
            questions and inquiries.
          </div>
        </div>
        <ContactForm />
        <div className="alert alert-secondary" role="alert">
          The MoTrPAC{' '}
          <Link to="/data-download">
            young adult rat endurance training study data
          </Link>{' '}
          is now available to the public. This is in addition to the{' '}
          <Link to="/data-access">
            limited young adult rat acute exercise study data
          </Link>{' '}
          made publicly available in the past. Please agree to the data usage
          terms and register for an account on the{' '}
          <Link to="/data-access">Data Access</Link> page if you are interested
          in obtaining access to the limited rat acute exercise data. To receive
          updates when subsequent publicly accessible data become available,
          please reach out to us using either one of the contact methods above.
        </div>
      </div>
    </div>
  );
}

export default Contact;
