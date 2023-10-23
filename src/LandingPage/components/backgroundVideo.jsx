import React from 'react';
import VideoMoleculeNetwork from '../../assets/LandingPageGraphics/background_video_molecules_221511488.mp4';

function BackgroundVideo() {
  return (
    <video className="fullscreen" autoPlay muted loop>
      <source src={VideoMoleculeNetwork} type="video/mp4" />
    </video>
  );
}

export default BackgroundVideo;
