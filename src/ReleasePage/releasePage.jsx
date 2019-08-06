import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

/**
 * Renders the data release UIs
 *
 * @param {Boolean} isAuthenticated   Redux state for user's authentication status.
 *
 * @returns {object} JSX representation of data release page elements.
 */
export function ReleasePage({ isAuthenticated }) {
  // Send users back to homepage if not authenticated
  if (!isAuthenticated) {
    return (<Redirect to="/" />);
  }

  // Render advanced search form by default
  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 dataReleasePage">
      <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom page-heading">
        <div className="page-title">
          <h3>Data Releases</h3>
        </div>
      </div>
      <div className="data-release-content-container mt-3">
        <div className="adv-search-example-searches">

        </div>
      </div>
    </div>
  );
}

ReleasePage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ReleasePage);
