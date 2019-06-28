import React from 'react';
import PropTypes from 'prop-types';
import SearchTermList from './searchTermList';

function SearchForm({
  advSearchParams,
  handleSearchFormChange,
  addSearchParam,
  removeSearchParam,
  resetSearchForm,
  handleSearchFormSubmit,
}) {
  return (
    <div className="advanced-search-form-container card shadow-sm">
      <div className="card-body">
        <form id="advancedSearchForm" name="advancedSearchForm">
          <SearchTermList
            advSearchParams={advSearchParams}
            handleSearchFormChange={handleSearchFormChange}
            addSearchParam={addSearchParam}
            removeSearchParam={removeSearchParam}
          />
          <div className="search-button-group d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-primary adv-search-reset"
              onClick={resetSearchForm}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn-primary adv-search-submit ml-3"
              onClick={handleSearchFormSubmit}
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

SearchForm.propTypes = {
  advSearchParams: PropTypes.arrayOf(PropTypes.shape({
    term: PropTypes.string,
    value: PropTypes.string,
    operator: PropTypes.string,
  })),
  handleSearchFormChange: PropTypes.func.isRequired,
  addSearchParam: PropTypes.func.isRequired,
  removeSearchParam: PropTypes.func.isRequired,
  resetSearchForm: PropTypes.func.isRequired,
  handleSearchFormSubmit: PropTypes.func.isRequired,
};

SearchForm.defaultProps = {
  advSearchParams: [{ term: 'all', value: '', operator: 'and' }],
};

export default SearchForm;
