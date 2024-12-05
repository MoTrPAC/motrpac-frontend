import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useSortBy,
  usePagination,
} from 'react-table';
import {
  searchParamsPropType,
  timewiseResultsTablePropType,
  timewiseTableColumns,
  proteinTimewiseTableColumns,
  metabTimewiseTableColumns,
  PageIndex,
  PageSize,
  PageNavigationControl,
  transformData,
} from './sharedlib';

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function TimewiseResultsTable({
  timewiseData,
  searchParams,
  handleSearchDownload,
  pageCount,
  handlePageSizeChange,
  handlePageIndexChange,
}) {
  // Define table column headers
  const columns = useMemo(() => {
    switch (searchParams.ktype) {
      case 'metab':
        return metabTimewiseTableColumns;
      case 'protein':
        return proteinTimewiseTableColumns;
      default:
        return timewiseTableColumns;
    }
  }, [searchParams.ktype]);
  const data = useMemo(() => transformData(timewiseData), [timewiseData]);
  return (
    <DataTable
      columns={columns}
      data={data}
      searchParams={searchParams}
      handleSearchDownload={handleSearchDownload}
      pageCount={pageCount}
      handlePageSizeChange={handlePageSizeChange}
      handlePageIndexChange={handlePageIndexChange}
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
function DataTable({
  columns,
  data,
  searchParams,
  handleSearchDownload,
  pageCount: controlledPageCount,
  handlePageSizeChange,
  handlePageIndexChange,
}) {
  // Use the useTable hook to create your table configuration
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    pageOptions,
    pageCount,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      initialState: {
        pageIndex: 0,
      },
      pageCount: controlledPageCount,
    },
    useSortBy,
    usePagination,
  );

  // Render the UI for your table
  // react-table doesn't have UI, it's headless. We just need to put the react-table
  // props from the Hooks, and it will do its magic automatically
  return (
    <div className="search-results-container">
      <div className="d-flex align-items-center justify-content-between">
        <PageSize
          pageSize={searchParams.size}
          setPageSize={setPageSize}
          handlePageSizeChange={handlePageSizeChange}
        />
        <div className="file-download-button">
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center"
            data-toggle="modal"
            data-target=".data-download-modal"
            onClick={(e) => {
              e.preventDefault();
              handleSearchDownload(searchParams, 'timewise');
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
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="table-head"
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps({ title: '' })
                        )}
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
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className={cell.value ? cell.value : ''}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="pagination-footer d-flex align-items-center justify-content-between">
        <PageIndex pageIndex={pageIndex} pageOptions={pageOptions} />
        <PageNavigationControl
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
          gotoPage={gotoPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
          handlePageIndexChange={handlePageIndexChange}
        />
      </div>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre>
    </div>
  );
}

TimewiseResultsTable.propTypes = {
  timewiseData: PropTypes.arrayOf(
    PropTypes.shape({ ...timewiseResultsTablePropType })
  ).isRequired,
  searchParams: PropTypes.shape({ ...searchParamsPropType }).isRequired,
  handleSearchDownload: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  handlePageSizeChange: PropTypes.func.isRequired,
  handlePageIndexChange: PropTypes.func.isRequired,
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({ ...timewiseResultsTablePropType }))
    .isRequired,
  searchParams: PropTypes.shape({ ...searchParamsPropType }).isRequired,
  handleSearchDownload: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  handlePageSizeChange: PropTypes.func.isRequired,
  handlePageIndexChange: PropTypes.func.isRequired,
};

export default TimewiseResultsTable;
