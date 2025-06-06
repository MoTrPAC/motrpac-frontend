import React from 'react';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

// Function to render landing page announcement
function OpenOfficeHour() {
  return (
    <div className="office-hour-signup col-12 border p-5" id="join-office-hour">
      <h1 className="office-hour-title display-2">Join Us</h1>
      <div className="office-hour-content mb-4 lead">
        Come join us at the next virtual office hour on
        {' '}
        {process.env.REACT_APP_OFFICE_HOUR_DAY}
        {' '}
        {process.env.REACT_APP_OFFICE_HOUR_DATE}
        {' '}
        at 11:00 am Pacific Time and learn more about our data.
      </div>
      <a
        href={process.env.REACT_APP_OFFICE_HOUR_SIGNUP_URL}
        className="btn btn-dark btn-lg"
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackEvent.bind(
          this,
          'User Engagement',
          'open_office_hour',
          'Landing Page',
          process.env.REACT_APP_OFFICE_HOUR_DATE,
        )}
      >
        SIGN UP
      </a>
    </div>
  );
}

export default OpenOfficeHour;
