import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Renders the Contact Us page in both
 * unauthenticated and authenticated states.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 *
 * @returns {Object} JSX representation of the Contact Us page.
 */
export function Contact({ isAuthenticated }) {
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
                The first MoTrPAC public data release is now available. Please consent to
                the embargo agreement and register for an account on the&nbsp;
                <a href="/data-access" className="inline-link">Data Access</a>
                &nbsp;page if you are interested in obtaining access to the data. For updates when
                subsequent publicly accessible data become available, please contact
                the MoTrPAC Bioinformatics Center at&nbsp;
                <a href="mailto:motrpac-helpdesk@lists.stanford.edu" target="_new">
                  motrpac-helpdesk@lists.stanford.edu
                </a>
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
                For general inquiries about the MoTrPAC Data Hub, please contact
                the MoTrPAC Bioinformatics Center at&nbsp;
                <a href="mailto:motrpac-helpdesk@lists.stanford.edu" target="_new">
                  motrpac-helpdesk@lists.stanford.edu
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Contact.propTypes = {
  isAuthenticated: PropTypes.bool,
};

Contact.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Contact);
