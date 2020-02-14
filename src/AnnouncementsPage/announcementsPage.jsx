import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ExternalLink from '../lib/ui/externalLink';

/**
 * Renders the External Links page in both
 * unauthenticated and authenticated states.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 *
 * @returns {Object} JSX representation of the External Links page.
 */
export function NewsPage({ isAuthenticated }) {
  return (
    <div className={`col-md-9 ${isAuthenticated ? 'ml-sm-auto' : ''} col-lg-10 px-4 announcementsPage`}>
      <div className={`${!isAuthenticated ? 'container' : ''}`}>
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>Announcements</h3>
        </div>
        <div className="news-item-list">
          {/* item-1 */}
          <div className="d-flex align-items-start justify-content-start announcement-item">
            <div className="announcement-item-icon">
              <i className="material-icons announcement-icon webinar">movie</i>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center justify-content-between announcement-header">
                <h5 className="announcement-title">Webinar regarding NIH funding opportunity announcement</h5>
                <div className="announcement-date">February 14, 2020</div>
              </div>
              <p className="announcement-content">
                The Common Fund Molecular Transducers of Physical Activity (MoTrPAC) Program,
                through its MoTrPAC Bioinformatics Center (BIC) conducted a Pre-Application
                Webinar regarding a current
                {' '}
                <ExternalLink to="https://grants.nih.gov/grants/guide/rfa-files/RFA-RM-20-009.html" label="Funding Opportunity Announcement" />
                {' '}
                (FOA) RFA-RM-20-009 on February 13, 2020. The webinar provided background
                information on MoTrPAC data that is available to the research community
                through its data hub. The
                {' '}
                <Link to="/announcements" className="inline-link">presentation slides</Link>
                {' '}
                and
                {' '}
                <Link to="/announcements" className="inline-link">recorded webinar</Link>
                {' '}
                are now available.
              </p>
            </div>
          </div>
          {/* item-2 */}
          <div className="d-flex align-items-start justify-content-start announcement-item">
            <div className="announcement-item-icon">
              <i className="material-icons announcement-icon control-data">announcement</i>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center justify-content-between announcement-header">
                <h5 className="announcement-title">Known issues with initial dataset</h5>
                <div className="announcement-date">February 12, 2020</div>
              </div>
              <p className="announcement-content">
                The currently available animal dataset (Release 1.0) is not final. Specifically, data
                from more tissues will be added; and the current control dataset is limited in its
                coverage of fasting times and sacrifice time of day, which can confound the results
                when comparing to the exercised rats. Additional data will be made available in
                future releases.
              </p>
            </div>
          </div>
          {/* item-3 */}
          <div className="d-flex align-items-start justify-content-start announcement-item">
            <div className="announcement-item-icon">
              <i className="material-icons announcement-icon data-release">whatshot</i>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center justify-content-between announcement-header">
                <h5 className="announcement-title">MoTrPAC data release 1.0 is here!</h5>
                <div className="announcement-date">October 16, 2019</div>
              </div>
              <p className="announcement-content">
                The initial MoTrPAC dataset has become available to the community. There is data from 5
                different tissues following an acute exercise bout in rats. Visit our
                {' '}
                <Link to="/data-access" className="inline-link">Data Access</Link>
                {' '}
                page to learn more and register for access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

NewsPage.propTypes = {
  isAuthenticated: PropTypes.bool,
};

NewsPage.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(NewsPage);
