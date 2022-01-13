import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Particles from 'react-particles-js';
import { useSpring, animated } from 'react-spring';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';
import LogoAnimation from '../assets/LandingPageGraphics/LogoAnimation_03082019-yellow_pipelineball_left.gif';
import LayerRunner from '../assets/LandingPageGraphics/Data_Layer_Runner.png';
import HealthyHeart from '../assets/LandingPageGraphics/Infographic_Healthy_Heart.png';
import ContactHelpdesk from '../lib/ui/contactHelpdesk';
import onVisibilityChange from '../lib/utils/pageVisibility';

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

  useEffect(() => {
    const scrollFunction = () => {
      if (
        document.body.scrollTop >= 30 ||
        document.documentElement.scrollTop >= 30
      ) {
        document.querySelector('.navbar-brand').classList.add('resized');
      } else {
        document.querySelector('.navbar-brand').classList.remove('resized');
      }
    };
    window.addEventListener('scroll', scrollFunction, true);
    return () => {
      window.removeEventListener('scroll', scrollFunction, true);
    };
  });

  useEffect(() => {
    // Pause particle animation when window is hidden
    const { hidden, visibilityChange } = onVisibilityChange();
    const handleVisibilityChange = () => {
      if (!document[hidden]) {
        setVisibility(true);
      } else {
        setVisibility(false);
      }
    };
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
    return () => {
      document.removeEventListener(
        visibilityChange,
        handleVisibilityChange,
        false
      );
    };
  });

  // react-spring set animation values
  const [values, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));
  const { xy } = values;

  // Redirect authenticated users to protected route
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  if (isAuthenticated && hasAccess) {
    return <Redirect to="/home" />;
  }

  // Play or stop the particles animation
  function playStopParticles() {
    setVisibility(!visibility);
  }

  // Function to render marker paper announcement
  const MarkerPaperNotice = () => (
    <div
      className="alert alert-primary alert-dismissible fade show marker-paper-announce d-flex align-items-center justify-content-between w-100"
      role="alert"
    >
      <span className="marker-paper-announce-content">
        <h5>
          The
          {' '}
          <a
            href="https://www.cell.com/cell/fulltext/S0092-8674(20)30691-7"
            className="inline-link-with-icon"
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackEvent.bind(
              this,
              'MoTrPAC Marker Paper',
              'Cell Publication',
              'Landing Page'
            )}
          >
            first MoTrPAC paper
            <i className="material-icons external-linkout-icon">open_in_new</i>
          </a>
          {' '}
          is now published in the journal
          {' '}
          <i>Cell</i>
          . Read the
          {' '}
          <a
            href="https://www.nih.gov/news-events/news-releases/nih-funded-study-recruit-thousands-participants-reveal-exercise-impact-molecular-level"
            className="inline-link-with-icon"
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackEvent.bind(
              this,
              'MoTrPAC Marker Paper',
              'NIH Press Release',
              'Landing Page'
            )}
          >
            NIH press release
            <i className="material-icons external-linkout-icon">open_in_new</i>
          </a>
          {' '}
          for further information about this publication.
        </h5>
      </span>
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );

  return (
    <div className="row marketing">
      <main>
        <div className="container hero h-100">
          <div className="row hero-wrapper h-100">
            <MarkerPaperNotice />
            <div className="hero-image col-12 col-md-8 mx-auto">
              <img
                src={LogoAnimation}
                className="img-fluid"
                alt="Data Layer Runner"
              />
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
                number: {
                  value: 40,
                  density: { enable: true, value_area: 500 },
                },
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
          <button
            type="button"
            className="btn btn-dark btn-sm particle-media-control"
            onClick={playStopParticles}
            title="play|stop"
          >
            {visibility ? (
              <span className="oi oi-media-stop" />
            ) : (
              <span className="oi oi-media-play" />
            )}
          </button>
          <div className="container featurette h-100">
            <div className="row featurette-wrapper h-100">
              <div className="content col-12">
                <h3>About MoTrPAC</h3>
                <p>
                  Molecular Transducers of Physical Activity Consortium is a national
                  research consortium designed to discover and characterize the range
                  of molecular transducers (the "molecular map") that underlie the
                  effects of physical activity in humans.
                </p>
                <a
                  href="https://motrpac.org/"
                  className="btn btn-dark"
                  role="button"
                  target="_new"
                >
                  READ MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container featurette multi-omics" id="multi-omics">
          <div className="row featurette-wrapper h-100">
            <div
              className="feature-image col-12 col-md-6 mx-auto"
              onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
            >
              <animated.div
                className="animated-image-container"
                style={{ transform: xy.interpolate(trans3d) }}
              >
                <img
                  src={LayerRunner}
                  className="img-fluid data-layer-runner"
                  alt="Data Layer Runner"
                />
              </animated.div>
            </div>
            <div className="content col-12 col-md-6">
              <h3>Multi-Omics</h3>
              <p>
                MoTrPAC integrates multi-omics data (genomics, proteomics, metabolomics, and
                more) to reveal a comprehensive map of molecular transducers of physical activity.
              </p>
              <a
                href="https://motrpac.org/ancillarystudyguidelines.cfm"
                className="btn btn-primary"
                role="button"
                target="_new"
              >
                READ MORE
              </a>
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
                  Consisting of Clinical Centers, Preclinical Animal Study
                  Sites, Chemical Analysis Sites, Bioinformatics
                  Center, Consortium Coordinating Center.
                </p>
                <a
                  href="https://commonfund.nih.gov/MolecularTransducers/overview#ClinicalCenter"
                  className="btn btn-success"
                  role="button"
                  target="_new"
                >
                  READ MORE
                </a>
              </div>
              <div className="feature-image col-12 col-md-6 mx-auto">
                <img
                  src={HealthyHeart}
                  className="img-fluid"
                  alt="Healthy Heart"
                />
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

const mapStateToProps = (state) => ({
  ...state.auth,
});

export default connect(mapStateToProps)(LandingPage);
