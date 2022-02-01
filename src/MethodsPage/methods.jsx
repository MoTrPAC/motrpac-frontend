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
        <div className="methods-intro-container">
          <p>
            The MoTrPAC study is divided into two main parts; human and animal
            (rats). Preclinical Animal Study Sites (PASSs) conduct the endurance
            exercise and training intervention in rats, and Human Clinical
            Exercise Sites conduct the human endurance and resistance training
            interventions. Multiple biospecimen samples are collected at
            different time points after acute and chronic exercise. Please see
            the Animal protocol below for details on the animal training
            intervention and sample collection. The biospecimen samples are
            distributed from a central biorepository to various Chemical
            Analysis Sites (CASs) for molecular ‘omics analysis. Specific
            methods for the different molecular assays are described in the
            Manual Of Procedures (MOPs). There is one for the genomic,
            transcriptomic and epigenomic data (GET), one for proteomics and one
            for metabolomics. In addition, the assay-specific quality control
            (QC) procedures are described in the QC Standard Operating
            Procedures (SOPs) documents.
          </p>
        </div>
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
