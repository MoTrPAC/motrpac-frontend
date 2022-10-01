import React from 'react';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

// Function to render landing page announcement
function AnnouncementBanner() {
  return (
    <div
      className="alert alert-primary alert-dismissible fade show announcement-banner d-flex align-items-center justify-content-between w-100"
      role="alert"
    >
      <span className="announcement-banner-content">
        <h5>
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
            MoTrPAC Endurance Exercise Training Animal Study Landscape preprint
            <i className="material-icons external-linkout-icon">open_in_new</i>
          </a>
          . Read about the{' '}
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
        </h5>
      </span>
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

export default AnnouncementBanner;
