import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import PageTitle from '../lib/ui/pageTitle';

function Tutorials() {
  return (
    <div className="tutorialsPage px-3 px-md-4 mb-3 container">
      <Helmet>
        <html lang="en" />
        <title>Tutorials - MoTrPAC Data Hub</title>
      </Helmet>
      <PageTitle title="Tutorials" />
      <div className="main-study-container">
        <div className="main-study-summary-container row mb-4">
          <div className="col-12">
            <p className="lead">
              The following tutorial video is designed to help you get started
              with the MoTrPAC study and the exploration of the Data Hub. Please
              reach out to us with any
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
          <div className="col-12 mt-5">
            <p className="lead">
              Aprenda cómo navegar por el Data Hub de MoTrPAC y explorar los
              datos de ejercicio multi-omics.
            </p>
          </div>
          <div
            className="embedContainer embed-responsive mx-3 mb-4"
            id="tutorial-video-iframe-container"
          >
            <LiteYouTubeEmbed
              id="G5zZ8r1lfvo"
              params="autoplay=0&cc_load_policy=1"
              poster="maxresdefault"
              title="Data Hub Tutorial Video (Spanish)"
              iframeClass="embed-responsive-item border border-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorials;
