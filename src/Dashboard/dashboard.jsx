import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import 'bootstrap';
import $ from 'jquery';
import FeatureLinks from '../Search/featureLinks';
import DataStatusActions from '../DataStatusPage/dataStatusActions';
import ExternalLink from '@/lib/ui/externalLink';
import ReviewerDownloadButton from './reviewerDownloadButton';
import { reviewerAgreementAccepted, setReviewerAgreement } from '../lib/userAccess';

import '@styles/dashboard.scss';

const PACK_ANALYSIS = 'bundles/motrpac_human-precovid-sed-adu_analysis.zip';
const PACK_DATA = 'bundles/motrpac_human-precovid-sed-adu_data.zip';
const PACK_CLINICAL_ANALYSIS = 'bundles/motrpac_human-precovid-sed-adu_clinic-analysis.zip';
const PACK_ACUTE = 'bundles/motrpac_human-precovid-sed-adu_acute.zip';
const PACK_REPRO = 'bundles/motrpac_human-precovid-sed-adu_repro.zip';

/** One box in the reviewer package flow: what it is, and how to get it. */
function ReviewerPackage({ title, description, filename, profile, disabled }) {
  return (
    <div className="package-flow-node">
      <div className="feature-highlight-content">
        <h3>{title}</h3>
        <div className="data-release-text mb-3">{description}</div>
        <ReviewerDownloadButton
          filename={filename}
          label="Download"
          icon="bi-file-zip-fill"
          profile={profile}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

ReviewerPackage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  profile: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool.isRequired,
};

/**
 * Renders the Dashboard page
 *
 * @param {Object} profile  Redux state of authenticated user profile
 *
 * @returns {object} JSX representation of the Dashboard
 */
export function Dashboard({ 
  profile = {}, 
  isAuthenticated = false,
  handleQCDataFetch, 
  lastModified = '',
}) {
  // Initialize agreement state from sessionStorage to persist across page navigations.
  // Read through `userAccess`, which is also what decides whether this reviewer
  // may reach the collections themselves -- the button state and the data
  // access have to come from the same answer.
  const [agreement, setAgreement] = useState(reviewerAgreementAccepted);

  const userType = profile.user_metadata && profile.user_metadata.userType;
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  const userRole = profile.app_metadata && profile.app_metadata.role;
  const isReviewer = userType === 'external' && userRole === 'reviewer';

  // Show modal for reviewers who haven't agreed yet.
  //
  // Above the sign-in guard, not below it: hooks have to run on every render,
  // and a signed-out render that reaches an early return first has called one
  // hook where the previous render called two. React throws "Rendered fewer
  // hooks than expected" rather than redirecting -- which is what a session
  // expiring on this page did.
  useEffect(() => {
    if (isAuthenticated && hasAccess && isReviewer && !agreement) {
      $('#reviewerAgreementModal').modal('show');

      return () => {
        $('#reviewerAgreementModal').modal('hide');
      };
    }
    return undefined;
  }, [isAuthenticated, hasAccess, isReviewer, agreement]);

  if (!isAuthenticated || !hasAccess) {
    return <Navigate to="/" />;
  }

  // Handler to save agreement to sessionStorage
  const handleAgree = () => {
    setAgreement(true);
    setReviewerAgreement(true);
  };

  // Handler to dismiss modal without agreeing - keeps buttons disabled
  const handleCancel = () => {
    setAgreement(false);
    setReviewerAgreement(false);
  };

  return (
    <div className="dashboardPage px-3 px-md-4 mb-3">
      <Helmet>
        <html lang="en" />
        <title>Dashboard - MoTrPAC Data Hub</title>
      </Helmet>

      {userType && userType === 'internal' && (
        <div className="jumbotron jumbotron-fluid alert-data-release">
          <div className="w-100 mx-auto px-5">
            <h1 className="highlight-title display-3 text-center mb-5">
              <i className="bi bi-fire mr-3" aria-hidden="true" />
              <span>What's New</span>
            </h1>
            <div className="row">
              <div className="col-md-3 lead d-flex align-items-start">
                <div className="feature-highlight-icon mr-3">
                  <span className="material-icons" aria-hidden="true">
                    cloud_download
                  </span>
                </div>
                <div className="feature-highlight-content mr-1">
                  <h3>Human Clinical Data</h3>
                  <div className="data-release-text mb-3">
                    <span className="mr-2">Sedentary adults (post-suspension) and low and highly active pediatrics clinical data collections now available for download in bundled datasets</span>
                    <span className="badge badge-pill badge-danger">Consortium Release</span>
                  </div>
                  <Link to="/data-download" className="btn btn-primary">Download Datasets</Link>
                </div>
              </div>
              <div className="col-md-3 lead d-flex align-items-start">
                <div className="feature-highlight-icon mr-3">
                  <span className="material-icons" aria-hidden="true">
                    auto_awesome
                  </span>
                </div>
                <div className="feature-highlight-content mr-1">
                  <h3><i>ExerWise</i> AI Assistant</h3>
                  <div className="data-release-text mb-3">
                    Find answers quickly from <i>ExerWise</i>, an AI-powered assistant on topics ranging from data and study designs to processing pipelines and analysis results
                  </div>
                  <Link to="/exerwise" className="btn btn-primary">Learn More</Link>
                </div>
              </div>
              <div className="col-md-3 lead d-flex align-items-start">
                <div className="feature-highlight-icon mr-3">
                  <span className="material-icons" aria-hidden="true">
                    auto_stories
                  </span>
                </div>
                <div className="feature-highlight-content mr-1">
                  <h3>Knowledge Center</h3>
                  <div className="data-release-text mb-3">
                    Dive into the comprehensive documentation on the end-to-end lifecycle of MoTrPAC data from submission and processing to analysis and public release
                  </div>
                  <Link to="/knowledge-center" className="btn btn-primary">Learn More</Link>
                </div>
              </div>
              <div className="col-md-3 lead d-flex align-items-start">
                <div className="feature-highlight-icon mr-3">
                  <span className="material-icons" aria-hidden="true">
                    insights
                  </span>
                </div>
                <div className="feature-highlight-content mr-1">
                  <h3>Sample Data Tracker</h3>
                  <div className="data-release-text mb-3">
                    Stay informed on the latest data availability of human and rat omic sample data across assays and tissue types through their lifecycle
                  </div>
                  <Link to="/sample-data-tracker" className="btn btn-primary">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {userType && userType === 'external' && !userRole && (
        <>
          <div className="jumbotron jumbotron-fluid alert-data-release external-user">
            <div className="w-75 mx-auto">
              <h1 className="highlight-title display-4 mb-4 text-center">
                <i className="bi bi-rocket-takeoff mr-3" aria-hidden="true" />
                <span>New human data collection now available!</span>
              </h1>
              <div className="row mb-5">
                <div className="col-md-12 lead d-flex align-items-start">
                  <span className="data-release-text">
                    <ExternalLink
                      to="https://motrpac.org"
                      label="MoTrPAC"
                    />
                    {' '}has publicly released new{' '}
                    <Link to="/data-download">data collections</Link>
                    . The Pre-Suspension Acute Exercise Study contains data from
                    sedentary adults undergoing acute resistance or endurance exercise
                    bouts. Visit the{' '}
                    <Link to="/search">Browse Results</Link>
                    {' '}page for summary-level results and the{' '}
                    <ExternalLink
                      to="https://data-viz.motrpac-data.org/precawg"
                      label="Data Visualization"
                    />
                    {' '}for interactive analysis. Please refer to the{' '}
                    <Link to="/citation">Citation</Link>
                    {' '}page for information on acknowledging MoTrPAC
                    when using this dataset in your work.
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 lead d-flex align-items-start">
                  <div className="feature-highlight-icon mr-3">
                    <span className="material-icons" aria-hidden="true">
                      auto_awesome
                    </span>
                  </div>
                  <div className="feature-highlight-content mr-1">
                    <h3>MCP Server</h3>
                    <div className="data-release-text mb-3">
                      Query and explore publicly released MoTrPAC datasets directly from LLM-powered clients including Claude Desktop and other supported clients
                    </div>
                    <Link to="/mcp-server" className="btn btn-primary">Learn More</Link>
                  </div>
                </div>
                <div className="col-md-4 lead d-flex align-items-start">
                  <div className="feature-highlight-icon mr-3">
                    <span className="material-icons" aria-hidden="true">
                      auto_stories
                    </span>
                  </div>
                  <div className="feature-highlight-content mr-1">
                    <h3>Knowledge Center</h3>
                    <div className="data-release-text mb-3">
                      Dive into the comprehensive documentation on the end-to-end lifecycle of MoTrPAC data from submission and processing to analysis and public release
                    </div>
                    <Link to="/knowledge-center" className="btn btn-primary">Learn More</Link>
                  </div>
                </div>
                <div className="col-md-4 lead d-flex align-items-start">
                  <div className="feature-highlight-icon mr-3">
                    <span className="material-icons" aria-hidden="true">
                      pest_control_rodent
                    </span>
                  </div>
                  <div className="feature-highlight-content mr-1">
                    <h3>Rats Training Data 2.0</h3>
                    <div className="data-release-text mb-3">
                      Endurance training in young adult rats study data using Rat Reference Genome 7 now available for download
                    </div>
                    <Link to="/data-download" className="btn btn-primary">Download Datasets</Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className="greeting-message">
            <h2 className="dashboard-title mb-3">
              <span>
                Welcome,
                {' '}
                {profile.user_metadata?.givenName || 'User'}
              </span>
            </h2>
          </div>
        </>
      )}
      {/* Welcome message for external users with reviewer role */}
      {isReviewer && (
        <>
          <div className="jumbotron jumbotron-fluid alert-data-release external-user">
            <div className="w-75 mx-auto">
              <h1 className="highlight-title display-4 mb-4 text-center">
                <i className="bi bi-person-circle mr-3" aria-hidden="true" />
                <span>Hello, Reviewer!</span>
              </h1>
              <div className="row mb-4">
                <div className="col-md-12 lead d-flex align-items-start">
                  <span className="data-release-text">
                    As a reviewer, you have been granted access to the pre-publication
                    acute exercise in human sedentary adults data and the visualization
                    tool. If you have any questions, please contact the journal editor directly.
                  </span>
                </div>
                <div className="col-md-12 lead d-flex align-items-start mt-2">
                  <span className="data-release-text">
                    Please note, the MotrpacHumanPreSuspensionAnalysis package and
                    motrpac-precovid-adult-sed-clinic-internal project depend on the
                    MotrpacHumanPreSuspensionData package. It is recommended to download
                    and install all of them. See the README document in each of the
                    packages and projects for more details.
                  </span>
                </div>
              </div>
              {/*
                The packages as a dependency flow rather than a grid of equals:
                Reproduction builds the objects both R packages carry, and the
                Manuscript and Clinical Analysis pipelines consume those. Read
                top to bottom, that is also the install order.

                Drawn in CSS -- see `.reviewer-package-flow` in dashboard.scss.
                A diagramming library would be several hundred KB for five boxes
                and four lines, and would not render the download buttons that
                are the point of the page.
              */}
              <ol className="reviewer-package-flow list-unstyled mb-0">
                <li className="package-flow-tier package-flow-tier-single">
                  <ReviewerPackage
                    title="motrpac-human-presuspension-repro"
                    description="Repository that normalizes omics data, applies statistical models, builds every data object, versions it, uploads it, and carries it into both packages."
                    filename={PACK_REPRO}
                    profile={profile}
                    disabled={!agreement}
                  />
                </li>

                <li className="package-flow-link package-flow-link-fan" aria-hidden="true">
                  <span className="flow-stem" />
                  <span className="flow-bar" />
                  <span className="flow-leg flow-leg-left" />
                  <span className="flow-leg flow-leg-right" />
                </li>

                <li className="package-flow-tier package-flow-tier-pair">
                  <ReviewerPackage
                    title="MotrpacHumanPreSuspensionData"
                    description="Package of individual level data, including phenotype/clinical, and qc-normalized multi-omic data. Installation required."
                    filename={PACK_DATA}
                    profile={profile}
                    disabled={!agreement}
                  />
                  <ReviewerPackage
                    title="MotrpacHumanPreSuspensionAnalysis"
                    description="Package of aggregate results (i.e., differential abundance), and functions for integrated analysis. Installation required."
                    filename={PACK_ANALYSIS}
                    profile={profile}
                    disabled={!agreement}
                  />
                </li>

                <li className="package-flow-link package-flow-link-merge" aria-hidden="true">
                  <span className="flow-riser flow-riser-left" />
                  <span className="flow-riser flow-riser-right" />
                  <span className="flow-bar" />
                  <span className="flow-leg flow-leg-left" />
                  <span className="flow-leg flow-leg-right" />
                </li>

                <li className="package-flow-tier package-flow-tier-pair">
                  <ReviewerPackage
                    title="motrpac-human-presuspension-acute"
                    description={<span>Repository containing code for reproducing the multi-omic landscape paper entitled <span className="font-weight-bold">Multi-Omic, Multi-Tissue Responses to Acute Exercise in Sedentary Adults: Findings from the Molecular Transducers of Physical Activity Consortium</span>, as well as tissue specific companions.</span>}
                    filename={PACK_ACUTE}
                    profile={profile}
                    disabled={!agreement}
                  />
                  <ReviewerPackage
                    title="motrpac-precovid-adult-sed-clinic-internal"
                    description={<span>Repository containing code for reproducing the clinical landscape paper entitled <span className="font-weight-bold">Molecular Transducers of Physical Activity Consortium (MoTrPAC): Initial Insights into the Dynamic Human Responses to Exercise</span></span>}
                    filename={PACK_CLINICAL_ANALYSIS}
                    profile={profile}
                    disabled={!agreement}
                  />
                </li>
              </ol>
            </div>
          </div>
          <div id="reviewerAgreementModal" className="modal fade" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">Data Use Agreement</h5>
                </div>
                <div className="modal-body">
                  <h5 className="font-weight-bold">PLEASE READ BEFORE DOWNLOADING DATA</h5>
                  <p>By clicking &quot;I agree&quot; and downloading data from this portal, you agree to:</p>
                  <div className="my-3">
                    <span className="font-weight-bold">Review Use Only</span>
                    <ul>
                      <li>Use this data solely for your assigned review purposes.</li>
                      <li>Not use the data for your own research or publications.</li>
                    </ul>
                  </div>
                  <div className="my-3">
                    <span className="font-weight-bold">Confidentiality</span>
                    <ul>
                      <li>Keep all data confidential.</li>
                      <li>Not share or distribute data to others.</li>
                      <li>Not attempt to identify individual subjects.</li>
                    </ul>
                  </div>
                  <div className="my-3">
                    <span className="font-weight-bold">Data Handling</span>
                    <ul>
                      <li>Store data securely while reviewing.</li>
                      <li>Delete data when your review is complete.</li>
                    </ul>
                  </div>
                  <div className="my-3">
                    <span className="font-weight-bold">Research Integrity</span>
                    <ul>
                      <li>These terms are based on research integrity principles and professional responsibility.</li>
                    </ul>
                  </div>
                  <p>Any questions throughout the review process should be directed to journal editors. Please do not contact the authors or the MoTrPAC helpdesk directly.</p>
                  <p>By proceeding, you acknowledge these expectations.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={handleCancel}
                  >
                    I disagree
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={handleAgree}
                  >
                    I agree
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="w-100">
        {userType && (
          <FeatureLinks
            handleQCDataFetch={handleQCDataFetch}
            lastModified={lastModified}
            userType={userType}
          />
        )}
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
  handleQCDataFetch: PropTypes.func.isRequired,
  lastModified: PropTypes.string,
};

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.dashboard,
  lastModified: state.dataStatus.qcData.lastModified,
});

const mapDispatchToProps = (dispatch) => ({
  handleQCDataFetch: () => dispatch(DataStatusActions.fetchData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
