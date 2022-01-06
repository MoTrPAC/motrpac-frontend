import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

/**
 * Renders the gloabl sidebar.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 * @param {Object}  profile         Redux state for authenticated user's info.
 *
 * @returns {Object} JSX representation of the global sidebar.
 */
export function Sidebar({
  isAuthenticated = false,
  profile,
  expanded,
  resetDepth,
  toggleSidebar,
}) {
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  const userType = profile.user_metadata && profile.user_metadata.userType;

  if (!(isAuthenticated && hasAccess)) {
    return '';
  }

  function renderNavLink(route, label, id, icon, disabled, handler) {
    // Don't show tooltip if sidebar is expanded
    // due to the presence of navlink labels
    return (
      <div className="sidebar-nav-link-wrapper">
        <NavLink
          to={`/${route}`}
          onClick={handler}
          className={`nav-link d-inline-flex align-items-center w-100 ${
            disabled ? 'disabled-link' : ''
          }`}
        >
          <i className="material-icons nav-link-icon">{icon}</i>
          <span className="nav-link-label">{label}</span>
        </NavLink>
        {!expanded && !disabled && (
          <div className="tooltip-on-right" id={id}>
            {label}
            <i />
          </div>
        )}
      </div>
    );
  }

  const sidebar = (
    <nav
      id="sidebarMenu"
      className={`sidebar d-none d-md-block position-fixed bg-light ${
        expanded ? 'expanded' : 'collapsed'
      }`}
    >
      <div className="sidebar-sticky h-100 w-100">
        <div className="sidebar-toggle-btn-wrapper">
          <button
            className="sidebar-btn-toggle btn btn-light"
            type="button"
            onClick={toggleSidebar}
          >
            <i className="material-icons nav-sidebar-btn-icon">
              {expanded ? 'close' : 'menu'}
            </i>
          </button>
          <div className="tooltip-on-right" id="sidebar-toggle">
            {expanded ? 'Collapse' : 'Expand'}
            <i />
          </div>
        </div>
        <div className="sidebar-panel h-100 w-100">
          <ul className="nav flex-column">
            <li className="nav-item">
              {renderNavLink('home', 'Home', 'home', 'home', false)}
            </li>
            <li className="nav-item">
              {renderNavLink(
                'methods',
                'Methods',
                'methods',
                'description',
                false
              )}
            </li>
          </ul>

          <h6 className="sidebar-heading px-3 mt-3 mb-2 text-muted">
            <span>Analysis</span>
          </h6>
          <ul className="nav flex-column">
            <li className="nav-item">
              {renderNavLink(
                'analysis/animal',
                'Rat',
                'animal-analysis',
                'pest_control_rodent',
                userType === 'external',
                resetDepth
              )}
            </li>
            <li className="nav-item">
              {renderNavLink(
                'analysis/human',
                'Human',
                'human-analysis',
                'people_alt',
                userType === 'external',
                resetDepth
              )}
            </li>
          </ul>

          <h6 className="sidebar-heading px-3 mt-3 mb-2 text-muted">
            <span>Data</span>
          </h6>
          <ul className="nav flex-column">
            <li className="nav-item">
              {renderNavLink(
                'releases',
                'Releases',
                'releases',
                'rocket_launch',
                false
              )}
            </li>
            <li className="nav-item">
              {renderNavLink(
                'summary',
                'Summary',
                'summary',
                'assessment',
                false
              )}
            </li>
            <li className="nav-item">
              {renderNavLink(
                'status',
                'Data QC Status',
                'status',
                'fact_check',
                true
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );

  return sidebar;
}
const mapStateToProps = (state) => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
  expanded: state.sidebar.expanded,
});

// Need to reset depth of views on analysis page
// if user clicks on either the rat or human analysis links
const mapDispatchToProps = (dispatch) => ({
  resetDepth: () => dispatch({ type: 'RESET_DEPTH' }),
  toggleSidebar: () => dispatch({ type: 'SIDEBAR_TOGGLED' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
