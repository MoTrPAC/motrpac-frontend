import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import ExternalLink from '../lib/ui/externalLink';

const announcements = require('./announcements');

/**
 * Renders the Announcements page in both
 * unauthenticated and authenticated states.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 *
 * @returns {Object} JSX representation of the Announcements page.
 */
export function AnnouncementsPage({ isAuthenticated }) {
  return (
    <div className={`col-md-9 ${isAuthenticated ? 'ml-sm-auto' : ''} col-lg-10 px-4 announcementsPage`}>
      <div className={`${!isAuthenticated ? 'container' : ''}`}>
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>Announcements</h3>
        </div>
        <div className="news-item-list">
          {
            announcements.reverse().map((entry) => <AnnouncementEntry entry={entry} />)
          }
        </div>
      </div>
    </div>
  );
}

// Render individual announcement entry
function AnnouncementEntry({ entry }) {
  return (
    <div key={entry.aid} className="d-flex align-items-start justify-content-start announcement-item">
      <div className="announcement-item-icon">
        <i className={`material-icons announcement-icon ${entry.metadata.tags[0]}`}>{entry.metadata.icon}</i>
      </div>
      <div className="flex-grow-1">
        <div className="d-flex align-items-center justify-content-between announcement-header">
          <h5 className="announcement-title">{entry.title}</h5>
          <div className="announcement-date">{dayjs(entry.posted_date).format('MMMM D, YYYY')}</div>
        </div>
        <p className="announcement-content">{entry.content}</p>
        {entry.links && entry.links.length
          ? (
            <ul className="announcement-links">
              {entry.links.map((link) => (
                <li key={link.url} className="announcement-link-item">
                  {
                    link.url.indexOf('http') > -1 ? (
                      <ExternalLink to={link.url} label={link.label} />
                    ) : (
                      <Link to={link.url} className="inline-link inline-link-with-icon">
                        {link.label}
                        <i className="material-icons internal-link">link</i>
                      </Link>
                    )
                  }
                </li>
              ))}
            </ul>
          )
          : null}
      </div>
    </div>
  );
}

const linksPropType = {
  label: PropTypes.string,
  url: PropTypes.string,
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

AnnouncementsPage.propTypes = {
  isAuthenticated: PropTypes.bool,
};

AnnouncementsPage.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(AnnouncementsPage);
