import React, { useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ScrollParallax } from 'react-just-parallax';
import OpenOfficeHour from './openOfficeHour';
import SubscribeDataUpdates from './components/subscribeDataUpdates';
import landingPageStructuredData from '../lib/searchStructuredData/landingPage';
import BackgroundVideo from './components/backgroundVideo';
import ExternalLink from '@/lib/ui/externalLink';

import '@styles/landingPage.scss';

const IMG_BASE_URL = 'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/images/landing_page/';

/**
 * Renders the landing page in unauthenticated state.
 */
export function LandingPage({ isAuthenticated = false, profile = {} }) {
  const bodyRef = useRef(null);

  // Mark body as loaded when component mounts
  useEffect(() => {
    document.body.classList.add('loaded');
    return () => document.body.classList.remove('loaded');
  }, []);

  // Redirect authenticated users to protected route
  const hasAccess = profile.user_metadata?.hasAccess;
  if (isAuthenticated && hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page" ref={bodyRef}>
      <Helmet>
        <html lang="en" />
        <title>Welcome to MoTrPAC Data Hub</title>
        <script type="application/ld+json">
          {JSON.stringify(landingPageStructuredData)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section">
        <BackgroundVideo />
        <div className="hero-content container">
          <img
            src={`${IMG_BASE_URL}logo-motrpac-white.png`}
            alt="MoTrPAC Logo"
            className="hero-logo"
          />
          <h3 className="hero-subtitle display-3">The Molecular Map of</h3>
          <h2 className="hero-title display-2">Exercise</h2>
          <p className="hero-description lead">
            <a href="https://motrpac.org/" className="hero-link" target="_blank" rel="noreferrer">
              Welcome to the data repository for the Molecular Transducers of
              Physical Activity Consortium; a national research initiative that
              aims to generate a molecular map of the effects of exercise and
              training.
            </a>
          </p>

          <div className="announcement-badge">
            <span className="badge-icon">
              <i className="bi bi-rocket-takeoff" />
            </span>
            <span className="badge-text">New human dataset now available!</span>
            <button
              type="button"
              className="btn btn-link"
              data-target="#subHeroModal"
              data-toggle="modal"
            >
              See details
            </button>
          </div>

          <nav className="hero-nav">
            <Link to="/data-download" className="btn btn-primary btn-lg">
              DOWNLOAD DATA
            </Link>
            <Link to="/search" className="btn btn-primary btn-lg">
              BROWSE RESULTS
            </Link>
            <Link to="/publications" className="btn btn-primary btn-lg">
              PUBLICATIONS
            </Link>
            <Link to="/code-repositories" className="btn btn-primary btn-lg">
              SOURCE CODE
            </Link>
          </nav>

          <a href="#join-office-hour" className="office-hour-link">
            Join our monthly open office event to learn more
          </a>

          <p className="compliance-notice">
            This repository is under review for potential modification in
            compliance with Administration directives.
          </p>
        </div>
      </section>

      {/* Nature Publication Section */}
      <section className="publication-section">
        <div className="container">
          <div className="publication-grid">
            <div className="publication-content">
              <h2>
                MoTrPAC animal endurance training exercise study paper now
                published in <em>Nature</em>
              </h2>
              <a
                href="https://www.nature.com/articles/s41586-023-06877-w"
                className="btn btn-primary btn-lg"
                target="_blank"
                rel="noreferrer"
              >
                LEARN MORE
              </a>
            </div>
            <div className="publication-image">
              <ScrollParallax strength={0.08}>
                <a
                  href="https://www.nature.com/nature/volumes/629/issues/8010"
                  target="_blank"
                  rel="noreferrer"
                  className="image-link"
                >
                  <img
                    src={`${IMG_BASE_URL}nature_issue_cover.jpg`}
                    alt="Nature Issue Cover"
                    loading="lazy"
                  />
                </a>
                <div className="image-attribution">
                  Cover image by Nik Spencer/Nature
                </div>
              </ScrollParallax>
            </div>
          </div>
        </div>
      </section>

      {/* Code Repository Section */}
      <section className="code-section">
        <div className="container">
          <div className="code-grid">
            <div className="code-image">
              <ScrollParallax strength={0.06}>
                <img
                  src={`${IMG_BASE_URL}Data_Layer_Runner.png`}
                  alt="Data Layer Runner"
                  loading="lazy"
                />
              </ScrollParallax>
            </div>
            <div className="code-content">
              <span className="material-icons terminal-icon">terminal</span>
              <p>
                Deep dive into the source code essential to the MoTrPAC
                endurance training in young adult rats and acute exercise in
                human sedentary adults studies, everything from
                ingestion to QC, and from processing to analysis.
              </p>
              <Link to="/code-repositories" className="btn btn-primary btn-lg mt-2">
                LEARN MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hour & Subscribe Section */}
      <section className="community-section" id="join-office-hour">
        <div className="container">
          <OpenOfficeHour />
          <SubscribeDataUpdates />
        </div>
      </section>

      {/* Modal */}
      <div
        className="modal fade"
        id="subHeroModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="subHeroModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content announcement-modal">
            <div className="modal-header">
              <h3 className="modal-title" id="subHeroModalLabel">
                <i className="bi bi-rocket-takeoff" />
                <span>New human dataset now available!</span>
              </h3>
              <button
                type="button"
                className="close"
                aria-label="Close"
                data-dismiss="modal"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                <ExternalLink to="https://motrpac.org" label="MoTrPAC" /> has
                publicly released new data collections. The Pre-Suspension Acute
                Exercise Study contains data from sedentary adults undergoing
                acute resistance or endurance exercise bouts. Visit the{' '}
                <Link to="/search" reloadDocument>
                  Browse Results
                </Link>{' '}
                page for summary-level results and the{' '}
                <ExternalLink
                  to="https://data-viz.motrpac-data.org/precawg"
                  label="Data Visualization"
                />{' '}
                for interactive analysis. Please refer to the{' '}
                <Link to="/citation" reloadDocument>
                  Citation
                </Link>{' '}
                page for information on acknowledging MoTrPAC when using this
                dataset in your work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LandingPage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  ...state.auth,
});

export default connect(mapStateToProps)(LandingPage);
