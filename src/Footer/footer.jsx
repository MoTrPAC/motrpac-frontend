import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions from '../Auth/authActions';
import LoginButton from '../lib/loginButton';
import MoTrPAClogo from '../assets/logo-motrpac.png';

/**
 * Renders the global footer.
 *
 * @param {Boolean}   isAuthenticated Redux state for user's authentication status.
 * @param {Object}    profile         Redux state for authenticated user's info.
 * @param {Function}  login           Redux action for user login.
 *
 * @returns {object} JSX representation of the global footer.
 */
export function Footer({
  isAuthenticated,
  profile,
  login,
  logout,
}) {
  // Function to get current copyright year
  const getCopyrightYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    return year;
  };

  const handleLogout = () => {
    logout();
    return <Redirect to="/" />;
  };

  const LogoutButton = () => {
    if (isAuthenticated) {
      return (
          <button type="button" onClick={handleLogout} className="logOutBtn btn btn-primary">
            Log out
          </button>
      );
    }
  };

  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;

  // TODO: Find out how to best do error handling
  return (
    <footer className="footer">
      {!(isAuthenticated && hasAccess) && (
        <div className="container footer-nav">
          <div className="row align-items-end">
            <div className="col-12 col-lg-4 footer-nav-logo">
              <a href="/" className="navbar-brand footer-logo">
                <img default src={MoTrPAClogo} alt="MoTrPAC Data Hub" />
              </a>
            </div>
            <div className="col-12 col-lg-8 row justify-content-end footer-nav-items">
              <ul className="nav">
                <li className="nav-item navItem"><a href="/" className="nav-link">Home</a></li>
                <li className="nav-item navItem"><a href="/team" className="nav-link">About Us</a></li>
                <li className="nav-item navItem"><a href="/contact" className="nav-link">Contact Us</a></li>
                {(isAuthenticated && !hasAccess) ?
                  (<li className="nav-item navItem">
                    <LogoutButton />
                  </li>) :
                  (<li className="nav-item navItem">
                    <LoginButton login={login} />
                  </li>)
                }
              </ul>
            </div>
          </div>
        </div>
      )}
      <div className="footer-disclaimers">
        <div className="footer-content">
          <span>
            MoTrPAC Data Hub is designed and maintained by the MoTrPAC BioInformatics
            Center at&nbsp;
            <a href="https://www.stanford.edu/" target="_blank" rel="noopener noreferrer">
              Stanford University
            </a>
            <span>.&nbsp;</span>
          </span>
          <span>
            Funded by the&nbsp;
            <a href="https://commonfund.nih.gov/" target="_blank" rel="noopener noreferrer">
              NIH Common Fund
            </a>
            <span>.</span>
          </span>
        </div>
        <div className="footer-content">
          &#169;
          {getCopyrightYear()}
          &nbsp;Stanford University
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

Footer.defaultProps = {
  profile: {},
  isAuthenticated: false,
  login: null,
  logout: null,
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
