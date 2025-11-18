import React, { useEffect } from 'react';
import gtag from 'ga-gtag';
import { Outlet, useLocation } from 'react-router-dom';

const trackingId = () => {
  // available tracking Ids for motrpac apps
  const trackers = {
    'dev.motrpac-data.org': 'G-7BNN8B1GLP',
    'www.motrpac-data.org': 'G-KC38NC4JGY',
  };

  //  determine current hostname
  let analyticsTrackerHostname = document.location.hostname;

  // match hostname to google analytics domain identified for tracker
  if (/^(www\.)?motrpac(-[a-z]+)?.org$/.test(analyticsTrackerHostname)) {
    // production app
    analyticsTrackerHostname = 'www.motrpac-data.org';
  } else {
    // catch-all
    analyticsTrackerHostname = 'dev.motrpac-data.org';
  }

  // use correct tracking Id based on hostname
  return trackers[analyticsTrackerHostname];
};

export const PageTracker = () => {
  const location = useLocation();

  const trackPage = (page) => {
    gtag('config', trackingId(), {
      page_path: page,
      site_speed_sample_rate: 100,
    });
  };

  useEffect(() => {
    if (location && location.pathname) trackPage(location.pathname);
  }, [location]);

  return <Outlet />;
};

export const trackEvent = (category, action, label, target) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    event_target: target,
  });
};

export default trackingId;
