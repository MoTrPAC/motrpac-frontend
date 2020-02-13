import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Particles from 'react-particles-js';
import { useSpring, animated } from 'react-spring';
import LogoAnimation from '../assets/LandingPageGraphics/LogoAnimation_03082019-yellow_pipelineball_left.gif';
import LayerRunner from '../assets/LandingPageGraphics/Data_Layer_Runner.png';
import HealthyHeart from '../assets/LandingPageGraphics/Infographic_Healthy_Heart.png';
import ContactHelpdesk from '../lib/ui/contactHelpdesk';

// react-spring mouse parallax config
const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans3d = (x, y) => `translate3d(${x / 6}px,${y / 16}px,0)`;

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
  const [visibility, setVisibility] = useState(true);
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  // react-spring set animation values
  const [values, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));
  const { xy } = values;

  if (isAuthenticated && hasAccess) {
    return <Redirect to="/releases" />;
  }

  const scrollFunction = () => {
    if (document.body.scrollTop >= 30 || document.documentElement.scrollTop >= 30) {
      document.querySelector('.navbar-brand').classList.add('resized');
    } else {
      document.querySelector('.navbar-brand').classList.remove('resized');
    }
  };

  window.addEventListener('scroll', scrollFunction, true);

  // Pause particles movement when page is not active to reduce CPU resource consumption
  let hidden;
  let visibilityChange;
  // Set the name of the hidden property and the change event for visibility
  if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  // Handle state change depending whether page is hidden
  function handleVisibilityChange() {
    if (document[hidden]) {
      setVisibility(false);
    } else {
      setVisibility(true);
    }
  }

  if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    console.warn('This browser does not support Page Visibility API');
  } else {
    // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }

  // Play or stop the particles animation
  function playStopParticles() {
    setVisibility(!visibility);
  }

  // Function to render external data release notice
  const ExternalDataReleaseNotice = () => (
    <div className="alert alert-primary alert-dismissible fade show data-access-announce d-flex align-items-center justify-content-between w-100" role="alert">
      <span className="data-access-announce-content">
        <h6>
          MoTrPAC data release 1.0 is now available! There is data from 5 different
          tissues following an acute exercise bout in rats. Visit the
          {' '}
          <Link to="/data-access" className="inline-link">Data Access</Link>
          {' '}
          page to learn more and register for access.
        </h6>
        <h6>
          Additional control time point data will be released soon.
          {' '}
          <Link to="/news" className="inline-link">Read more</Link>
          {' '}
          about it.
        </h6>
      </span>
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );

  return (
    <div className="row marketing">
      <main>
        <div className="container hero h-100">
          <div className="row hero-wrapper h-100">
            <ExternalDataReleaseNotice />
            <div className="hero-image col-12 col-md-8 mx-auto">
              <img src={LogoAnimation} className="img-fluid" alt="Data Layer Runner" />
            </div>
            <div className="content col-12 col-md-4 motrpac-tag-line">
              <h3>
                <em>Understanding</em>
                at the molecular level how physical activity makes us healthier
              </h3>
            </div>
          </div>
        </div>
      </main>
      <section>
        <div className="about-motrpac" id="about-motrpac">
          <Particles
            width="100%"
            height="480px"
            className="position-absolute particles-wrapper"
            params={{
              particles: {
                number: { value: 40, density: { enable: true, value_area: 500 } },
                color: { value: '#000000' },
                size: { value: 7.5 },
                line_linked: {
                  distance: 150,
                  color: '#000000',
                  opacity: 0.7,
                  width: 2,
                },
                move: {
                  speed: 5,
                  enable: visibility,
                },
              },
              interactivity: {
                events: {
                  onhover: { enable: true, mode: 'grab' },
                  onclick: { enable: true, mode: 'push' },
                  modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 },
                  },
                },
              },
            }}
          />
          <button type="button" className="btn btn-dark btn-sm particle-media-control" onClick={playStopParticles} title="play|stop">
            {visibility ? <span className="oi oi-media-stop" /> : <span className="oi oi-media-play" />}
          </button>
          <div className="container featurette h-100">
            <div className="row featurette-wrapper h-100">
              <div className="content col-12">
                <h3>About MoTrPAC</h3>
                <p>
                  Molecular Transducers of Physical Activity Consortium is a national
                  research consortium designed to discover and characterize the range of molecular transducers
                  (the "molecular map") that underlie the effects of physical activity
                  in humans.
                </p>
                <a href="https://motrpac.org/" className="btn btn-dark" role="button" target="_new">READ MORE</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container featurette multi-omics" id="multi-omics">
          <div className="row featurette-wrapper h-100">
            <div className="feature-image col-12 col-md-6 mx-auto" onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
              <animated.div className="animated-image-container" style={{ transform: xy.interpolate(trans3d) }}>
                <img src={LayerRunner} className="img-fluid data-layer-runner" alt="Data Layer Runner" />
              </animated.div>
            </div>
            <div className="content col-12 col-md-6">
              <h3>Multi-Omics</h3>
              <p>
                MoTrPAC integrates multi-omics data (genomics, proteomics, metabolomics, and
                more) to reveal a comprehensive map of molecular transducers of physical activity.
              </p>
              <a href="https://motrpac.org/ancillarystudyguidelines.cfm" className="btn btn-primary" role="button" target="_new">READ MORE</a>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="interrelated-components" id="interrelated-components">
          <div className="container featurette h-100">
            <div className="row featurette-wrapper h-100">
              <div className="content col-12 col-md-6">
                <h3>Interrelated Components</h3>
                <p>
                  Consisting of Clinical Centers, Preclinical Animal Study Sites, Chemical Analysis
                  Sites, Bioinformatics Center, Consortium Coordinating Center.
                </p>
                <a href="https://commonfund.nih.gov/MolecularTransducers/overview#ClinicalCenter" className="btn btn-success" role="button" target="_new">READ MORE</a>
              </div>
              <div className="feature-image col-12 col-md-6 mx-auto">
                <img src={HealthyHeart} className="img-fluid" alt="Healthy Heart" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container featurette data-policies">
          <div className="row">
            <div className="p-2 col-12 col-md-6 access-data-info">
              <h5>Accessing Data: </h5>
              The first MoTrPAC public data release is now available. Please agree to
              the data use agreement and register for an account on the&nbsp;
              <a href="/data-access" className="inline-link">Data Access</a>
              &nbsp;page if you are interested in obtaining access to the data. For updates when
              subsequent publicly accessible data become available, please
              {' '}
              <ContactHelpdesk />
            </div>
            <div className="p-2 col-12 col-md-6 upload-data-info">
              <h5>Uploading Data From Study Sites:</h5>
              If you are a member of one of the sites involved with MoTrPAC, please log in using
              your provided ID at the link on the bottom right of this website. If you have issues
              logging in, please
              {' '}
              <ContactHelpdesk />
            </div>
          </div>
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

const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(LandingPage);
