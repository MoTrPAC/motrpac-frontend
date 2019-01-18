import React from 'react';
import { connect } from 'react-redux';
import logo from '../assets/MoTrPAC_horizontal.png';

export function LandingPage() {
  // TODO: Update email and email link for help requests

  return (
    <div className="container">
      <div className="row welcome">
        <div className="col-8">
          <h3 className="light">Welcome to the MoTrPAC Data Hub</h3>
        </div>
      </div>

      <div className="row Landinginfo">
        <div className="col-12 col-md-6 whatis">
          <h5 className="heavy">What is MoTrPAC?</h5>
          <p>
          MoTrPAC is a national research consortium designed to discover and perform preliminary
           characterization of the range of molecular transducers (the “molecular map”) that
           underlie the effects of physical activity in humans. The program’s goal is to study
           the molecular changes that occur during and after exercise and ultimately to advance
           the understanding of how physical activity improves and preserves health.
          </p>
          <p>
          The MoTrPAC program is supported by the NIH Common Fund and is managed by a trans-agency
           working group representing multiple NIH institutes and centers, led by the NIH Office of
           Strategic Coordination, National Institute of Arthritis and Musculoskeletal and Skin
           Diseases, National Institute of Diabetes and Digestive and Kidney Diseases, National
           Institute on Aging, and National Institute of Biomedical Imaging and Bioengineering.
          </p>
          <p>
          For more information on all the sites associated with MoTrPAC and protocols for
           data collection please visit
            <a href="https://www.motrpac.org/" target="_new"> MoTrPAC.org.</a>
          </p>
        </div>
        <div className="col-12 col-md-6">
          <div className="accessDataInfo">
            <h5 className="heavy">Accessing Data: </h5>
            <p>
              Data generated to date is not yet publicly accessible. For updates when publicly
               accessible data are available contact us at
              <a href="mailto:MoTrPAC-data-requests@xxx.xxx" target="_new"> MoTrPAC-data-requests@xxx.xxx</a>
            </p>
            <h5 className="heavy">Uploading Data From Study Sites:</h5>
            <p>
            If you are a member of one of the sites involved with MoTrPAC please log in using
             your provided ID at the link on the bottom right of this website.  If you have issues
             logging in please contact the bioinformatic center at
              <a href="mailto:MoTrPAC-helpdesk@xxx.xxx" target="_new"> MoTrPAC-helpdesk@xxx.xxx</a>
            </p>
          </div>
          <div className="logoCont">
            <img src={logo} className="img-fluid" alt="MoTrPAC Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect()(LandingPage);
