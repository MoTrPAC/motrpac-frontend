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
        <div className="align-items-center">
          <p>
            For any questions or suggestions, please contact us at&nbsp;
            <a href="mailto:motrpac-helpdesk@lists.stanford.edu">motrpac-helpdesk@lists.stanford.edu</a>
          </p>
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
