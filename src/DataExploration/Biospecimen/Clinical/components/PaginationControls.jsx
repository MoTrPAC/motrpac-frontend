import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable pagination controls component
 * Features:
 * - Displays item range and total count
 * - Export button for data export
 * - Page navigation controls (first, previous, numbered pages, next, last)
 * - Page size selector
 * - Loading indicator during navigation
 */
const PaginationControls = ({ pagination, onExport, exportLabel = 'Export' }) => {
  return (
    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mt-3 p-3 bg-light rounded">
      {/* Left section: Item range and export button */}
      <div className="d-flex align-items-center mb-2 mb-lg-0">
        <span className="text-muted small mr-3">
          <strong>
            {pagination.startIndex.toLocaleString()} - {pagination.endIndex.toLocaleString()}
          </strong>
          {' of '}
          <strong>{pagination.totalItems.toLocaleString()}</strong>
          {' samples'}
        </span>
        
        {onExport && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onExport}
            title="Export all drill-down data to CSV"
          >
            <i className="bi bi-download mr-1" />
            {exportLabel}
          </button>
        )}
      </div>

      {/* Center section: Page navigation controls */}
      {pagination.totalPages > 1 && (
        <div className="d-flex align-items-center mb-2 mb-lg-0">
          <nav aria-label="Drill-down table pagination">
            <ul className="pagination pagination-sm mb-0">
              {/* First page button */}
              <li className={`page-item ${!pagination.hasPreviousPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={pagination.goToFirstPage}
                  disabled={!pagination.hasPreviousPage || pagination.isNavigating}
                  aria-label="First page"
                >
                  <i className="bi bi-chevron-double-left" />
                </button>
              </li>

              {/* Previous page button */}
              <li className={`page-item ${!pagination.hasPreviousPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={pagination.goToPreviousPage}
                  disabled={!pagination.hasPreviousPage || pagination.isNavigating}
                  aria-label="Previous page"
                >
                  <i className="bi bi-chevron-left" />
                </button>
              </li>

              {/* Numbered page buttons with ellipsis */}
              {pagination.getPageNumbers().map((page, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    page === pagination.currentPage ? 'active' : ''
                  } ${page === '...' ? 'disabled' : ''}`}
                >
                  {page === '...' ? (
                    <span className="page-link">...</span>
                  ) : (
                    <button
                      className="page-link"
                      onClick={() => pagination.goToPage(page)}
                      disabled={pagination.isNavigating}
                      aria-label={`Go to page ${page}`}
                      aria-current={page === pagination.currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}

              {/* Next page button */}
              <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={pagination.goToNextPage}
                  disabled={!pagination.hasNextPage || pagination.isNavigating}
                  aria-label="Next page"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </li>

              {/* Last page button */}
              <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={pagination.goToLastPage}
                  disabled={!pagination.hasNextPage || pagination.isNavigating}
                  aria-label="Last page"
                >
                  <i className="bi bi-chevron-double-right" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Right section: Loading indicator and page size selector */}
      <div className="d-flex align-items-center">
        {pagination.isNavigating && (
          <div className="spinner-border spinner-border-sm text-primary mr-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
        <div className="d-flex align-items-center text-muted small">
          <span className="mr-2">Show:</span>
          <select
            className="form-control form-control-sm"
            style={{ width: 'auto' }}
            value={pagination.itemsPerPage}
            onChange={(e) => pagination.changePageSize(parseInt(e.target.value))}
            disabled={pagination.isNavigating}
          >
            {[10, 20, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="ml-2">per page</span>
        </div>
      </div>
    </div>
  );
};

PaginationControls.propTypes = {
  pagination: PropTypes.shape({
    startIndex: PropTypes.number.isRequired,
    endIndex: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    hasPreviousPage: PropTypes.bool.isRequired,
    hasNextPage: PropTypes.bool.isRequired,
    isNavigating: PropTypes.bool.isRequired,
    goToFirstPage: PropTypes.func.isRequired,
    goToPreviousPage: PropTypes.func.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToLastPage: PropTypes.func.isRequired,
    goToPage: PropTypes.func.isRequired,
    getPageNumbers: PropTypes.func.isRequired,
    changePageSize: PropTypes.func.isRequired,
  }).isRequired,
  onExport: PropTypes.func,
  exportLabel: PropTypes.string,
};

export default PaginationControls;
