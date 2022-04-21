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
function TrainingResultsTable({ trainingData, searchParams, downloadPath }) {
  // Define table column headers
  const columns = useMemo(
    () =>
      searchParams.ktype === 'metab'
        ? metabTrainingTableColumns
        : trainingTableColumns,
    []
  );
  const data = useMemo(() => transformData(trainingData), [trainingData]);
  return (
    <TrainingDataTable
      columns={columns}
      data={data}
      downloadPath={downloadPath}
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
function TrainingDataTable({ columns, data, downloadPath }) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) =>
        rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        }),
    }),
    []
  );

  // Use the useTable hook to create your table configuration
  const instance = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 40,
        pageCount: Math.ceil(data / 40),
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter,
    filterValue,
    pageOptions,
    pageCount,
    page,
    state: { pageIndex, pageSize, globalFilter },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = instance;

  // default page size options given the length of entries in the data
  const range = (start, stop, step = 20) => Array(Math.ceil(stop / step)).fill(start).map((x, y) => x + y * step);

  const resultDownloadFilePath = downloadPath.substring(
    downloadPath.indexOf('search_results')
  );

  // Render the UI for your table
  // react-table doesn't have UI, it's headless. We just need to put the react-table
  // props from the Hooks, and it will do its magic automatically
  return (
    <div className="search-results-container">
      <div className="d-flex align-items-center justify-content-between">
        <PageSize
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizeOptions={range(20, preGlobalFilteredRows.length)}
        />
        <div className="file-download-button">
          <a
            href={`${process.env.REACT_APP_ES_PROXY_HOST}/${resultDownloadFilePath}`}
            className="btn btn-sm btn-primary d-flex align-items-center"
            rolw="button"
            download
          >
            <span className="material-icons">file_download</span>
            <span>Download results</span>
          </a>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-body table-ui-wrapper">
          <div className="table-responsive">
            <table
              {...getTableProps()}
              className="table table-sm timewiseDEATable"
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
                          column.getSortByToggleProps()
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
                        <td {...cell.getCellProps()} className={cell.value}>
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
  downloadPath: PropTypes.string,
};

TrainingResultsTable.defaultProps = {
  downloadPath: '',
};

TrainingDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({ ...trainingResultsTablePropType }))
    .isRequired,
  downloadPath: PropTypes.string,
};

TrainingDataTable.defaultProps = {
  downloadPath: '',
};

export default TrainingResultsTable;
