import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
} from 'react-table';
import {
  searchParamsPropType,
  searchResultsTablePropType,
  geneResultTableColumns,
  metaboliteResultTableColumns,
  proteinResultTableColumns,
  PageIndex,
  PageSize,
  PageNavigationControl,
  transformData,
} from './sharedlib';

/**
 * Sanitizes a value to be safe for use as a CSS class name.
 * - Converts to lowercase
 * - Replaces non-alphanumeric characters with hyphens
 * - Collapses multiple hyphens into one
 * - Removes leading/trailing hyphens
 * - Prefixes with 'c-' if it starts with a digit
 * - Returns empty string for falsy or non-string values
 *
 * @param {any} value - The value to sanitize
 * @returns {string} A valid CSS class name or empty string
 */
function sanitizeClassName(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  let sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric (except hyphen) with hyphen
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // CSS class names cannot start with a digit
  if (/^[0-9]/.test(sanitized)) {
    sanitized = `c-${sanitized}`;
  }

  return sanitized;
}

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function SearchResultsTable({
  unifiedResults,
  searchParams,
  handleSearchDownload,
  total,
  size,
  start,
  onPaginationChange,
}) {
  // Define table column headers
  const columns = useMemo(() => {
    switch (searchParams.ktype) {
      case 'metab':
        return metaboliteResultTableColumns;
      case 'protein':
        return proteinResultTableColumns;
      default:
        return geneResultTableColumns;
    }
  }, [searchParams.ktype]);
  const data = useMemo(() => transformData(unifiedResults), [unifiedResults]);
  return (
    <ResultsTable
      columns={columns}
      data={data}
      searchParams={searchParams}
      handleSearchDownload={handleSearchDownload}
      total={total}
      size={size}
      start={start}
      onPaginationChange={onPaginationChange}
    />
  );
}

/**
 * Renders the data qc status table
 *
 * @param {Array} columns Array of column header labels and its data source
 *
 * @returns {object} JSX representation of table on data qc status
 */
function ResultsTable({
  columns,
  data,
  searchParams,
  handleSearchDownload,
  total,
  size,
  start,
  onPaginationChange,
}) {
  // Use the useTable hook to create your table configuration
  // Server-side pagination: no usePagination hook, render all rows from current page
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
  );

  // Handle page size change - reset to first page
  const handlePageSizeChange = (newSize) => {
    onPaginationChange({ size: newSize, start: 0 });
  };

  // Handle page navigation
  const handlePageChange = (newStart) => {
    onPaginationChange({ size, start: newStart });
  };

  // Render the UI for your table
  // Server-side pagination: data already contains only current page's rows
  return (
    <div className="search-results-container">
      <div className="d-flex align-items-center justify-content-between">
        <PageSize
          size={size}
          onPageSizeChange={handlePageSizeChange}
        />
        <div className="file-download-button">
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center"
            data-toggle="modal"
            data-target=".data-download-modal"
            onClick={(e) => {
              e.preventDefault();
              handleSearchDownload(searchParams, 'precawg');
            }}
          >
            <span className="material-icons">file_download</span>
            <span>Download results</span>
          </button>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-body table-ui-wrapper">
          <div className="table-responsive">
            <table
              {...getTableProps()}
              className="table table-sm deaResultsTable"
            >
              <thead>
                {headerGroups.map((headerGroup) => {
                  // Destructure key and rest of the header group props
                  // to avoid passing key as a prop to the table row
                  const { key, ...restHeaderGroups } = headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...restHeaderGroups} className="table-head">
                      {headerGroup.headers.map((column) => {
                        // Destructure key and rest of the column header props
                        // to avoid passing key as a prop to the table header
                        const { key, ...rest } = column.getHeaderProps();
                        return (
                          <th
                            key={key}
                            {...rest}
                            {...column.getSortByToggleProps({ title: '' })}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              {column.render('Header')}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? <i className="material-icons">expand_more</i>
                                    : <i className="material-icons">expand_less</i>
                                  : <i className="material-icons">unfold_more</i>}
                              </span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  // Destructure key and rest of the row props
                  // to avoid passing key as a prop to the table row
                  const { key, ...restRowProps } = row.getRowProps();
                  return (
                    <tr key={key} {...restRowProps}>
                      {row.cells.map((cell) => {
                        // Destructure key and rest of the cell props
                        // to avoid passing key as a prop to the table cell
                        const { key, ...restCellProps } = cell.getCellProps();
                        return (
                          <td
                            key={key}
                            {...restCellProps}
                            className={sanitizeClassName(cell.value)}
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="pagination-footer d-flex align-items-center justify-content-between">
        <PageIndex total={total} size={size} start={start} />
        <PageNavigationControl
          total={total}
          size={size}
          start={start}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

SearchResultsTable.propTypes = {
  unifiedResults: PropTypes.arrayOf(
    PropTypes.shape({ ...searchResultsTablePropType }),
  ).isRequired,
  searchParams: PropTypes.shape({ ...searchParamsPropType }).isRequired,
  handleSearchDownload: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
};

ResultsTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
      accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    }),
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({ ...searchResultsTablePropType }))
    .isRequired,
  searchParams: PropTypes.shape({ ...searchParamsPropType }).isRequired,
  handleSearchDownload: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  onPaginationChange: PropTypes.func.isRequired,
};

export default SearchResultsTable;
