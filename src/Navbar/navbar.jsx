import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import MoTrPAClogo from '../assets/logo-motrpac.png';

/**
 * Renders the global header nav bar.
 * 
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * 
 * @returns {Object} JSX representation of the global header nav bar.
 */
export function Navbar({ isAuthenticated = false }) {
  const scrollFunction = () => {
    if (document.body.scrollTop >= 30 || document.documentElement.scrollTop >= 30) {
      document.querySelector('.navbar-brand').classList.add('resized');
    } else {
      document.querySelector('.navbar-brand').classList.remove('resized');
    }
  }

  window.addEventListener('scroll', scrollFunction);

  const loggedInNavItems = (
    <React.Fragment>
      <li className="nav-item navItem"><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
      <li className="nav-item navItem dropdown">
        <div className="nav-link dropdown-toggle" role="button" id="navbarDropdownMenuLinkAnalysis" data-toggle="dropdown">Analysis</div>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLinkAnalysis">
          <Link to="/analysis/animal" className="dropdown-item">Animal</Link>
          <Link to="/analysis/human" className="dropdown-item">Human</Link>
        </div>
      </li>
      <li className="nav-item navItem"><Link to="/methods" className="nav-link">Methods</Link></li>
      <li className="nav-item navItem dropdown">
        <div className="nav-link dropdown-toggle" role="button" id="navbarDropdownMenuLinkData" data-toggle="dropdown">Data</div>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLinkData">
          <Link to="/download" className="dropdown-item">Download/View Data</Link>
          <Link to="/upload" className="dropdown-item">Upload Data</Link>
        </div>
      </li>
    </React.Fragment>
  );
  const navbar = (
    <nav className="navbar navbar-expand-lg fixed-top navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand header-logo">
          <img default src={MoTrPAClogo} alt="MoTrPAC Data Hub" />
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse flex-row-reverse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            {isAuthenticated && loggedInNavItems}
            <li className="nav-item navItem dropdown">
              <div className="nav-link dropdown-toggle" role="button" id="navbarDropdownMenuLink" data-toggle="dropdown">About Us</div>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <Link to="/external-links" className="dropdown-item">Useful Links</Link>
                <Link to="/team" className="dropdown-item">Who we are</Link>
              </div>
            </li>
            <li className="nav-item navItem"><Link to="/contact" className="nav-link">Contact Us</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
  return navbar;
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// Fill dispatch to props once actions implemented
// const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps)(Navbar);
