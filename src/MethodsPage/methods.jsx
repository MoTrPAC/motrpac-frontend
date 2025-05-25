import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import StudyDocumentsTable from '../lib/studyDocumentsTable';
import HumanStudyDocumentsTable from '../lib/humanStudyDocumentsTable';
import ExternalLink from '../lib/ui/externalLink';

import '@styles/methods.scss';

/**
 * Renders the Methods page.
 *
 * @param {Object} profile    Redux state of authenticated user profile
 *
 * @returns {object} JSX representation of the Methods component
 */
export function Methods({ profile= {} }) {
  const userType = profile.user_metadata && profile.user_metadata.userType;

  const baseUrl = 'https://d1yw74buhe0ts0.cloudfront.net/docs';

  return (
    <div className="methodsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Methods - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Methods" />
      <div className="methods-content-container">
        <div className="methods-summary-container row mb-4">
          <div className="lead col-12">
            The MoTrPAC study is divided into two main parts; human and animal (rats).
            Preclinical Animal Study Sites (PASSs) conduct the endurance exercise and
            training intervention in rats, and Human Clinical Exercise Sites conduct
            the human endurance and resistance training interventions. Multiple
            biospecimen samples are collected at different time points after acute
            and chronic exercise. Please see the Animal protocol below for details
            on the animal training intervention and sample collection, and the Adult
            and Pediatric protocols for the human interventions and sample collection.
            The biospecimen samples are distributed from a central biorepository to
            various Chemical Analysis Sites (CASs) for molecular 'omics analysis.
            Specific methods for the different molecular assays and specific
            operational details are described in the Manual Of Procedures (MOPs).
            There is one for the genomic, transcriptomic and epigenomic data (GET),
            one for proteomics and one for metabolomics. In addition, the
            assay-specific quality control (QC) procedures are described in the QC
            Standard Operating Procedures (SOPs) documents.
          </div>
        </div>
        {userType && userType === 'internal' ? (
          <>
            <section className="study-docs-container">
              <StudyDocumentsTable currentView={userType} />
              <div className="pass-mop-link">
                <ExternalLink
                  to="https://www.motrpac.org/secure/documents/dspList.cfm?documentFolderCurrent=BEC8E9C5-C740-4D8F-91F2-5977E98CF6A0"
                  label="Manuals of Procedures for Preclinical Animal Study Sites"
                />
                <span className="login-required-note ml-1">(login required)</span>
              </div>
            </section>
            <section className="study-docs-container pt-4">
              <HumanStudyDocumentsTable />
            </section>
          </>
        ) : (
          <>
            <section className="study-docs-container">
              <StudyDocumentsTable currentView={userType} />
            </section>
            <section className="study-docs-container pt-4">
              <HumanStudyDocumentsTable />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

Methods.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
};

const mapStateToProps = (state) => ({
  profile: state.auth.profile,
});

export default connect(mapStateToProps)(Methods);
