import React, { useEffect } from 'react';
import gtag from 'ga-gtag';

const trackingId = () => {
  // available tracking Ids for motrpac apps
  const trackers = {
    'dev.motrpac-data.org': 'UA-137588878-5',
    'test.motrpac-data.org': 'UA-137588878-4',
    'alpha.motrpac-data.org': 'UA-137588878-2',
    'beta.motrpac-data.org': 'UA-137588878-3',
    'www.motrpac-data.org': 'UA-137588878-1',
  };

  //  determine current hostname
  let analyticsTrackerHostname = document.location.hostname;

  // match hostname to google analytics domain identified for tracker
  if (/^(www\.)?motrpac(-[a-z]+)?.org/.test(analyticsTrackerHostname)) {
    // production app
    analyticsTrackerHostname = 'www.motrpac-data.org';
  } else if (/^beta.motrpac(-[a-z]+)?.org/.test(analyticsTrackerHostname)) {
    // beta app
    analyticsTrackerHostname = 'beta.motrpac-data.org';
  } else if (/^alpha.motrpac(-[a-z]+)?.org/.test(analyticsTrackerHostname)) {
    // alpha app
    analyticsTrackerHostname = 'alpha.motrpac-data.org';
  } else if (/^test.motrpac(-[a-z]+)?.org/.test(analyticsTrackerHostname)) {
    // test app
    analyticsTrackerHostname = 'test.motrpac-data.org';
  } else {
    // catch-all
    analyticsTrackerHostname = 'dev.motrpac-data.org';
  }

  // use correct tracking Id based on hostname
  const tracker = trackers[analyticsTrackerHostname];

  return tracker;
};

export const withTracker = (WrappedComponent) => {
  const trackPage = (page) => {
    gtag('config', trackingId(), {'page_path': page, 'site_speed_sample_rate' : 100});
  };

  const HOC = (props) => {
    const { location } = props;
    useEffect(() => trackPage(location.pathname), [
      location.pathname,
    ]);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export const trackEvent = (category, action, label) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
  });
};

export default trackingId;
