import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the quick search input field
 *
 * @returns {object} JSX representation of search input element.
 */
function QuickSearchBox() {
  return (
    <div className="d-flex align-items-center quick-search-box-container">
      <div className="quick-search-box-icon">
        <i className="material-icons">search</i>
      </div>
      <form className="form-inline quick-search-box-form">
        <input className="form-control quick-search-box" type="text" placeholder="Search" aria-label="Search" />
      </form>
      <div className="quick-search-box-link">
        <Link to="/search" className="adv-search-link">Advanced</Link>
      </div>
    </div>
  );
}

export default QuickSearchBox;
