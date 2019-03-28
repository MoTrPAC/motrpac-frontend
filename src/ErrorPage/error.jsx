import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

/**
 * Renders the Error page.
 *
 * @returns {Object} JSX representation of the Error page.
 */
export function ErrorPage({ isAuthenticated, profile }) {
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;

  if (isAuthenticated && hasAccess) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="col-md-9 col-lg-10 px-4 errorPage">
      <div className="container">
        <div className="page-title pt-5 pb-3">
          <h3>Authorized MoTrPAC Consortia Members Only</h3>
        </div>
        <div className="contact-content-container">
          <p className="alert alert-warning">
            At this time, access to the MoTrPAC Data Hub data resources is limited
            to Consortia members only. Please contact the MoTrPAC Helpdesk at&nbsp;
            <a href="mailto:motrpac-helpdesk@lists.stanford.edu" target="_new">motrpac-helpdesk@lists.stanford.edu</a>
            &nbsp;and request access to the portal.
          </p>
        </div>
      </div>
    </div>
  );
}

ErrorPage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
};

ErrorPage.defaultProps = {
  profile: {},
  isAuthenticated: false,
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ErrorPage);

