import React from 'react';
import { withRouter } from 'react-router-dom';

function Callback(props) {
  props.auth.handleAuthentication().then(() => {
    props.history.push('/dashboard');
  });

  return (
    <div className="authLoading">
      <span className="oi oi-shield" />
      <h3>Authenticating...</h3>
    </div>
  );
}

export default withRouter(Callback);
