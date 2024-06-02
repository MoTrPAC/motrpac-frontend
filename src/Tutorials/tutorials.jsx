import React from 'react';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import PageTitle from '../lib/ui/pageTitle';

function Tutorials() {
  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      cc_load_policy: 1,
    },
  };

  return (
    <div className="tutorialsPage px-3 px-md-4 mb-3 container">
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
            className="embedContainer embed-responsive embed-responsive-16by9 mx-3"
            id="tutorial-video-iframe-container"
          >
            <YouTube
              videoId="3zHnzUMo_vw"
              opts={opts}
              onReady={onPlayerReady}
              title="Data Hub Tutorial Video"
              className="embed-video-iframe-container"
              iframeClassName="embed-responsive-item border border-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorials;
