import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import elasticsearch from 'elasticsearch';
import ReleaseEntry from './releaseEntry';

const client = new elasticsearch.Client({
  host: 'http://localhost:9200',
  log: 'trace',
});

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

  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000,
  }, (error) => {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });

  // Render advanced search form by default
  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 dataReleasePage">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
        <div className="page-title">
          <h3>Data Releases</h3>
        </div>
        <div className="btn-toolbar">
          <div className="btn-group">
            <Link className="browseDataBtn btn btn-sm btn-outline-primary" to="/download">Browse Data</Link>
            <Link className="advSearchBtn btn btn-sm btn-outline-primary" to="/search">Search Data</Link>
          </div>
        </div>
      </div>
      <ReleaseEntry />
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
