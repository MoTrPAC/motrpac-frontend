import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import PageTitle from '../lib/ui/pageTitle';
import ExternalLink from '../lib/ui/externalLink';

import '@styles/license.scss';

function Tutorials() {
  return (
    <div className="tutorialsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Tutorials - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Tutorials" />
      <div className="tutorials-content-container">
        <div className="tutorials-summary-container row mb-4">
          <div className="col-12">
            <h3 className="mt-4">MoTrPAC Data Hub Overview</h3>
            <p className="lead">
              The following tutorial video (also available in Spanish) is designed
              to help you get started with the MoTrPAC study and the exploration
              of the Data Hub. Please check out our{' '}
              <ExternalLink
                to="https://www.youtube.com/@MoTrPAC-Data-Hub"
                label="collection of videos on YouTube"
              />
              {' '}
              and reach out to us with any
              {' '}
              <Link to="/contact">questions or comments</Link>
              .
            </p>
          </div>
          <div
            className="embedContainer embed-responsive mx-3"
            id="tutorial-video-iframe-container"
          >
            <LiteYouTubeEmbed
              id="3zHnzUMo_vw"
              params="autoplay=0&cc_load_policy=1"
              poster="maxresdefault"
              title="Data Hub Tutorial Video"
              iframeClass="embed-responsive-item border border-dark"
            />
          </div>
          <div className="col-12 mt-4">
            <h3 className="mt-4">MoTrPAC R packages</h3>
            <p className="lead">
              <ExternalLink
                to="https://motrpac.github.io/MotrpacWorkshops/docs/articles/rat-endurance-6m.html"
                label="MoTrPAC R Packages from the Endurance Training in Young Rats Study"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorials;
