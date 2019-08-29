import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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
  clearForm,
  resetDepth,
}) {
  const hasAccess = profile.user_metadata && profile.user_metadata.hasAccess;

  if (!(isAuthenticated && hasAccess)) {
    return '';
  }
  const sidebar = (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column mt-1">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link d-inline-flex align-items-center disabled-link">
              <i className="material-icons nav-link-icon">home</i>
                Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/methods" className="nav-link d-inline-flex align-items-center disabled-link">
              <i className="material-icons nav-link-icon">description</i>
                Methods
            </Link>
          </li>
        </ul>

        <h6 className="sidebar-heading px-3 mt-4 mb-1 text-muted">
          <span>Analysis</span>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <Link to="/analysis/animal" onClick={resetDepth} className="nav-link d-inline-flex align-items-center">
              <span className="icon-Animal nav-link-icon" />
                Animal
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/analysis/human" onClick={resetDepth} className="nav-link d-inline-flex align-items-center">
              <i className="material-icons nav-link-icon">person</i>
                Human
            </Link>
          </li>
        </ul>

        <h6 className="sidebar-heading px-3 mt-4 mb-1 text-muted">
          <span>Data</span>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <Link to="/download" className="nav-link d-inline-flex align-items-center disabled-link">
              <i className="material-icons nav-link-icon">view_list</i>
                Browse Data
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/summary" className="nav-link d-inline-flex align-items-center">
              <i className="material-icons nav-link-icon">assessment</i>
                Summary
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/releases" className="nav-link d-inline-flex align-items-center">
              <i className="material-icons nav-link-icon">open_with</i>
                Releases
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/upload" onClick={clearForm} className="nav-link d-inline-flex align-items-center disabled-link">
              <i className="material-icons nav-link-icon">cloud_upload</i>
                Upload Data
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );

  return sidebar;
}
const mapStateToProps = state => ({
  profile: state.auth.profile,
  isAuthenticated: state.auth.isAuthenticated,
});

// Need to clear the upload form values and recently uploaded files
// if user navigates away from and returns to the upload page
const mapDispatchToProps = dispatch => ({
  clearForm: () => dispatch(actions.clearForm()),
  resetDepth: () => dispatch({ type: 'RESET_DEPTH' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
