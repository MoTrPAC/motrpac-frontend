import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Renders the quick search input field
 *
 * @returns {object} JSX representation of search input element.
 */
function QuickSearchBox({
  quickSearchTerm = '',
  handleQuickSearchInputChange = null,
  handleQuickSearchRequestSubmit = null,
  resetQuickSearch = null,
  getSearchForm = null,
  resetAdvSearch = null,
}) {
  const quickSearchInput = useRef(null);

  const handleQuickSearchFormSubmit = (e) => {
    e.preventDefault();
    resetAdvSearch();
    handleQuickSearchRequestSubmit(quickSearchTerm);
    quickSearchInput.current.blur();
  };

  const getAdvancedSearchForm = () => {
    resetQuickSearch();
    getSearchForm();
  };

  return (
    <div className="d-flex align-items-center quick-search-box-container">
      <div className="quick-search-box-icon">
        <i className="material-icons">search</i>
      </div>
      <form className="form-inline quick-search-box-form" onSubmit={handleQuickSearchFormSubmit}>
        <input
          ref={quickSearchInput}
          type="text"
          value={quickSearchTerm}
          className="form-control quick-search-box"
          placeholder="Search"
          aria-label="Search"
          onChange={(e) => { e.preventDefault(); handleQuickSearchInputChange(e); }}
        />
      </form>
      <div className="quick-search-box-link">
        <Link to="/search" className="adv-search-link" onClick={getAdvancedSearchForm}>Advanced</Link>
      </div>
    </div>
  );
}

QuickSearchBox.propTypes = {
  quickSearchTerm: PropTypes.string,
  handleQuickSearchInputChange: PropTypes.func,
  handleQuickSearchRequestSubmit: PropTypes.func,
  resetQuickSearch: PropTypes.func,
  getSearchForm: PropTypes.func,
  resetAdvSearch: PropTypes.func,
};


export default QuickSearchBox;
