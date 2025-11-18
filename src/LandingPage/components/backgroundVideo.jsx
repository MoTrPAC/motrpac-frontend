import React from 'react';

const videoMoleculeNetwork =
  'https://d1yw74buhe0ts0.cloudfront.net/static/motrpac-data-hub/landing_page/media/background_video_molecules_221511488.mp4';

function BackgroundVideo() {
  return (
    <video className="fullscreen" autoPlay muted loop playsInline>
      <source src={videoMoleculeNetwork} type="video/mp4" />
    </video>
  );
}

export default BackgroundVideo;
