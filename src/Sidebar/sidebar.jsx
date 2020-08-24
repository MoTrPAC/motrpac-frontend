import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import actions from '../UploadPage/uploadActions';

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
  clearForm,
  resetDepth,
  toggleSidebar,
}) {
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;
  const userType = profile.user_metadata && profile.user_metadata.userType;

  if (!(isAuthenticated && hasAccess)) {
    return '';
  }

  const renderTooltip = (label, id) => (
    <Tooltip id={`sidebar-navlink-${id}`}>{label}</Tooltip>
  );

  function renderNavLink(route, label, icon, disabled, handler) {
    // Omit tooltip if sidebar is expanded
    // due to the presence of navlink labels
    if (expanded) {
      return (
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
      );
    }

    // Show tooltip if sidebar is collapsed
    return (
      <OverlayTrigger placement="right" overlay={renderTooltip(label, route)}>
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
      </OverlayTrigger>
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
        <OverlayTrigger
          placement="right"
          overlay={renderTooltip(expanded ? 'Collpase' : 'Expand', 'toggle')}
        >
          <button
            className="sidebar-btn-toggle btn btn-light"
            type="button"
            onClick={toggleSidebar}
          >
            <i className="material-icons nav-sidebar-btn-icon">
              {expanded ? 'close' : 'menu'}
            </i>
          </button>
        </OverlayTrigger>
        <div className="sidebar-panel h-100 w-100">
          <ul className="nav flex-column">
            <li className="nav-item">
              {renderNavLink('dashboard', 'Dashboard', 'home', false)}
            </li>
            <li className="nav-item">
              {renderNavLink('methods', 'Methods', 'description', true)}
            </li>
          </ul>

          <h6 className="sidebar-heading px-3 mt-3 mb-2 text-muted">
            <span>Analysis</span>
          </h6>
          <ul className="nav flex-column">
            <li className="nav-item">
              {renderNavLink(
                'analysis/animal',
                'Animal',
                'pest_control_rodent',
                userType === 'external',
                resetDepth
              )}
            </li>
            <li className="nav-item">
              {renderNavLink(
                'analysis/human',
                'Human',
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
              {renderNavLink('releases', 'Releases', 'insights', false)}
            </li>
            <li className="nav-item">
              {renderNavLink('summary', 'Summary', 'assessment', true)}
            </li>
            <li className="nav-item">
              {renderNavLink('download', 'Browse Data', 'view_list', true)}
            </li>
            <li className="nav-item">
              {renderNavLink(
                'upload',
                'Upload Data',
                'cloud_upload',
                true,
                clearForm
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

// Need to clear the upload form values and recently uploaded files
// if user navigates away from and returns to the upload page
const mapDispatchToProps = (dispatch) => ({
  clearForm: () => dispatch(actions.clearForm()),
  resetDepth: () => dispatch({ type: 'RESET_DEPTH' }),
  toggleSidebar: () => dispatch({ type: 'SIDEBAR_TOGGLED' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
