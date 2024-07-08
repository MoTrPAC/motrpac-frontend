import React from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';
import PageTitle from '../lib/ui/pageTitle';
import '@styles/announcementsPage.scss';

import announcementData from './announcements';
// Pre-sort array in reverse order to workaround Storybook issue
const announcements = announcementData.reverse();

/**
 * Renders the Announcements page in both
 * unauthenticated and authenticated states.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Boolean} expanded        Redux state for sidebar
 *
 * @returns {Object} JSX representation of the Announcements page.
 */
function AnnouncementsPage() {
  const pageContent = (
    <>
      <PageTitle title="Announcements" />
      <div className="news-item-list">
        {announcements.map((entry) => (
          <AnnouncementEntry entry={entry} key={entry.aid} />
        ))}
      </div>
    </>
  );

  return (
    <div className="announcementsPage px-3 px-md-4 mb-3 container">
      <div>{pageContent}</div>
    </div>
  );
}

// Render individual announcement entry
function AnnouncementEntry({ entry }) {
  return (
    <div key={entry.aid} className="d-flex announcement-item">
      <div className="announcement-item-icon">
        <i
          className={`material-icons announcement-icon ${entry.metadata.tags[0]}`}
        >
          {entry.metadata.icon}
        </i>
      </div>
      <div className="flex-grow-1">
        <div className="d-flex announcement-header">
          <h5 className="announcement-title">{entry.title}</h5>
          <div className="announcement-date">
            {dayjs(entry.posted_date).format('MMMM D, YYYY')}
          </div>
        </div>
        <p className="announcement-content">{entry.content}</p>
        {entry.links && entry.links.length ? (
          <ul className="announcement-links">
            {entry.links.map((link) => (
              <li key={link.url} className="announcement-link-item">
                {link.url.indexOf('http') > -1 ? (
                  <a
                    href={link.url}
                    className="inline-link-with-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackEvent.bind(
                      this,
                      'User Interests',
                      link.gaEventCategory.toLowerCase().split(' ').join('_'),
                      'Announcement Page',
                      link.gaEventAction,
                    )}
                  >
                    {link.label}
                    <i className="material-icons external-linkout-icon">
                      open_in_new
                    </i>
                  </a>
                ) : (
                  <Link
                    to={link.url}
                    className="inline-link inline-link-with-icon"
                  >
                    {link.label}
                    <i className="material-icons internal-link">link</i>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

const linksPropType = {
  label: PropTypes.string,
  url: PropTypes.string,
  gaEventCategory: PropTypes.string,
  gaEventAction: PropTypes.string,
};

AnnouncementEntry.propTypes = {
  entry: PropTypes.shape({
    aid: PropTypes.number.isRequired,
    posted_date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    metadata: PropTypes.shape({
      target: PropTypes.string.isRequired,
      tags: PropTypes.array.isRequired,
      icon: PropTypes.string.isRequired,
    }).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({ ...linksPropType })),
  }).isRequired,
};

export default AnnouncementsPage;
