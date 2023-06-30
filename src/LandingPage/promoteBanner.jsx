import React from 'react';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

// Function to render landing page announcement
function PromoteBanner() {
  return (
    <div className="office-hour-banner border w-100 px-3 py-4 mb-4">
      <h3 className="office-hour-title">Join Us</h3>
      <div className="office-hour-content mb-3">
        The Bioinformatics Center of MoTrPAC will be hosting the next virtual
        Office Hour on Tuesday, July 18, 2023 at 11:00 am Pacific Time.
      </div>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSekaYf_S0P1Mc_tqEW4RENvaicr5vBXgKObbeAB4VIusQlSIg/viewform"
        className="btn btn-primary"
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackEvent.bind(
          this,
          'MoTrPAC Office Hour',
          'July 18, 2023',
          'Landing Page'
        )}
      >
        SIGN UP
      </a>
    </div>
  );
}

export default PromoteBanner;
