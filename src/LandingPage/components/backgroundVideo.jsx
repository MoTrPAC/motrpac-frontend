import React from 'react';

const videoMoleculeNetwork = 'https://cdn.motrpac-data.org/assets/datahub/landing_page/media/background_video_molecules_221511488.mp4';

function BackgroundVideo() {
  return (
    <video className="fullscreen" autoPlay muted loop playsInline>
      <source src={videoMoleculeNetwork} type="video/mp4" />
    </video>
  );
}

export default BackgroundVideo;
