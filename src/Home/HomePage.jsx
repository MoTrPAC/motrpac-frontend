import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchPageConnected from '../Search/searchPage';
import DataSummaryPageConnected from '../DataSummaryPage/dataSummaryPage';

/**
 * Returns a component.
 *
 * @param {Object} profile  Redux state of authenticated user profile
 *
 * @returns {object} JSX representation of a component
 */
export function HomePage({ profile }) {
  const userType = profile.user_metadata && profile.user_metadata.userType;

  if (userType === 'external') {
    return <DataSummaryPageConnected />;
  }

  return <SearchPageConnected />;
}

HomePage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
};

HomePage.defaultProps = {
  profile: {},
};

const mapStateToProps = (state) => ({
  ...state.auth,
});

export default connect(mapStateToProps)(HomePage);
