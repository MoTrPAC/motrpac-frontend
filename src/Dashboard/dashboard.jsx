import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FeatureLinks from '../Search/featureLinks';
import DataStatusActions from '../DataStatusPage/dataStatusActions';
import ReviewerDownloadButton from './reviewerDownloadButton';

import '@styles/dashboard.scss';

const PACK_ANALYSIS = 'bundles/motrpac_human-precovid-sed-adu_analysis.zip';
const PACK_DATA = 'bundles/motrpac_human-precovid-sed-adu_data.zip';
const PACK_FUNCTION = 'bundles/motrpac_human-precovid-sed-adu_function.zip';
const PACK_CLINICAL_ANALYSIS = 'bundles/motrpac_human-precovid-sed-adu_clinic-analysis.zip';

/**
 * Renders the Dashboard page
 *
 * @param {Object} profile  Redux state of authenticated user profile
 *
 * @returns {object} JSX representation of the Dashboard
 */
export function Dashboard({ 
  profile = {}, 
  handleQCDataFetch, 
  lastModified = '',
}) {
  // Initialize agreement state from sessionStorage to persist across page navigations
  const [agreement, setAgreement] = useState(() => {
    const saved = sessionStorage.getItem('reviewerAgreement');
    return saved === 'true';
  });
  const modalRef = useRef(null);
  const userType = profile.user_metadata && profile.user_metadata.userType;
  const userRole = profile.app_metadata && profile.app_metadata.role;

  // Show modal for reviewers who haven't agreed yet
  useEffect(() => {
    if (userType === 'external' && userRole === 'reviewer' && !agreement && modalRef.current) {
      // Use Bootstrap's native JavaScript Modal API (no jQuery required)
      import('bootstrap').then((bootstrap) => {
        const modalInstance = new bootstrap.Modal(modalRef.current, {
          backdrop: 'static',
          keyboard: false
        });
        modalInstance.show();
      });
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
          <div className="container">
            <h1 className="highlight-title display-1 text-center mb-4">
              <i className="bi bi-rocket-takeoff mr-3" />
              <span>Available Now!</span>
            </h1>
            <div className="row">
              <div className="col-md-6 lead d-flex align-items-start">
                <div className="data-release-icon mr-2">
                  <span className="material-icons">
                    person
                  </span>
                </div>
                <div className="data-release-icon mr-1">
                  <span className="data-release-text">
                    The pre-COVID human sedentary adults dataset has been made available
                    to consortium users. You may
                    {' '}
                    <Link to="/data-download">download them</Link>
                    {' '}
                    or
                    {' '}
                    <Link to="/search">explore the differential abundance</Link>
                    {' '}
                    in the dataset. Please refer to the
                    {' '}
                    <a href={import.meta.env.VITE_DATA_RELEASE_README} target="_blank" rel="noopener noreferrer">
                      Consortium Release document
                    </a>
                    {' '}
                    for more information on this dataset.
                  </span>
                </div>
              </div>
              <div className="col-md-6 lead d-flex align-items-start">
                <div className="data-release-icon mr-2">
                  <span className="material-icons">
                    pest_control_rodent
                  </span>
                </div>
                <div className="data-release-icon mr-1">
                  <span className="data-release-text">
                    The consortium release of young adult rats acute exercise data is also
                    accessible now. Users may
                    {' '}
                    <Link to="/data-download">download them</Link>
                    {' '}
                    or
                    {' '}
                    <Link to="/search">explore the differential abundance</Link>
                    {' '}
                    in the dataset. Please refer to the
                    {' '}
                    <a href="https://docs.google.com/document/d/1PlWzZ6SPMX7SeW8TxeDKEfnACrG2YOiZclDsw2UBs84/edit?tab=t.0#heading=h.nizg0n7kpig1" target="_blank" rel="noopener noreferrer">
                      Consortium Release document
                    </a>
                    {' '}
                    for more information on this dataset.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {userType && userType === 'external' && !userRole && (
        <div className="alert-data-release">
          <h1 className="dashboard-title display-4 mb-4">
            <span>
              Welcome,
              {' '}
              {profile.user_metadata.givenName}
            </span>
          </h1>
        </div>
      )}
      {/* Welcome message for external users with reviewer role */}
      {userType && userType === 'external' && userRole && userRole === 'reviewer' && (
        <>
          <div className="alert-data-release">
            <h1 className="dashboard-title display-4 mb-4">
              <span>
                {`Hello, Reviewer!`}
              </span>
            </h1>
            <div className="bd-callout bd-callout-primary shadow-sm mb-4">
              <div className="lead">
                As a reviewer, you have been granted access to the pre-publication
                human data in R packages and the visualization tool. If you have
                any questions, please contact the journal editor directly.
              </div>
              <div className="lead mt-2">
                Please note, the Analysis and Clinical Analysis R packages depend
                on the Function and Data R packages. It is recommended to download
                and install all four of them. See the README document in each of the
                R packages for more details.
              </div>
              <div className="lead reviewer-data-download-links-container mt-3">
                <ReviewerDownloadButton
                  filename={PACK_FUNCTION}
                  label="Function R Package"
                  icon="bi-file-zip-fill"
                  profile={profile}
                  disabled={!agreement}
                />
                <ReviewerDownloadButton
                  filename={PACK_DATA}
                  label="Data R Package"
                  icon="bi-file-zip-fill"
                  profile={profile}
                  disabled={!agreement}
                />
                <ReviewerDownloadButton
                  filename={PACK_ANALYSIS}
                  label="Analysis R Package"
                  icon="bi-file-zip-fill"
                  profile={profile}
                  disabled={!agreement}
                />
                <ReviewerDownloadButton
                  filename={PACK_CLINICAL_ANALYSIS}
                  label="Clinical Analysis R Package"
                  icon="bi-file-zip-fill"
                  profile={profile}
                  disabled={!agreement}
                />
              </div>
            </div>
          </div>
          <div ref={modalRef} id="reviewerAgreementModal" className="modal fade" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">Data Use Agreement</h5>
                </div>
                <div className="modal-body">
                  <h5 className="font-weight-bold">PLEASE READ BEFORE DOWNLOADING DATA</h5>
                  <p>By clicking "I agree" and downloading data from this portal, you agree to:</p>
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
            userRole={userRole || ''}
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
