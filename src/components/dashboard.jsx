import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export function Dashboard({ user }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <br />
          <h2 className="light">{`Welcome ${user.name} at ${user.siteName}`}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <a className="uploadBtn btn btn-primary" href="/upload">Upload Data</a>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

// Fill dispatch to props once actions implemented
// const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps)(Dashboard);
