import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from 'react-responsive';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import Footer from '../Footer/footer';
import OpenOfficeHour from './openOfficeHour';
import SubscribeDataUpdates from './components/subscribeDataUpdates';
import VisNetworkReactComponent from './components/visNetwork';
import landingPageStructuredData from '../lib/searchStructuredData/landingPage';
import IconSet from '../lib/iconSet';
import BackgroundVideo from './components/backgroundVideo';
import Figure1C from './components/figure1c';
import ExternalLink from '@/lib/ui/externalLink';

// import network figure 4e visualization dataset
import landscapeFigure4eNetworkData from '../data/landscape_figure_4e';

import '@styles/landingPage.scss'

const imgSourceUrl = 'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/images/landing_page/';

// animated down arrow icon
function AnimatedDownArrow() {
  return (<div className="animated-down-arrow pb-4 w-100">
      <img src={IconSet.ArrowDownAnimated} alt="down-arrow"/>
    </div>);
}

function AnimatedDownArrowDark() {
  return (<div className="animated-down-arrow pb-4 w-100">
      <img src={IconSet.ArrowDownAnimatedDark} alt="down-arrow"/>
    </div>);
}

// configs for visjs network visualization rendering
const options = {
  height: '100%', width: '100%', nodes: {
    shape: 'dot', size: 30, font: {
      size: 25, color: '#ffffff',
    }, borderWidth: 4,
  }, edges: {
    width: 4,
  }, interaction: {
    hover: true, zoomView: false,
  }, physics: {
    enabled: false,
  },
};

/**
 * Renders the landing page in unauthenticated state.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Object}  profile         Redux state for authenticated user's info.
 *
 * @returns {object} JSX representation of the landing page.
 */
