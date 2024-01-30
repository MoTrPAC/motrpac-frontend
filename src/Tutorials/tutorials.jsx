import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../lib/ui/pageTitle';

function Tutorials() {
  const iframeRef = useRef(null);

  return (
    <div className="tutorialsPage px-3 px-md-4 mb-3 container">
      <PageTitle title="Tutorials" />
      <div className="main-study-container">
        <div className="main-study-summary-container row mb-4">
          <div className="col-12">
            <p className="lead">
              The following tutorial video is designed to help you get started
              with the MoTrPAC study and the exploration of the Data Hub. Please
              reach out to us with any{' '}
              <Link to="/contact">questions or comments</Link>.
            </p>
          </div>
          <div
            className="embedContainer embed-responsive embed-responsive-16by9 mx-3"
            id="tutorial-video-iframe-container"
          >
            <iframe
              ref={iframeRef}
              title="Data Hub tutorial video"
              allow="autoplay"
              src="https://drive.google.com/file/d/1dYoqYmN5RVk8Spyp2c-bxP5R7WA73Zag/preview"
              className="embed-responsive-item border border-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorials;
