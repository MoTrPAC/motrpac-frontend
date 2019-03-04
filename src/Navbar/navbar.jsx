import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import actions from '../Auth/authActions';
import MoTrPAClogo from '../assets/logo-motrpac.png';

/**
 * Renders the global header nav bar.
 *
 * @param {Boolean}   isAuthenticated Redux state for user's authentication status.
 * @param {object}    profile         Redux state for authenticated user's info.
 * @param {Function}  logout          Redux action for user logout.
 *
 * @returns {Object} JSX representation of the global header nav bar.
 */
export function Navbar({
  isAuthenticated = false,
  profile,
  logout,
}) {
  const scrollFunction = () => {
    if (document.body.scrollTop >= 30 || document.documentElement.scrollTop >= 30) {
      document.querySelector('.navbar-brand').classList.add('resized');
    } else {
      document.querySelector('.navbar-brand').classList.remove('resized');
    }
  };

  const handleLogout = () => {
    logout();
    return <Redirect to="/" />;
  };

  let navContainerClasses;
  let navBrandClasses;
  if (window.location.pathname !== ('/' || '/external-links' || '/team' || '/contact')) {
    navContainerClasses = 'container-fluid header-navbar-items';
    navBrandClasses = 'navbar-brand header-logo resized';
  } else {
    navContainerClasses = 'container header-navbar-items';
    navBrandClasses = 'navbar-brand header-logo';

    window.addEventListener('scroll', scrollFunction);
  }

  // Function to render login button
  const LogoutButton = () => {
    return (
      <span>
        {isAuthenticated && (
          <span className="user-logout-button">
            <img src={profile.picture} className="user-avatar" alt="avatar" />
            <button type="button" onClick={handleLogout} className="logOutBtn btn btn-primary">
              Log out
            </button>
          </span>
        )}
      </span>
    );
  };

  const navbar = (
    <nav className="navbar navbar-expand-lg fixed-top navbar-light flex-md-nowrap p-0 shadow bg-white">
      <div className={navContainerClasses}>
        <Link to="/" className={navBrandClasses}>
          <img default src={MoTrPAClogo} alt="MoTrPAC Data Hub" />
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse flex-row-reverse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item navItem dropdown">
              <div className="nav-link dropdown-toggle" role="button" id="navbarDropdownMenuLink" data-toggle="dropdown">About Us</div>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <Link to="/external-links" className="dropdown-item">Useful Links</Link>
                <Link to="/team" className="dropdown-item">Who we are</Link>
              </div>
            </li>
            <li className="nav-item navItem"><Link to="/contact" className="nav-link">Contact Us</Link></li>
            <li className="nav-item navItem">
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
  return navbar;
}

Navbar.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    nickname: PropTypes.string,
    email: PropTypes.string,
    picture: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
  logout: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  profile: {},
  isAuthenticated: false,
};

const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(actions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
