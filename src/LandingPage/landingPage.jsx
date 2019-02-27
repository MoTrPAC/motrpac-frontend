import React from 'react';
import { connect } from 'react-redux';
import Particles from 'react-particles-js';
import LogoAnimation from '../assets/LandingPageGraphics/LogoAnimation.gif';
import LayerRunner from '../assets/LandingPageGraphics/Layer_Runner_dark.png';
import HealthyHeart from '../assets/LandingPageGraphics/Infographic_Healthy_Heart.png';

export function LandingPage() {
  // TODO: Update email and email link for help requests

  return (
    <div className="marketing">
      <main>
        <div className="d-md-flex justify-content-center w-100 h-100">
          <div className="container splash d-md-flex h-100 align-items-center">
            <div className="col-md-8 motrpac-logo-animation align-self-center">
              <img src={LogoAnimation} alt="MoTrPAC Infographic" />
            </div>
            <div className="col-md-4 motrpac-tag-line align-self-center">
              <h3>
                <em>Understanding</em>
                at the molecular level how activity makes us healthier
              </h3>
            </div>
          </div>
        </div>
      </main>
      <section>
        <div className="d-md-flex justify-content-center w-100 h-100 about-motrpac" id="about-motrpac">
          <Particles
            className="position-absolute particles-wrapper"
            params={{
              particles: {
                number: { value: 100 },
                color: { value: '#000000' },
                size: { value: 4.5 },
                line_linked: { color: '#000000' },
              },
              interactivity: {
                events: {
                  onhover: { enable: true, mode: 'repulse' },
                },
              },
            }}
          />
          <div className="container featurette d-md-flex h-100 align-items-center">
            <div className="col-md-6 align-self-center">
              <h3>About MoTrPAC</h3>
              <p>
                Molecular Transducers of Physical Activity Consortium is a national
                research consortium designed to discover and perform preliminary
                characterization of the range of molecular transducers
                (the "molecular map") that underlie the effects of physical activity
                in humans.
              </p>
              <button type="button" className="btn btn-read-more-about-motrpac">READ MORE</button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="d-md-flex justify-content-center w-100 h-100 ancillary-study">
          <div className="container featurette d-md-flex h-100 align-items-center">
            <div className="col-md-6 d-md-flex justify-content-center h-100 align-items-center">
              <img src={LayerRunner} alt="Runner on data layer" />
            </div>
            <div className="col-md-6 align-self-center">
              <h3>Ancillary Study</h3>
              <p>
                MoTrPAC encourages investigators to develop ancillary studies (AS) in
                conjunction with the MoTrPAC study and to involve other investigators, within
                and outside of MoTrPAC.
              </p>
              <button type="button" className="btn btn-read-more-ancillary-study">READ MORE</button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="d-md-flex justify-content-center w-100 h-100 interrelated-components" id="interrelated-components">
          <div className="container featurette d-md-flex h-100 align-items-center">
            <div className="col-md-6 align-self-center">
              <h3>Interrelated Components</h3>
              <p>
                Consisting of Clinical Centers, Preclinical Animal Study Sites, Chemical Analysis
                Sites, Bioinformatics Center, Consortium Coordinating Center.
              </p>
              <button type="button" className="btn btn-read-more-interrelated-components">READ MORE</button>
            </div>
            <div className="col-md-6 d-md-flex justify-content-center h-100 align-items-center">
              <img src={HealthyHeart} alt="Healthy Heart" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="d-md-flex flex-md-equal w-100 data-policies">
          <div className="container featurette d-md-flex">
            <div className="p-2 col-md access-data-info">
              <h5 className="heavy">Accessing Data: </h5>
              Data generated to date is not yet publicly accessible. For updates when publicly
              accessible data are available contact us at&nbsp;
              <a href="mailto:MoTrPAC-data-requests@stanford.edu" target="_new">MoTrPAC-data-requests@stanford.edu</a>
            </div>
            <div className="p-2 col-md upload-data-info">
              <h5 className="heavy">Uploading Data From Study Sites:</h5>
              If you are a member of one of the sites involved with MoTrPAC please log in using
              your provided ID at the link on the bottom right of this website.  If you have issues
              logging in please contact the bioinformatic center at&nbsp;
              <a href="mailto:MoTrPAC-helpdesk@stanford.edu" target="_new">MoTrPAC-helpdesk@stanford.edu</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default connect()(LandingPage);
