import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export function Methods({ isAuthenticated }) {
  if (isAuthenticated) {
    return (
      <div className="container Methods">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 align-self-center">
            <h2 className="light">Coming soon!</h2>
          </div>
        </div>
      </div>
    );
  }
  return (<Redirect to="/" />);
}

Methods.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
};

Methods.defaultProps = {
  profile: {},
  isAuthenticated: false,
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Methods);
