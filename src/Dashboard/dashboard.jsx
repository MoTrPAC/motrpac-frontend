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

import '@styles/dashboard.scss';

const PACK_ANALYSIS = 'bundles/motrpac_human-precovid-sed-adu_analysis.zip';
const PACK_DATA = 'bundles/motrpac_human-precovid-sed-adu_data.zip';
const PACK_CLINICAL_ANALYSIS = 'bundles/motrpac_human-precovid-sed-adu_clinic-analysis.zip';
const PACK_ACUTE = 'bundles/motrpac_human-precovid-sed-adu_acute.zip';
const PACK_REPRO = 'bundles/motrpac_human-precovid-sed-adu_repro.zip';

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
  // Initialize agreement state from sessionStorage to persist across page navigations
  const [agreement, setAgreement] = useState(() => {
    const saved = sessionStorage.getItem('reviewerAgreement');
    return saved === 'true';
  });

  const userType = profile.user_metadata && profile.user_metadata.userType;
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  const userRole = profile.app_metadata && profile.app_metadata.role;

  if (!isAuthenticated || !hasAccess) {
    return <Navigate to="/" />;
  }

  // Show modal for reviewers who haven't agreed yet
  useEffect(() => {
    if (userType === 'external' && userRole === 'reviewer' && !agreement) {
      $('#reviewerAgreementModal').modal('show');
      
      return () => {
        $('#reviewerAgreementModal').modal('hide');
      };
    }
  }, [userType, userRole, agreement]);

  // Handler to save agreement to sessionStorage
  const handleAgree = () => {
    setAgreement(true);
    sessionStorage.setItem('reviewerAgreement', 'true');
  };

  // Handler to dismiss modal without agreeing - keeps buttons disabled
  const handleCancel = () => {
    setAgreement(false);
    sessionStorage.setItem('reviewerAgreement', 'false');
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
      {userType && userType === 'external' && userRole && userRole === 'reviewer' && (
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
                    human data in R packages and the visualization tool. If you have
                    any questions, please contact the journal editor directly.
                  </span>
                </div>
                <div className="col-md-12 lead d-flex align-items-start mt-2">
                  <span className="data-release-text">
                    Please note, the Analysis and Clinical Analysis R packages depend
                    on the Data R packages. It is recommended to download and install
                    all four of them. See the README document in each of the R packages
                    for more details.
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 lead d-flex align-items-start">
                  <div className="feature-highlight-icon mr-3">
                    <span className="material-icons" aria-hidden="true">
                      folder
                    </span>
                  </div>
                  <div className="feature-highlight-content mr-1">
                    <h3>Data R Package</h3>
                    <div className="data-release-text mb-3">
                      Clinical and phenotypic data, omic normalized expression, and other resource files from the Acute Exercise in Human Sedentary Adults (pre-suspension) study
                    </div>
                    <ReviewerDownloadButton
                      filename={PACK_DATA}
                      label="Download"
                      icon="bi-file-zip-fill"
                      profile={profile}
                      disabled={!agreement}
                    />
                  </div>
                </div>
                <div className="col-md-4 lead d-flex align-items-start">
                  <div className="feature-highlight-icon mr-3">
                    <span className="material-icons" aria-hidden="true">
                      folder
                    </span>
                  </div>
                  <div className="feature-highlight-content mr-1">
                    <h3>Analysis R Package</h3>
                    <div className="data-release-text mb-3">
                      Summary statistics, differential analysis results, and downstream modeling outputs from the Acute Exercise in Human Sedentary Adults (pre-suspension) study
                    </div>
                    <ReviewerDownloadButton
                      filename={PACK_ANALYSIS}
                      label="Download"
                      icon="bi-file-zip-fill"
                      profile={profile}
                      disabled={!agreement}
                    />
                  </div>
                </div>
                <div className="col-md-4 lead d-flex align-items-start">
                  <div className="feature-highlight-icon mr-3">
                    <span className="material-icons" aria-hidden="true">
                      folder
                    </span>
                  </div>
                  <div className="feature-highlight-content mr-1">
                    <h3>Clinical Analysis R Package</h3>
                    <div className="data-release-text mb-3">
                      R project pipeline, focusing on clinical data, that creates tables and figures for analysis of the Acute Exercise in Human Sedentary Adults (pre-suspension) study
                    </div>
                    <ReviewerDownloadButton
                      filename={PACK_CLINICAL_ANALYSIS}
                      label="Download"
                      icon="bi-file-zip-fill"
                      profile={profile}
                      disabled={!agreement}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-4 lead d-flex align-items-start">
                  <div className="feature-highlight-icon mr-3">
                    <span className="material-icons" aria-hidden="true">
                      folder
                    </span>
                  </div>
                  <div className="feature-highlight-content mr-1">
                    <h3>Manuscript R Package</h3>
                    <div className="data-release-text mb-3">
                      Code, parameters, and documentation/links to external data used to generate each of the manuscripts for the Acute Exercise in Human Sedentary Adults (pre-suspension) study
                    </div>
                    <ReviewerDownloadButton
                      filename={PACK_ACUTE}
                      label="Download"
                      icon="bi-file-zip-fill"
                      profile={profile}
                      disabled={!agreement}
                    />
                  </div>
                </div>
                <div className="col-md-4 lead d-flex align-items-start">
                  <div className="feature-highlight-icon mr-3">
                    <span className="material-icons" aria-hidden="true">
                      folder
                    </span>
                  </div>
                  <div className="feature-highlight-content mr-1">
                    <h3>Reproduction R Package</h3>
                    <div className="data-release-text mb-3">
                      End-to-end reproduction pipeline for the Acute Exercise in Human Sedentary Adults (pre-suspension) study, run as a single dependency graph
                    </div>
                    <ReviewerDownloadButton
                      filename={PACK_REPRO}
                      label="Download"
                      icon="bi-file-zip-fill"
                      profile={profile}
                      disabled={!agreement}
                    />
                  </div>
                </div>
              </div>
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
