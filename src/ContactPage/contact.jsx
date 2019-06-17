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
                Data generated to date is not yet publicly accessible. For updates when publicly
                accessible data are available, please contact us at&nbsp;
                <a href="mailto:motrpac-data-requests@lists.stanford.edu" target="_new">motrpac-data-requests@lists.stanford.edu</a>
              </p>
            </div>
          </div>
          <div className="card mb-4 shadow-sm">
            <h5 className="card-header">Uploading Data From Study Sites</h5>
            <div className="card-body">
              <p className="card-text">
                If you are a member of one of the sites involved with MoTrPAC, please log in using
                your provided ID at the link on the bottom right of this website. If you have issues
                logging in, please contact the bioinformatic center helpdesk at&nbsp;
                <a href="mailto:motrpac-helpdesk@lists.stanford.edu" target="_new">motrpac-helpdesk@lists.stanford.edu</a>
              </p>
            </div>
          </div>
        </div>
        <div className="card-deck contact-content-container">
          <div className="card mb-4 shadow-sm">
            <h5 className="card-header">Questions and Inquiries</h5>
            <div className="card-body">
              <p className="card-text">
                For general inquiries about MoTrPAC Data Pub, please contact the bioinformatic center helpdesk at &nbsp;
                <a href="mailto:motrpac-helpdesk@lists.stanford.edu" target="_new">motrpac-helpdesk@lists.stanford.edu</a>
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
