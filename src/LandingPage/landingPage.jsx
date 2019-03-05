import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Particles from 'react-particles-js';

export function LandingPage({ isAuthenticated = false }) {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="row marketing">
      <main>
        <div className="container hero h-100">
          <div className="row motrpac-tag-line h-100">
            <h3>
              <em>Understanding</em>
              at the molecular level how activity makes us healthier
            </h3>
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
                number: { value: 90, density: { enable: true, value_area: 500 } },
                color: { value: '#000000' },
                size: { value: 4.5 },
                line_linked: { color: '#000000' },
                move: { speed: 7 },
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
          <div className="container featurette h-100">
            <div className="row featurette-wrapper h-100">
              <div className="content">
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
            <div className="content">
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
              <div className="content">
                <h3>Interrelated Components</h3>
                <p>
                  Consisting of Clinical Centers, Preclinical Animal Study Sites, Chemical Analysis
                  Sites, Bioinformatics Center, Consortium Coordinating Center.
                </p>
                <a href="https://commonfund.nih.gov/MolecularTransducers/overview#ClinicalCenter" className="btn btn-success" role="button" target="_new">READ MORE</a>
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
              accessible data are available contact us at&nbsp;
              <a href="mailto:MoTrPAC-data-requests@stanford.edu" target="_new">MoTrPAC-data-requests@stanford.edu</a>
            </div>
            <div className="p-2 col-12 col-md-6 upload-data-info">
              <h5>Uploading Data From Study Sites:</h5>
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

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(LandingPage);
