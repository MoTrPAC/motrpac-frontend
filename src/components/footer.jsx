import React from 'react';
import { connect } from 'react-redux';

export function Footer({
  user,
  loggedIn = false,
  onLogIn,
  onLogOut,
}) {
  function getCopyrightYear() {
    const today = new Date();
    const year = today.getFullYear();
    return year;
  }
  // TODO: Find out how to best do error handling
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
            <p>
              &#169; XXXX
              &nbsp;
              {getCopyrightYear()}
            </p>
          </div>
          <div className="col rightAlign">
            <AuthButton loggedInStatus={loggedIn} user={user} onLogIn={onLogIn} onLogOut={onLogOut} />
          </div>
        </div>
      </div>
    </footer>

  );
  return footer;
}

function AuthButton({
  loggedInStatus,
  user,
  onLogIn,
  onLogOut,
}) {
  if (loggedInStatus) {
    return (
      <button type="button" onClick={onLogOut} className="logInOutBtn btn">
        {`${user.name} Logout`}
      </button>
    );
  }
  return (
    <button type="button" onClick={onLogIn} className="logInOutBtn btn">
      Submitter Login
    </button>
  );
}


const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
  user: state.auth.user,
});


const mapDispatchToProps = dispatch => ({
  onLogIn: () => dispatch({
    type: 'AUTHENTICATING',
  }),
  onLogOut: () => dispatch({
    type: 'LOGOUT',
  }),
});


export default connect(mapStateToProps, mapDispatchToProps)(Footer);
