import React from 'react';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

// Function to render landing page announcement
function PromoteBanner() {
  return (
    <div className="promote-banner d-flex align-items-center justify-content-center w-100 text-light p-2">
      <span>
        The Bioinformatics Center of MoTrPAC will be hosting a virtual Office
        Hour on Thursday, June 22, 2023 at 11:00 am Pacific Time.
      </span>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSf2X3PEzEibaPnxo2mSwPwV0Rc74dzoqZVtYwLssLSmo3DypQ/viewform"
        className="btn btn-light btn-sm ml-2"
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackEvent.bind(
          this,
          'MoTrPAC Office Hour',
          'June 22, 2023',
          'Landing Page'
        )}
      >
        Sign up
      </a>
    </div>
  );
}

export default PromoteBanner;
