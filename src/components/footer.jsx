import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export function Footer({
  user,
  loggedIn = false,
  onLogIn,
  onLogOut,
}) {
  function AuthButton() {
    if (loggedIn) {
      return (
        <button type="button" onClick={onLogOut} className="logInOutBtn btn">
          {user.name}
          &nbsp;Logout
        </button>
      );
    }
    return (
      <button type="button" onClick={onLogIn} className="logInOutBtn btn">
        Submitter Login
      </button>
    );
  }
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
          <div className="col-12 col-md-9">
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
          <div className="col-12 col-md-3 rightAlign">
            <AuthButton />
          </div>
        </div>
        <div className="row">
          <div className="col copyright">
            <p>
              &#169; Stanford
              &nbsp;
              {getCopyrightYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>

  );
  return footer;
}

Footer.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  onLogIn: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
};
Footer.defaultProps = {
  user: {},
  loggedIn: false,
};

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
