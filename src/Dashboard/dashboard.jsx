import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FeatureLinks from '../Search/featureLinks';
import DataStatusActions from '../DataStatusPage/dataStatusActions';
import ExternalLink from '@/lib/ui/externalLink';

import '@styles/dashboard.scss';

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
  const userType = profile.user_metadata && profile.user_metadata.userType;
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;

  if (!isAuthenticated || !hasAccess) {
    return <Navigate to="/" />;
  }

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
                  <h3>Human Sample Data Tracker</h3>
                  <div className="data-release-text mb-3">
                    Stay informed on the latest data availability of human omic sample data across assays and tissue types through their lifecycle
                  </div>
                  <Link to="/sample-data-tracker" className="btn btn-primary">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {userType && userType === 'external' && (
        <>
          <div className="jumbotron jumbotron-fluid alert-data-release external-user">
            <div className="w-75 mx-auto">
              <h1 className="highlight-title display-4 mb-4 text-center">
                <i className="bi bi-rocket-takeoff mr-3" aria-hidden="true" />
                <span>New human dataset now available!</span>
              </h1>
              <div className="row mb-5">
                <div className="col-md-12 lead d-flex align-items-start">
                  <span className="data-release-text">
                    <ExternalLink
                      to="https://motrpac.org"
                      label="MoTrPAC"
                    />
                    {' '}has publicly released new data
                    collections. The Pre-Suspension Acute Exercise Study contains data from
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
