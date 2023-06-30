import React from 'react';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

// Function to render landing page announcement
function AnnouncementBanner() {
  return (
    <div className="announcement-banner w-100 px-3 py-3">
      <div className="announcement-banner-content">
        <div className="mb-1 font-weight-bold primary">
          <a
            href="https://www.biorxiv.org/content/10.1101/2022.09.21.508770v1"
            className="inline-link-with-icon"
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackEvent.bind(
              this,
              'MoTrPAC Landscape Preprint',
              'bioRxiv',
              'Landing Page'
            )}
          >
            The MoTrPAC Endurance Exercise Training Animal Study Landscape
            preprint
            <i className="material-icons external-linkout-icon">open_in_new</i>
          </a>{' '}
          is now online at bioRxiv.
        </div>
        <div className="secondary">
          Read about the{' '}
          <a
            href="https://motrpac.github.io/MotrpacRatTraining6moData/"
            className="inline-link-with-icon"
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackEvent.bind(
              this,
              'MoTrPAC Landscape Preprint',
              'MotrpacRatTraining6moData',
              'Landing Page'
            )}
          >
            R package
            <i className="material-icons external-linkout-icon">open_in_new</i>
          </a>{' '}
          consisting of the processed data and downstream analysis results
          presented in this preprint.
        </div>
      </div>
    </div>
  );
}

export default AnnouncementBanner;
