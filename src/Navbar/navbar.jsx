import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import actions from '../Auth/authActions';
import LoginButton from '../lib/loginButton';
import QuickSearchBox from '../Search/quickSearchBox';
import MoTrPAClogo from '../assets/logo-motrpac.png';
import QuickSearchBoxActions from '../Search/quickSearchBoxActions';
import SearchActions from '../Search/searchActions';

/**
 * Renders the global header nav bar.
 *
 * @param {Boolean}   isAuthenticated Redux state for user's authentication status.
 * @param {Object}    profile         Redux state for authenticated user's info.
 * @param {Function}  login           Redux action for user login.
 * @param {Function}  logout          Redux action for user logout.
 *
 * @returns {Object} JSX representation of the global header nav bar.
 */
export function Navbar({
  isAuthenticated,
  profile,
  login,
  logout,
  quickSearchTerm,
  handleQuickSearchInputChange,
  handleQuickSearchRequestSubmit,
  resetQuickSearch,
  getSearchForm,
  resetAdvSearch,
}) {
  const handleLogout = () => {
    logout();
    // FIXME: Redirect to landing page not working
    return <Redirect to="/" />;
  };

  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;

  if (isAuthenticated && hasAccess) {
    document.querySelector('body').classList.add('authenticated');
  }

  // Function to render login button
  const LogoutButton = () => {
    const userDisplayName = profile.user_metadata && profile.user_metadata.name
      ? profile.user_metadata.name : profile.name;
    const siteName = profile.user_metadata && profile.user_metadata.siteName
      ? `, ${profile.user_metadata.siteName}` : '';

    if (isAuthenticated && hasAccess) {
      return (
        <span className="user-logout-button">
          <img src={profile.picture} className="user-avatar" alt="avatar" />
          <span className="user-display-name">
            {userDisplayName}
            {siteName}
          </span>
          <button type="button" onClick={handleLogout} className="logOutBtn btn btn-primary">
            Log out
          </button>
        </span>
      );
    }

    return <LoginButton login={login} />;
  };

  const navbar = (
    <div className="header-navbar-container fixed-top">
      <nav className="navbar navbar-expand-lg navbar-light flex-md-nowrap p-0 shadow-sm bg-white">
        <div className={`${isAuthenticated && hasAccess ? 'container-fluid' : 'container'} header-navbar-items`}>
          <Link to="/" className={`navbar-brand header-logo ${isAuthenticated && hasAccess ? 'resized' : ''}`}>
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
                  <Link to="/contact" className="dropdown-item">Contact Us</Link>
                </div>
              </li>
              <li className="nav-item navItem"><Link to="/data-access" className="nav-link">Data Access</Link></li>
              <li className="nav-item navItem">
                <LogoutButton />
              </li>
            </ul>
            {isAuthenticated && hasAccess
              ? (
                <QuickSearchBox
                  quickSearchTerm={quickSearchTerm}
                  handleQuickSearchInputChange={handleQuickSearchInputChange}
                  handleQuickSearchRequestSubmit={handleQuickSearchRequestSubmit}
                  resetQuickSearch={resetQuickSearch}
                  getSearchForm={getSearchForm}
                  resetAdvSearch={resetAdvSearch}
                />
              )
              : null}
          </div>
        </div>
      </nav>
    </div>
  );
  return navbar;
}

Navbar.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    picture: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
  isAuthenticated: PropTypes.bool,
  login: PropTypes.func,
  logout: PropTypes.func,
  quickSearchTerm: PropTypes.string,
  handleQuickSearchInputChange: PropTypes.func,
  handleQuickSearchRequestSubmit: PropTypes.func,
  resetQuickSearch: PropTypes.func,
  getSearchForm: PropTypes.func,
};

Navbar.defaultProps = {
  profile: {},
  isAuthenticated: false,
  login: null,
  logout: null,
  quickSearchTerm: '',
  handleQuickSearchInputChange: null,
  handleQuickSearchRequestSubmit: null,
  resetQuickSearch: null,
  getSearchForm: null,
};

const mapStateToProps = state => ({
  ...(state.quickSearch),
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
  handleQuickSearchInputChange: e => dispatch(QuickSearchBoxActions.quickSearchInputChange(e)),
  handleQuickSearchRequestSubmit: searchTerm => dispatch(QuickSearchBoxActions.handleQuickSearchRequestSubmit(searchTerm)),
  resetQuickSearch: () => dispatch(QuickSearchBoxActions.quickSearchReset()),
  getSearchForm: () => dispatch(SearchActions.getSearchForm()),
  resetAdvSearch: () => dispatch(SearchActions.searchFormReset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
