import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export function Methods({ isAuthenticated }) {
  if (isAuthenticated) {
    return (
      <div className="col-md-9 ml-sm-auto col-lg-10 px-4 methodsPage">
        <div className="page-title pt-3 pb-2 border-bottom">
          <h3>Methods</h3>
        </div>
        <div className="align-items-center">
          <p>
            Coming soon
          </p>
        </div>
      </div>
    );
  }
  return (<Redirect to="/" />);
}

Methods.propTypes = {
  isAuthenticated: PropTypes.bool,
};

Methods.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Methods);
