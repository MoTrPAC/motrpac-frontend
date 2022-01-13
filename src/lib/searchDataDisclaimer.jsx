import React from 'react';

function SearchDataDisclaimer() {
  return (
    <div
      className="alert alert-info alert-dismissible fade show d-flex align-items-center mt-2 mb-0 alert-search-data-disclaimer"
      role="alert"
    >
      <span className="material-icons mr-2">info</span>
      <span>Only PASS1B 6-month data is available for searching.</span>
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

export default SearchDataDisclaimer;
