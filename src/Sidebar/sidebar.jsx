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
            <Link to="/dashboard" className="nav-link active">
              <span className="oi oi-home nav-link-icon" />
                Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/methods" className="nav-link">
              <span className="oi oi-excerpt nav-link-icon" />
                Methods
            </Link>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Analysis</span>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <Link to="/analysis/animal" className="nav-link">
              <span className="icon-Animal nav-link-icon" />
                Animal
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/analysis/human" className="nav-link">
              <span className="icon-Human nav-link-icon" />
                Human
            </Link>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Data</span>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <Link to="/download" className="nav-link">
              <span className="oi oi-data-transfer-download nav-link-icon" />
                Download/View Data
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/upload" onClick={clearForm} className="nav-link">
              <span className="oi oi-cloud-upload nav-link-icon" />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
