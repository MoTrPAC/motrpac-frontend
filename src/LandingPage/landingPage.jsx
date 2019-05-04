import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Particles from 'react-particles-js';
import LogoAnimation from '../assets/LandingPageGraphics/LogoAnimation_03082019-yellow_pipelineball_left.gif';
import LayerRunner from '../assets/LandingPageGraphics/Data_Layer_Runner.png';
import HealthyHeart from '../assets/LandingPageGraphics/Infographic_Healthy_Heart.png';

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

  if (isAuthenticated && hasAccess) {
    return <Redirect to="/dashboard" />;
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

  return (
    <div className="row marketing">
      <main>
        <div className="container hero h-100">
          <div className="row hero-wrapper h-100">
            <div className="hero-image col-12 col-md-8 mx-auto">
              <img src={LogoAnimation} className="img-fluid" alt="Data Layer Runner" />
            </div>
            <div className="content col-12 col-md-4 motrpac-tag-line">
              <h3>
                <em>Understanding</em>
                at the molecular level how activity makes us healthier
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
          <button type="button" className="btn btn-dark btn-sm particle-media-control" onClick={playStopParticles}>
            {visibility ? <span className="oi oi-media-stop" /> : <span className="oi oi-media-play" />}
          </button>
          <div className="container featurette h-100">
            <div className="row featurette-wrapper h-100">
              <div className="content col-12">
                <h3>About MoTrPAC</h3>
                <p>
                  Molecular Transducers of Physical Activity Consortium is a national
                  research consortium designed to discover and perform preliminary
                  characterization of the range of molecular transducers
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
            <div className="feature-image col-12 col-md-6 mx-auto">
              <img src={LayerRunner} className="img-fluid" alt="Data Layer Runner" />
            </div>
            <div className="content col-12 col-md-6">
              <h3>Multi-Omics</h3>
              <p>
                MoTrPAC encourages investigators to develop ancillary studies (AS) in
                conjunction with the MoTrPAC study and to involve other investigators, within
                and outside of MoTrPAC.
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
              Data generated to date is not yet publicly accessible. For updates when publicly
              accessible data are available, please contact us at&nbsp;
              <a href="mailto:motrpac-data-requests@lists.stanford.edu" target="_new">motrpac-data-requests@lists.stanford.edu</a>
            </div>
            <div className="p-2 col-12 col-md-6 upload-data-info">
              <h5>Uploading Data From Study Sites:</h5>
              If you are a member of one of the sites involved with MoTrPAC, please log in using
              your provided ID at the link on the bottom right of this website. If you have issues
              logging in, please contact the bioinformatic center helpdesk at&nbsp;
              <a href="mailto:motrpac-helpdesk@lists.stanford.edu" target="_new">motrpac-helpdesk@lists.stanford.edu</a>
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
