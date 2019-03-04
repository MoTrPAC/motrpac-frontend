import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

/**
 * Renders the gloabl sidebar.
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status.
 *
 * @returns {Object} JSX representation of the global sidebar.
 */
export function Sidebar({ isAuthenticated = false }) {
  const sidebar = (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/methods" className="nav-link">Methods</Link>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Analysis</span>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <Link to="/analysis/animal" className="nav-link">Animal</Link>
          </li>
          <li className="nav-item">
            <Link to="/analysis/human" className="nav-link">Human</Link>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Data</span>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <Link to="/download" className="nav-link">Download/View Data</Link>
          </li>
          <li className="nav-item">
            <Link to="/upload" className="nav-link">Upload Data</Link>
          </li>
        </ul>
      </div>
    </nav>
  );

  if (isAuthenticated) {
    return sidebar;
  }
  return null;
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// Fill dispatch to props once actions implemented
// const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps)(Sidebar);