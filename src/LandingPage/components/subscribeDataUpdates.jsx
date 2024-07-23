import React from 'react';
import { trackEvent } from '../../GoogleAnalytics/googleAnalytics';

// Function to render landing page announcement
function SubscribeDataUpdates() {
  return (
    <div className="data-update-signup col-12 mb-4">
      <h1 className="data-updates-signup-title display-3">Subscribe to our data updates</h1>
      <div className="data-updates-signup-content mb-4 lead">
        Stay in the know about the latest data releases and available resources from the
        MoTrPAC Data Hub.
      </div>
      <a
        href={import.meta.env.REACT_APP_DATA_UPDATES_SIGNUP_URL}
        className="btn btn-primary btn-lg"
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackEvent.bind(
          this,
          'User Engagement',
          'subscribe_data_updates',
          'Landing Page',
          'Data updates signup',
        )}
      >
        SUBSCRIBE
      </a>
    </div>
  );
}

export default SubscribeDataUpdates;
