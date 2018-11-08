import React from 'react';
import { action } from '@storybook/addon-actions';

function Footer({ user, loggedIn = false, handleLogInOut = action('Logging In/Out') }) {
  let logoutBtn;
  // TODO: Find out how to best do error handling

  // Throws error if there is a user passed, and not logged in
  if (user && !loggedIn) {
    Error('User exists, but not loggedin in');
  }
  if (loggedIn) {
    // Throws error if loggedIn and no user
    if (!user) {
      Error('Logged in with no user');
    }

    logoutBtn = (
      <button type="button" onClick={() => handleLogInOut(loggedIn)} className="logInOutBtn btn">
        {`${user.name} Logout`}
      </button>
    );
  }
  const loginBtn = (

    <button type="button" onClick={() => handleLogInOut(loggedIn)} className="logInOutBtn btn">
      Submitter Login
    </button>
  );
  const footer = (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <p>
              Data Hub designed and maintained by the MoTrPAC
              BioInformatics Center at
              <a href="https://www.stanford.edu/" target="_new"> Stanford University</a>
            </p>
            <p>
              Funded by the
              <a href="https://commonfund.nih.gov/" target="_new"> NIH Common Fund</a>
            </p>
          </div>
          <div className="col copyright">
            <p>&#169; XXXX 2018</p>
          </div>
          <div className="col rightAlign">
            {loggedIn ? logoutBtn : loginBtn}
          </div>
        </div>
      </div>
    </footer>

  );
  return footer;
}

export default Footer;
