import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import Particles from 'react-particles-js';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';
import LogoAnimation from '../assets/LandingPageGraphics/LogoAnimation_03082019-yellow_pipelineball_left.gif';
import LayerRunner from '../assets/LandingPageGraphics/Data_Layer_Runner.png';
import HealthyHeart from '../assets/LandingPageGraphics/Infographic_Healthy_Heart.png';
import ContactHelpdesk from '../lib/ui/contactHelpdesk';
import onVisibilityChange from '../lib/utils/pageVisibility';
import AnnouncementBanner from './announcementBanner';
import ExternalLink from '../lib/ui/externalLink';

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

  // Redirect authenticated users to protected route
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  if (isAuthenticated && hasAccess) {
    return <Redirect to="/search" />;
  }

  // Play or stop the particles animation
  function playStopParticles() {
    setVisibility(!visibility);
  }

  return (
    <div className="row marketing">
      <main>
        <div className="container hero h-100">
          <div className="row hero-wrapper h-100">
            <AnnouncementBanner />
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
                  speed: 3,
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
                  <ExternalLink
                    to="https://motrpac.org/"
                    label="Molecular Transducers of Physical Activity Consortium"
                  />{' '}
                  is a national research consortium. Its goal is to{' '}
                  <span className="font-italic about-motrpac-emphasis">
                    study the molecular changes that occur during and after
                    exercise,
                  </span>{' '}
                  and ultimately to advance the understanding of how physical
                  activity improves and preserves health. We aim to generate a
                  molecular map of the effects of exercise and training.
                </p>
                <Link
                  to="/project-overview"
                  className="btn btn-dark"
                  role="button"
                >
                  PROJECT OVERVIEW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container featurette multi-omics" id="multi-omics">
          <div className="row featurette-wrapper h-100">
            <div className="feature-image col-12 col-md-6 mx-auto">
              <img
                src={LayerRunner}
                className="img-fluid data-layer-runner"
                alt="Data Layer Runner"
              />
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
                  href="https://commonfund.nih.gov/MolecularTransducers#ClinicalCenter"
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
              <h4>Data Access</h4>
              The MoTrPAC{' '}
              <Link to="/data-download">
                Endurance Exercise Training Animal Study data
              </Link>{' '}
              is now available to the public. This is in addition to the Limited
              Acute Exercise data made available to the public in a prior
              release. Please agree to the data use agreement and register for
              an account on the <Link to="/data-access">Data Access</Link> page
              if you are interested in obtaining access to the Limited Acute
              Exercise data. For updates when subsequent publicly accessible
              data become available, please <ContactHelpdesk />
            </div>
            <div className="p-2 col-12 col-md-6 upload-data-info">
              <h4>Study Data Submission</h4>
              If you are a member of one of the sites involved with MoTrPAC,
              please <ContactHelpdesk /> about obtaining access to our cloud
              storage and data submission guidelines.
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
