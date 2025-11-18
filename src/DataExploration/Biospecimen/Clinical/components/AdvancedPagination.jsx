import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const AdvancedPagination = ({
  data,
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  hasNextPage,
  hasPreviousPage,
  isNavigating,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  goToFirstPage,
  goToLastPage,
  changePageSize,
  getPageNumbers,
  handleKeyPress,
}) => {
  const [jumpToPage, setJumpToPage] = useState('');
  const [showJumpInput, setShowJumpInput] = useState(false);
  const jumpInputRef = useRef(null);

  // Handle jump to page
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const page = parseInt(jumpToPage, 10);
    if (page >= 1 && page <= totalPages) {
      goToPage(page);
      setJumpToPage('');
      setShowJumpInput(false);
    }
  };

  // Focus jump input when shown
  useEffect(() => {
    if (showJumpInput && jumpInputRef.current) {
      jumpInputRef.current.focus();
    }
  }, [showJumpInput]);

  // Add keyboard navigation
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (totalItems === 0) return null;

  const pageNumbers = getPageNumbers();
  const pageSizeOptions = [10, 20, 50, 100];

  return (
    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mt-3 p-3 bg-light rounded">
      {/* Results info with export option */}
      <div className="d-flex align-items-center mb-2 mb-lg-0">
        <span className="text-muted small mr-3">
          <strong>
            {startIndex.toLocaleString()} - {endIndex.toLocaleString()}
          </strong>
          {' of '}
          <strong>{totalItems.toLocaleString()}</strong>
          {' results'}
        </span>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            // Export current page data
            const header =
              'Vial Label,Participant ID,Tranche,Temp Sample Profile,Randomized Group,Visit Code,Timepoint,Tissue,Sex,Age Groups,BMI,CAS Received\n';
            const rows = data
              .map(
                (item) =>
                  `${item.vial_label},${item.pid},${item.tranche},${item.tempSampProfile},${item.randomGroupCode},${item.visitcode},${item.timepoint},${item.sampleGroupCode},${item.sex},${item.age_groups},${item.bmi},${item.receivedCAS}`,
              )
              .join('\n');
            const csvData = 'data:text/csv;charset=utf-8,' + header + rows;
            const encodedUri = encodeURI(csvData);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `biospecimen_data_export.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          title="Export current page to CSV"
        >
          <i className="bi bi-download mr-1" />
          Export
        </button>
      </div>

      {/* Main pagination controls */}
      {totalPages > 1 && (
        <div className="d-flex align-items-center mb-2 mb-lg-0">
          <nav aria-label="Biospecimen results pagination">
            <ul className="pagination pagination-sm mb-0">
              {/* First page */}
              <li className={`page-item ${!hasPreviousPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={goToFirstPage}
                  disabled={!hasPreviousPage || isNavigating}
                  aria-label="First page"
                  title="First page (Home key)"
                >
                  <i className="bi bi-chevron-double-left" />
                </button>
              </li>

              {/* Previous page */}
              <li className={`page-item ${!hasPreviousPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={goToPreviousPage}
                  disabled={!hasPreviousPage || isNavigating}
                  aria-label="Previous page"
                  title="Previous page (← key)"
                >
                  <i className="bi bi-chevron-left" />
                </button>
              </li>

              {/* Page numbers */}
              {pageNumbers.map((page, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    page === currentPage ? 'active' : ''
                  } ${page === '...' ? 'disabled' : ''}`}
                >
                  {page === '...' ? (
                    <span className="page-link">...</span>
                  ) : (
                    <button
                      className="page-link"
                      onClick={() => goToPage(page)}
                      disabled={isNavigating}
                      aria-label={`Go to page ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}

              {/* Next page */}
              <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={goToNextPage}
                  disabled={!hasNextPage || isNavigating}
                  aria-label="Next page"
                  title="Next page (→ key)"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </li>

              {/* Last page */}
              <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={goToLastPage}
                  disabled={!hasNextPage || isNavigating}
                  aria-label="Last page"
                  title="Last page (End key)"
                >
                  <i className="bi bi-chevron-double-right" />
                </button>
              </li>
            </ul>
          </nav>

          {/* Jump to page */}
          <div className="ml-3">
            {showJumpInput ? (
              <form onSubmit={handleJumpToPage} className="d-flex">
                <input
                  ref={jumpInputRef}
                  type="number"
                  className="form-control form-control-sm"
                  style={{ width: '70px' }}
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  onBlur={() => {
                    setTimeout(() => setShowJumpInput(false), 200);
                  }}
                  placeholder="Page"
                  min="1"
                  max={totalPages}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm ml-1"
                  disabled={!jumpToPage || isNavigating}
                >
                  Go
                </button>
              </form>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowJumpInput(true)}
                title="Jump to specific page"
              >
                <i className="bi bi-skip-end-fill" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Page size selector and loading indicator */}
      <div className="d-flex align-items-center">
        {isNavigating && (
          <div
            className="spinner-border spinner-border-sm text-primary mr-3"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        )}

        <div className="d-flex align-items-center text-muted small">
          <span className="mr-2">Show:</span>
          <select
            className="form-control form-control-sm"
            style={{ width: 'auto' }}
            value={itemsPerPage}
            onChange={(e) => changePageSize(parseInt(e.target.value))}
            disabled={isNavigating}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="ml-2">per page</span>
        </div>
      </div>
    </div>
  );
};

AdvancedPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  hasPreviousPage: PropTypes.bool.isRequired,
  isNavigating: PropTypes.bool.isRequired,
  goToPage: PropTypes.func.isRequired,
  goToNextPage: PropTypes.func.isRequired,
  goToPreviousPage: PropTypes.func.isRequired,
  goToFirstPage: PropTypes.func.isRequired,
  goToLastPage: PropTypes.func.isRequired,
  changePageSize: PropTypes.func.isRequired,
  getPageNumbers: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
};

export default AdvancedPagination;
