import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';

class Callback extends Component {
  componentDidMount() {
    const { location, handleAuthCallback } = this.props;
    // Handle authentication if expected values are in the URL.
    if (/access_token|id_token|error/.test(location.hash)) {
      handleAuthCallback();
    } else {
      throw new Error('Invalid callback URL.');
    }
  }

  render() {
    const { authError } = this.props.auth;
    const message = authError || 'Authenticating...';

    return (
      <div className="authLoading">
        <span className="oi oi-shield" />
        <h3>{message}</h3>
      </div>
    );
  }
}

export default connect(
  state => state,
  actions
)(Callback);
