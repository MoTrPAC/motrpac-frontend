import React from 'react';
import { Link, withRouter } from 'react-router-dom';

/**
 * Method to render global footer
 * @param {object} props - Properties passed from parent
 * TODO: try changing this to class component and to use 'setState' for user profile UI rendering
 */
function Footer(props) {
  const { authenticated } = props;

  // Function to sign out
  const logout = () => {
    props.auth.logout();
    props.history.push('/');
  };
  
  // Function to render login button
  // FIXME: removing `props.auth.getProfile()` method from <button> breaks the UI
  const LoginButton = () => {
    return (
      <span className="user-login-button">
        {
          authenticated && (
            <span>
              <img className="user-avatar" alt="avatar" />
              <button type="button" onClick={logout} className="logInOutBtn btn">
                {props.auth.getProfile()}
                &nbsp;Log out
              </button>
            </span>
          )
        }
        {
          !authenticated && (
            <button type="button" onClick={props.auth.login} className="logInOutBtn btn">
              Submitter Log in
            </button>
          )
        }
      </span>
    );
  };

  // Function to get current copyright year
  const getCopyrightYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    return year;
  };

  // TODO: Find out how to best do error handling
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-9">
            <p className="footer-content">
              Data Hub designed and maintained by the MoTrPAC BioInformatics Center at
              <Link to="https://www.stanford.edu/" target="_new"> Stanford University</Link>
            </p>
            <p className="footer-content">
              Funded by the
              <Link to="https://commonfund.nih.gov/" target="_new"> NIH Common Fund</Link>
            </p>
          </div>
          <div className="col user-login">
            <LoginButton />
          </div>
        </div>
        <div className="row">
          <div className="col copyright">
            <p className="footer-content">
              &#169;&nbsp;
              {getCopyrightYear()}
              &nbsp;Stanford University
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default withRouter(Footer);
