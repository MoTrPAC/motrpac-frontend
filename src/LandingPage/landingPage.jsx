import React, { useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import VisNetworkReactComponent from 'vis-network-react';
import IframeResizer from 'iframe-resizer-react';
import Footer from '../Footer/footer';
import PromoteBanner from './promoteBanner';
import landingPageStructuredData from '../lib/searchStructuredData/landingPage';
import IconSet from '../lib/iconSet';

import LayerRunner from '../assets/LandingPageGraphics/Data_Layer_Runner.png';
import RatFigurePaass1b from '../assets/LandingPageGraphics/rat-figure-pass1b.svg';
import TutorialVideoPreviewImage from '../assets/LandingPageGraphics/tutorial_video_preview_image.jpg';
import LandscapePreprintAbstract from '../assets/LandingPageGraphics/landscape_preprint_abstract.jpg';
import BackgroundVideo from './components/backgroundVideo';
import Figure1C from './components/figure1c';

// import figure 4E visualization dataset
const figure4eData = require('../data/landscape_figure_4e.json');

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

let events = {
  click(params) {
    params.event = '[original event]';
    console.log(
      'click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM),
    );
  },
  doubleClick (params) {
    console.log('doubleClick Event:', params);
    params.event = '[original event]';
  },
  oncontext (params) {
    console.log('oncontext Event:', params);

    params.event = '[original event]';
  },
  dragStart (params) {
    // There's no point in displaying this event on screen, it gets immediately overwritten
    params.event = '[original event]';
    console.log('dragStart Event:', params);
    console.log(
      'dragStart event, getNodeAt returns: ' +
        this.getNodeAt(params.pointer.DOM),
    );
  },
  dragging (params) {
    params.event = '[original event]';
  },
  dragEnd (params) {
    params.event = '[original event]';
    console.log('dragEnd Event:', params);
    console.log(
      'dragEnd event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM),
    );
  },
  controlNodeDragging (params) {
    params.event = '[original event]';
  },
  controlNodeDragEnd (params) {
    params.event = '[original event]';
    console.log('controlNodeDragEnd Event:', params);
  },
  zoom (params) {},
  showPopup (params) {},
  hidePopup () {
    console.log('hidePopup Event');
  },
  select (params) {
    console.log('select Event:', params);
  },
  selectNode (params) {
    console.log('selectNode Event:', params);
  },
  selectEdge (params) {
    console.log('selectEdge Event:', params);
  },
  deselectNode (params) {
    console.log('deselectNode Event:', params);
  },
  deselectEdge (params) {
    console.log('deselectEdge Event:', params);
  },
  hoverNode (params) {
    console.log('hoverNode Event:', params);
  },
  hoverEdge (params) {
    console.log('hoverEdge Event:', params);
  },
  blurNode (params) {
    console.log('blurNode Event:', params);
  },
  blurEdge (params) {
    console.log('blurEdge Event:', params);
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
  // Local state for managing particle animation
  const [data, setData] = useState(figure4eData);
  const [networkNodes, setNetwortNodes] = useState([]);
  const [videoHeight, setVideoHeight] = useState('480px');
  const iframeRef = useRef(null);

  useEffect(() => {
    // set video height responsively
    const el = document.querySelector('#iframe-container');
    if (el) {
      setVideoHeight(((el.scrollWidth - 30) / 16) * 9 + 'px');
    }
  }, []);

  const handleAddNode = useCallback(() => {
    const id = data.nodes.length + 1;
    setData({
      ...data,
      nodes: [...data.nodes, { id, label: `Node ${id}` }],
    });
  }, [setData, data]);

  const getNodes = useCallback((a) => {
    setNetwortNodes(a);
  }, []);

  const handleGetNodes = useCallback(() => {
    console.log(networkNodes);
  }, [networkNodes]);

  const goToExternalLink = useCallback(() => {
    window.open(
      'https://www.biorxiv.org/content/10.1101/2022.09.21.508770v3',
      '_blank',
    );
  }, []);

  // Redirect authenticated users to protected route
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  if (isAuthenticated && hasAccess) {
    return <Redirect to="/search" />;
  }

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
          <BackgroundVideo />
          <div className="section-content-container container text-center">
            <h1 className="display-1">About MoTrPAC</h1>
            <p className="lead">
              <span className="font-weight-bold">
                Molecular Transducers of Physical Activity Consortium (MoTrPAC)
              </span>{' '}
              is a national research consortium. Its goal is to{' '}
              <span className="font-italic about-motrpac-emphasis">
                study the molecular changes that occur in response to exercise,
              </span>{' '}
              and ultimately to advance the understanding of how physical
              activity improves and preserves health. We aim to generate a
              molecular map of the effects of exercise.
            </p>
            <div className="highlighted-links-container">
              <Link
                to="/project-overview"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                PROJECT OVERVIEW
              </Link>
              <Link
                to="/tutorial"
                className="btn btn-primary btn-lg mt-4"
                role="button"
              >
                VIDEO TUTORIALS
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
              data={data}
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
      <section className="fifth">
        <div className="w-100 h-100 d-flex align-items-center">
          <div className="section-content-container container text-center">
            <div className="row content-landscape-preprint d-flex align-items-center">
              <div className="content col-12 col-md-6">
                <h1>
                  MoTrPAC Endurance Exercise Training Animal Study Landscape
                  Preprint now available at bioRxiv
                </h1>
                <a
                  href="https://www.biorxiv.org/content/10.1101/2022.09.21.508770v3"
                  className="btn btn-primary btn-lg mt-4"
                  role="button"
                  target="_blank"
                  rel="noreferrer"
                >
                  LEARN MORE
                </a>
              </div>
              <div className="feature-image col-12 col-md-6 mx-auto" onClick={goToExternalLink}>
                <img
                  src={LandscapePreprintAbstract}
                  className="img-fluid data-layer-runner"
                  alt="Data Layer Runner"
                />
              </div>
            </div>
          </div>
        </div>
        <AnimatedDownArrow />
      </section>
      <section className="sixth">
        <div className="w-100 h-100 d-flex align-items-center">
          <div className="section-content-container container text-center">
            <div className="col-12" id="iframe-container">
              <img
                src={TutorialVideoPreviewImage}
                alt="Tutorial Video Preview"
                className="tutorial-video-preview"
              />
              <IframeResizer
                forwardRef={iframeRef}
                heightCalculationMethod="max"
                widthCalculationMethod="max"
                allow="autoplay"
                src="https://drive.google.com/file/d/1dYoqYmN5RVk8Spyp2c-bxP5R7WA73Zag/preview"
                style={{
                  height: videoHeight,
                  width: '1px',
                  minWidth: '100%',
                  border: '1px solid #000',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2em 3em rgba(0, 0, 0, 0.5)',
                }}
                autoResize
                scrolling
                sizeHeight
                sizeWidth
              />
            </div>
            <div className="container text-center mt-5">
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
