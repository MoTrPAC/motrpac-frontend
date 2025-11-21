import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from 'react-table';
import {
  searchParamsPropType,
  trainingResultsTablePropType,
  trainingTableColumns,
  proteinTrainingTableColumns,
  metabTrainingTableColumns,
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
function TrainingResultsTable({
  trainingData,
  searchParams,
  handleSearchDownload,
}) {
  // Define table column headers
  const columns = useMemo(() => {
    switch (searchParams.ktype) {
      case 'metab':
        return metabTrainingTableColumns;
      case 'protein':
        return proteinTrainingTableColumns;
      default:
        return trainingTableColumns;
    }
  }, [searchParams.ktype]);
  const data = useMemo(() => transformData(trainingData), [trainingData]);
  return (
    <TrainingDataTable
      columns={columns}
      data={data}
      searchParams={searchParams}
      handleSearchDownload={handleSearchDownload}
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
function TrainingDataTable({
  columns,
  data,
  searchParams,
  handleSearchDownload,
}) {
  // Use the useTable hook to create your table configuration
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    preGlobalFilteredRows,
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
      initialState: {
        pageIndex: 0,
        pageSize: 50,
        pageCount: Math.ceil(data.length / 50),
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  // default page size options given the length of entries in the data
  const range = (start, stop, step = 50) => Array(Math.ceil(stop / step)).fill(start).map((x, y) => x + y * step);

  // Render the UI for your table
  // react-table doesn't have UI, it's headless. We just need to put the react-table
  // props from the Hooks, and it will do its magic automatically
  return (
    <div className="search-results-container">
      <div className="d-flex align-items-center justify-content-between">
        <PageSize
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizeOptions={range(50, preGlobalFilteredRows.length)}
        />
        <div className="file-download-button">
          {/*
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center"
            data-toggle="modal"
            data-target=".data-download-modal"
            onClick={(e) => {
              e.preventDefault();
              handleSearchDownload(searchParams, 'training');
            }}
          >
            <span className="material-icons">file_download</span>
            <span>Download results</span>
          </button>
          */}
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
                {page.map((row) => {
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
                            className={cell.value ? cell.value : ''}
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
        <PageIndex pageIndex={pageIndex} pageOptions={pageOptions} />
        <PageNavigationControl
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
          gotoPage={gotoPage}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
}

TrainingResultsTable.propTypes = {
  trainingData: PropTypes.arrayOf(
    PropTypes.shape({ ...trainingResultsTablePropType })
  ).isRequired,
  searchParams: PropTypes.shape({ ...searchParamsPropType }).isRequired,
  handleSearchDownload: PropTypes.func.isRequired,
};

TrainingDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({ ...trainingResultsTablePropType }))
    .isRequired,
  searchParams: PropTypes.shape({ ...searchParamsPropType }).isRequired,
  handleSearchDownload: PropTypes.func.isRequired,
};

export default TrainingResultsTable;
