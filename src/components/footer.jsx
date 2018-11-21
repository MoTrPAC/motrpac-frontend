import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth0Client from './auth';

/**
 * Method to render global footer
 * @param {object} props 
 */
function Footer(props) {
  // Function to log out
  const logOut = () => {
    auth0Client.logout();
    props.history.replace('/');
  };
  
  // Function to render login button
  const LoginButton = () => {
    return (
      <span className="user-login">
        {auth0Client.isAuthenticated() ?
          <button type="button" onClick={() => {logOut()}} className="logInOutBtn btn">
            {auth0Client.getProfile().name}&nbsp;Logout
          </button>
          :
          <button type="button" onClick={auth0Client.login} className="logInOutBtn btn">
            Submitter Login
          </button>
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
              &#169;&nbsp;{getCopyrightYear()}&nbsp;Stanford University
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default withRouter(Footer);
