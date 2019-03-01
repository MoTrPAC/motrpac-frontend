import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../Auth/authActions';
import MoTrPAClogo from '../assets/logo-motrpac.png';

/**
 * Renders the global footer.
 * 
 * @param {Boolean}   isAuthenticated Redux state for user's authentication status.
 * @param {Object}    profile         Redux state for authenticated user's info.
 * @param {Function}  login           Redux action for user login.
 * @param {Function}  logout          Redux action for user logout.
 * 
 * @returns {object} JSX representation of the global footer.
 */
export function Footer({
  isAuthenticated,
  profile,
  login,
  logout,
}) {
  const userGivenName = profile.user_metadata && profile.user_metadata.givenName ? profile.user_metadata.givenName : profile.name;
  const handleLogout = () => {
    logout();
    return <Redirect to="/" />;
  };
  // Function to render login button
  const LoginButton = () => {
    return (
      <span className="user-login-button">
        {isAuthenticated && (
          <span>
            <img src={profile.picture} className="user-avatar" alt="avatar" />
            <button type="button" onClick={handleLogout} className="logInOutBtn btn">
              {userGivenName}
              &nbsp;Logout
            </button>
          </span>
        )}
        {!isAuthenticated && (
          <button type="button" onClick={login} className="logInOutBtn btn btn-primary">
            Submitter Login
          </button>
        )}
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
      <div className="container footer-nav d-md-flex h-100 align-items-center">
        <Link to="/" className="navbar-brand footer-logo flex-grow-1">
          <img default src={MoTrPAClogo} alt="MoTrPAC Data Hub" />
        </Link>
        <ul className="nav justify-content-end">
          <li className="nav-item navItem"><Link to="/" className="nav-link">Home</Link></li>
          <li className="nav-item navItem"><Link to="/team" className="nav-link">About Us</Link></li>
          <li className="nav-item navItem"><Link to="/contact" className="nav-link">Contact Us</Link></li>
          <li className="nav-item navItem">
            <LoginButton />
          </li>
        </ul>
      </div>
      <div className="footer-disclaimers">
        <div className="container h-100 align-items-center">
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
      </div>
    </footer>
  );
}

Footer.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    nickname: PropTypes.string,
    email: PropTypes.string,
    picture: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

Footer.defaultProps = {
  profile: {},
  isAuthenticated: false,
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
