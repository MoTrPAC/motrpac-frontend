import React from 'react';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

// Function to render landing page announcement
function PromoteBanner() {
  return (
    <div className="office-hour-banner border w-100 px-3 py-4 mb-4">
      <h3 className="office-hour-title">Join Us</h3>
      <div className="office-hour-content mb-3">
        The Bioinformatics Center of MoTrPAC will be hosting the next virtual
        Office Hour on Tuesday, September 26, 2023 at 11:00 am Pacific Time.
      </div>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeY2lHGlbfLXhHT0aedNs98ORK4rc8FBhhXKE0nrW6vtSCqJA/viewform"
        className="btn btn-primary"
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackEvent.bind(
          this,
          'User Engagement',
          'open_office_hour',
          'Landing Page',
          'September 26, 2023',
        )}
      >
        SIGN UP
      </a>
    </div>
  );
}

export default PromoteBanner;
