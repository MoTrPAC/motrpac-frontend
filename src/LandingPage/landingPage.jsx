import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Link, Navigate } from 'react-router-dom';
import YouTube from 'react-youtube';

// import network figure 4e visualization dataset
import Footer from '../Footer/footer';
import IconSet from '../lib/iconSet';
import landingPageStructuredData from '../lib/searchStructuredData/landingPage';
import BackgroundVideo from './components/backgroundVideo';
import Figure1C from './components/figure1c';
import VisNetworkReactComponent from './components/visNetwork';
import PromoteBanner from './promoteBanner';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@styles/landingPage.scss'

import LayerRunner from '../assets/LandingPageGraphics/Data_Layer_Runner.png';
import LogoMoTrPACWhite from '../assets/LandingPageGraphics/logo-motrpac-white.png';
import NatureIssueCover from '../assets/LandingPageGraphics/nature_issue_cover.jpg';
import landscapeFigure4eNetworkData from '../data/landscape_figure_4e';

// animated down arrow icon
function AnimatedDownArrow() {
  return (
    <div className="animated-down-arrow pb-4 w-100">
      <img src={IconSet.ArrowDownAnimated} alt="down-arrow" />
    </div>
  );
}

// configs for visjs network visualization rendering
const options = {
  height: '100%',
  width: '100%',
  nodes: {
    shape: 'dot',
    size: 30,
    font: {
      size: 25,
      color: '#ffffff',
    },
    borderWidth: 4,
  },
  edges: {
    width: 4,
  },
  interaction: {
    hover: true,
    zoomView: false,
  },
  physics: {
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
export function LandingPage({ isAuthenticated, profile }) {
  const [backgroundVideoLoaded, setBackgroundVideoLoaded] = useState(false);
  const [networkNodes, setNetwortNodes] = useState([]);
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
    return <Navigate to="/search" />;
  }

  const backgroundVideo = document.querySelector('video');
  if (backgroundVideo) {
    backgroundVideo.onloadeddata = (e) => {
      setBackgroundVideoLoaded(true);
    };
  }

  // youtube video player configuration
  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      cc_load_policy: 1,
    },
  };

  return (
    <div className="row marketing content-container">
      <Helmet>
        <html lang="en" />
        <title>Welcome to MoTrPAC Data Hub</title>
        <script type="application/ld+json">
          {JSON.stringify(landingPageStructuredData)}
        </script>
      </Helmet>
      <section className="first">
        <div className="w-100 h-100 d-flex align-items-center">
          {!isMobile && <BackgroundVideo />}
          <div className="section-content-container container text-center">
            <div className="logo-container">
              <img src={LogoMoTrPACWhite} alt="MoTrPAC Logo" />
            </div>
            <h3 className="display-3">The Molecular Map of</h3>
            <h2 className="display-2">Exercise</h2>
            <p className="lead hero">
              <a href="https://motrpac.org/" target="_blank" rel="noreferrer">
                Welcome to the data repository for the Molecular Transducers of Physical
                Activity Consortium; a national research initiative that aims to generate
                a molecular map of the effects of exercise and training.
              </a>
            </p>
            <div className="highlighted-links-container">
              <Link
                to="/data-download"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                DATA DOWNLOAD
              </Link>
              <Link
                to="/tutorials"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                VIDEO TUTORIALS
              </Link>
              <Link
                to="/graphical-clustering"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                EXPLORE DATA
              </Link>
              <Link
                to="/publications"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                PUBLICATIONS
              </Link>
            </div>
            <div className="office-hour-anchor-link-container">
              <a href="#join-office-hour" className="office-hour-anchor-link">
                Join our monthly open office event to learn more
              </a>
            </div>
          </div>
        </div>
        <AnimatedDownArrow />
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
                    src={NatureIssueCover}
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
        <AnimatedDownArrow />
      </section>
      {/*
      <section className="second">
        <div className="w-100 h-100 d-flex align-items-center">
          <div className="section-content-container container text-center">
            <img
              src={RatFigurePaass1b}
              className="img-fluid mb-4"
              alt="Rat Figure - Endurance Training"
            />
            <h1 className="py-4">
              Explore the molecular datasets included in the study of 6 month
              old rats performing endurance training exercisse
            </h1>
          </div>
        </div>
        <AnimatedDownArrow />
      </section>
      */}
      <section className="third">
        <div className="w-100 h-100 d-flex align-items-start direction-column">
          <div className="section-content-container container-fluid text-center">
            <VisNetworkReactComponent
              data={landscapeFigure4eNetworkData}
              options={options}
              events={events}
              getNodes={getNodes}
            />
            <div className="container text-center">
              <h1 className="py-3 text-white">
                A network of genes functionally related to longevity, muscle
                system processes, and response to mechanical stimulus
              </h1>
            </div>
          </div>
        </div>
        <AnimatedDownArrow />
      </section>
      <section className="fourth">
        <div className="w-100 h-100 d-flex align-items-center">
          <div className="section-content-container container-fluid text-center">
            <Figure1C />
            <div className="container text-center">
              <h1 className="py-4">
                Visualize the number of training-differential features whose
                abundances significantly changed over the training time course
              </h1>
            </div>
          </div>
        </div>
        <AnimatedDownArrow />
      </section>
      <section className="sixth">
        <div className="w-100 h-100 d-flex align-items-center">
          <div className="section-content-container container text-center">
            <div
              className="embedContainer embed-responsive embed-responsive-16by9 mt-lg-4"
              id="youtube-tutorial-video-container"
            >
              <YouTube
                videoId="3zHnzUMo_vw"
                opts={opts}
                onReady={onPlayerReady}
                loading="lazy"
                title="Data Hub Tutorial Video"
                className="embed-youtube-video-container"
                iframeClassName="embed-responsive-item border border-dark"
              />
            </div>
            <div className="container text-center mt-4">
              <h1 className="py-4">
                Watch our tutorial video to learn how to use the MoTrPAC Data
              </h1>
            </div>
          </div>
        </div>
        <AnimatedDownArrow />
      </section>
      <section className="seventh">
        <div className="w-100 h-100 d-flex align-items-center">
          <div className="section-content-container container text-center">
            <div className="row content-code-repository d-flex align-items-center">
              <div className="feature-image col-12 col-md-5 mx-auto">
                <img
                  src={LayerRunner}
                  className="img-fluid data-layer-runner"
                  alt="Data Layer Runner"
                  loading="lazy"
                />
              </div>
              <div className="content col-12 col-md-7">
                <h1>
                  <span className="material-icons">terminal</span>
                </h1>
                <p>
                  Deep dive into our source codes integral to the MoTrPAC 6
                  month old rats performing endurance training exercise study,
                  from ingestion to QC and from processing to analysis.
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
            <div className="row mt-4" id="join-office-hour">
              <PromoteBanner />
            </div>
          </div>
        </div>
        <div className="w-100 homepage-footer-container">
          <Footer />
        </div>
      </section>
    </div>
  );
}

LandingPage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
};

LandingPage.defaultProps = {
  profile: {},
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  ...state.auth,
});

export default connect(mapStateToProps)(LandingPage);
