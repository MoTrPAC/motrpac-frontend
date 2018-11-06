import React from 'react';
import PropTypes from 'prop-types';

function Footer({ user, loggedIn }) {
  let logoutBtn;
  if (loggedIn) {
    logoutBtn = (
      <button type="button" className="logInOutBtn btn">
        {`${user.name} Logout`}
      </button>
    );
  }
  const loginBtn = (

    <button type="button" className="logInOutBtn btn">
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
