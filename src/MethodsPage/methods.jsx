import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthContentContainer from '../lib/ui/authContentContainer';
import StudyDocumentsTable from '../lib/studyDocumentsTable';
import ExternalLink from '../lib/ui/externalLink';

/**
 * Renders the Methods page.
 *
 * @param {Object} profile    Redux state of authenticated user profile
 * @param {Boolean} expanded  Redux state of collapsed/expanded sidebar
 *
 * @returns {object} JSX representation of the Methods component
 */
export function Methods({ profile, expanded }) {
  const userType = profile.user_metadata && profile.user_metadata.userType;

  return (
    <AuthContentContainer classes="methodsPage" expanded={expanded}>
      <div className="d-flex align-items-center pt-3 pb-2 mb-3 border-bottom page-header">
        <div className="page-title">
          <h3>Methods</h3>
        </div>
      </div>
      <div className="methods-content-container mt-4">
        {userType === 'internal' && (
          <section className="study-docs-container row">
            <div className="col-xl-8">
              <StudyDocumentsTable currentView={userType} />
            </div>
            <div className="pass-mop-link col-xl-4">
              <ExternalLink
                to="https://www.motrpac.org/secure/documents/dspList.cfm?documentFolderCurrent=BEC8E9C5-C740-4D8F-91F2-5977E98CF6A0"
                label="Manuals of Procedures for Preclinical Animal Study Sites"
              />
              <span className="login-required-note ml-1">(login required)</span>
            </div>
          </section>
        )}
        {userType === 'external' && (
          <section className="study-docs-container row">
            <StudyDocumentsTable currentView={userType} />
          </section>
        )}
      </div>
    </AuthContentContainer>
  );
}

Methods.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  expanded: PropTypes.bool,
};

Methods.defaultProps = {
  profile: {},
  expanded: false,
};

const mapStateToProps = (state) => ({
  profile: state.auth.profile,
  expanded: state.sidebar.expanded,
});

export default connect(mapStateToProps)(Methods);
