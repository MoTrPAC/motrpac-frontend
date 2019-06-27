import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import history from '../App/history';

/**
 * Renders the quick search input field
 *
 * @returns {object} JSX representation of search input element.
 */
function QuickSearchBox() {
  const [quickSearchTerm, setQuickSearchTerm] = useState('');
  const quickSearchInput = useRef(null);

  // Handler for quick search box value change
  const handleInputChange = (e) => {
    e.preventDefault();
    const searchTerm = quickSearchInput.current.value;
    setQuickSearchTerm(searchTerm);
  };

  // Handler for quick search form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    quickSearchInput.current.blur();
    history.push(`/search?q=${encodeURI(quickSearchTerm)}`);
  };

  return (
    <div className="d-flex align-items-center quick-search-box-container">
      <div className="quick-search-box-icon">
        <i className="material-icons">search</i>
      </div>
      <form className="form-inline quick-search-box-form" onSubmit={handleFormSubmit}>
        <input
          ref={quickSearchInput}
          type="text"
          value={quickSearchTerm}
          className="form-control quick-search-box"
          onChange={handleInputChange}
          placeholder="Search"
          aria-label="Search"
        />
      </form>
      <div className="quick-search-box-link">
        <Link to="/search" className="adv-search-link">Advanced</Link>
      </div>
    </div>
  );
}

export default QuickSearchBox;