export function LandingPage({ isAuthenticated = false, profile = {} }) {
  const [backgroundVideoLoaded, setBackgroundVideoLoaded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [_networkNodes, setNetwortNodes] = useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    if (backgroundVideoLoaded || isMobile) {
      const documentBody = document.querySelector('body.homepage');
      if (documentBody) {
        documentBody.classList.add('loaded');
      }
    }
  }, [backgroundVideoLoaded, isMobile]);

  // vis-network-react event object
  const events = {};
  // vis-network-react event handlers
  const getNodes = useCallback((a) => {
    setNetwortNodes(a);
  }, []);

  const goToExternalLink = useCallback(() => {
    window.open('https://www.nature.com/nature/volumes/629/issues/8010', '_blank');
  }, []);

  // Redirect authenticated users to protected route
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  if (isAuthenticated && hasAccess) {
    return <Navigate to="/dashboard" replace={true}/>;
  }

  const backgroundVideo = document.querySelector('video');
  if (backgroundVideo) {
    backgroundVideo.onloadeddata = () => {
      setBackgroundVideoLoaded(true);
    };
  }

  return (<div className="row marketing content-container">
      <Helmet>
        <html lang="en"/>
        <title>Welcome to MoTrPAC Data Hub</title>
        <script type="application/ld+json">
          {JSON.stringify(landingPageStructuredData)}
        </script>
      </Helmet>
      <section className="first">
        <div className="w-100 h-100 d-flex align-items-center">
          {!isMobile && <BackgroundVideo/>}
          <div className="section-content-container container text-center">
            <div className="logo-container">
              <img src={`${imgSourceUrl}logo-motrpac-white.png`} alt="MoTrPAC Logo"/>
            </div>
            <h3 className="display-3">The Molecular Map of</h3>
            <h2 className="display-2">Exercise</h2>
            <p className="lead hero">
              <a href="https://motrpac.org/" className="hero-text" target="_blank" rel="noreferrer">
                Welcome to the data repository for the Molecular Transducers of Physical
                Activity Consortium; a national research initiative that aims to generate
                a molecular map of the effects of exercise and training.
              </a>
            </p>
            <div className="sub-hero">
              <div className="sub-hero-content-container d-flex align-items-center justify-content-center">
                <h3 className="sub-hero-title">
                  <i className="bi bi-rocket-takeoff"/>
                  <span className="ml-2">New human dataset now available!</span>
                </h3>
                <button type="button" className="btn btn-link" data-target="#subHeroModal" data-toggle="modal">See details</button>
              </div>
            </div>
            <div className="highlighted-links-container">
              <Link
                to="/data-download"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                DOWNLOAD DATA
              </Link>
              <Link
                to="/search"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                BROWSE RESULTS
              </Link>
              <Link
                to="/publications"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                PUBLICATIONS
              </Link>
              <Link
                to="/code-repositories"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                SOURCE CODE
              </Link>
            </div>
            <div className="office-hour-anchor-link-container">
              <a href="#join-office-hour" className="office-hour-anchor-link">
                Join our monthly open office event to learn more
              </a>
            </div>
            <div className="compliance-review-notice">
              <span>
                This repository is under review for potential modification in
                compliance with Administration directives.
              </span>
            </div>
          </div>
        </div>
        <AnimatedDownArrow/>
      </section>
      <section className="fifth">
        <div className="w-100 h-100 d-flex align-items-center">
          <div className="section-content-container container text-center">
            <div className="row content-landscape-paper d-flex align-items-center">
              <div className="content col-12 col-md-6">
                <h1>
                  MoTrPAC animal endurance training exercise study paper now published in
                  {' '}
                  <span className="font-italic">Nature</span>
                </h1>
                <a
                  href="https://www.nature.com/articles/s41586-023-06877-w"
                  className="btn btn-primary btn-lg mt-4"
                  role="button"
                  target="_blank"
                  rel="noreferrer"
                >
                  LEARN MORE
                </a>
              </div>
              <div className="feature-image-content-container col-12 col-md-6 mx-auto">
                <div className="feature-image" onClick={goToExternalLink}>
                  <img
                    src={`${imgSourceUrl}nature_issue_cover.jpg`}
                    className="img-fluid lanascape-paper-abstract"
                    alt="Landscape Paper Abstract"
                    loading="lazy"
                  />
                </div>
                <div className="feature-image-attribution mt-1">Cover image by Nik Spencer/Nature</div>
              </div>
            </div>
          </div>
        </div>
        <AnimatedDownArrow/>
      </section>
      <section className="seventh">
        <div className="w-100 h-100 d-flex align-items-center">
          <div className="section-content-container container text-center">
            <div className="row content-code-repository d-flex align-items-center">
              <div className="feature-image col-12 col-md-6 mx-auto">
                <img
                  src={`${imgSourceUrl}Data_Layer_Runner.png`}
                  className="img-fluid data-layer-runner"
                  alt="Data Layer Runner"
                  loading="lazy"
                />
              </div>
              <div className="content col-12 col-md-6">
                <h1>
                  <span className="material-icons">terminal</span>
                </h1>
                <p>
                  Deep dive into the source code essential to the MoTrPAC
                  endurance training in young adult rats and acute exercise
                  in human sedentary adults studies, covering everything
                  from ingestion to QC, and from processing to analysis.
                </p>
                <Link
                  to="/code-repositories"
                  className="btn btn-primary btn-lg mt-4"
                  role="button"
                >
                  LEARN MORE
                </Link>
              </div>
            </div>
          </div>
        </div>
        <AnimatedDownArrowDark/>
      </section>
      <section className="eighth">
        <div className="w-100 h-100">
          <div className="section-content-container container text-center d-flex align-items-center">
            <div className="panel-content-container">
              <OpenOfficeHour/>
              <SubscribeDataUpdates/>
            </div>
          </div>
          <div className="w-100 homepage-footer-container">
            <Footer/>
          </div>
        </div>
      </section>
      <div className="sub-hero-modal modal fade" id="subHeroModal" tabIndex="-1" role="dialog"
        aria-labelledby="subHeroModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title display-4 mt-2 mb-2" id="subHeroModalLabel">
                <i className="bi bi-rocket-takeoff"/>
                <span className="ml-3">New human dataset now available!</span>
              </h3>
              <button type="button" className="close btn-modal-close" aria-label="Close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p className="sub-hero-text-details">
                <ExternalLink
                  to="https://motrpac.org"
                  label="MoTrPAC"
                />
                {' '}has publicly released new data
                collections. The Pre-Suspension Acute Exercise Study contains data from
                sedentary adults undergoing acute resistance or endurance exercise
                bouts. Visit the{' '}
                <Link to="/search" reloadDocument>Browse Results</Link>
                {' '}page for summary-level results and the{' '}
                <ExternalLink
                  to="https://data-viz.motrpac-data.org/precawg"
                  label="Data Visualization"
                />
                {' '}for interactive analysis. Please refer to the{' '}
                <Link to="/citation" reloadDocument>Citation</Link>
                {' '}page for information on acknowledging MoTrPAC
                when using this dataset in your work.
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
  }), isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  ...state.auth,
});

export default connect(mapStateToProps)(LandingPage);
