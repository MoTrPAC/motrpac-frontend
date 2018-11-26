import React from 'react';
import { Link, withRouter } from 'react-router-dom';

/**
 * Method to render dashboard view
 * @param {object} props - Properties passed from parent
 * TODO: try changing this to class component and to use 'setState' for rendering username
 */
function Dashboard(props) {
  const { authenticated } = props;

  return (
    <span className="user-login-button">
      {
        authenticated && (
          <div className="container">
            <div className="row">
              <div className="col">
                <h2 className="welcomeUser light">Welcome and hello, <span className="user-name"></span></h2>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Link className="uploadBtn btn btn-primary" to="/upload">Upload Data</Link>
              </div>
            </div>
          </div>
        )
      }
      {
        !authenticated && (
          <div className="container">
            <div className="row">
              <div className="col">
                <h2 className="light">Please log in</h2>
                <button type="button" onClick={props.auth.login} className="btn btn-primary">
                  Log in
                </button>
              </div>
            </div>
          </div>
        )
      }
    </span>
  );
}

export default withRouter(Dashboard);
