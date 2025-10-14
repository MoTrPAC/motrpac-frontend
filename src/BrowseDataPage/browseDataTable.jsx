import React, { useMemo, useEffect, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
  useRowSelect,
} from 'react-table';
import {
  browseDataPropType,
  tableColumns,
  PageIndex,
  PageSize,
  PageNavigationControl,
  transformData,
} from './helper';
import AuthAccessFileDownloadModal from './components/authAccessModal';
import OpenAccessFileDownloadModal from './components/openAccessModal';

// React-Table row selection setup
const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function BrowseDataTable({
  filteredFiles,
  waitingForResponse,
  handleDownloadRequest,
  downloadRequestResponse,
  profile = {},
}) {
  const dataDownload = useSelector((state) => state.browseData);
  const userType = profile?.user_metadata?.userType;

  // Define table column headers
  const columns = useMemo(
    () => tableColumns(userType, dataDownload.pass1b06DataSelected),
    [userType, dataDownload.pass1b06DataSelected]
  );
  const data = useMemo(() => transformData(filteredFiles), [filteredFiles]);
  return (
    <DataTable
      columns={columns}
      data={data}
      handleDownloadRequest={handleDownloadRequest}
      downloadRequestResponse={downloadRequestResponse}
      waitingForResponse={waitingForResponse}
      profile={profile}
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
  waitingForResponse,
  handleDownloadRequest,
  downloadRequestResponse,
  profile = {},
}) {
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
        pageSize: 50,
        pageCount: Math.ceil(data / 50),
        sortBy: [{ id: 'tissue_name', desc: false }],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
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
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = instance;

  // default page size options given the length of entries in the data
  const range = (start, stop, step = 50) =>
    Array(Math.ceil(stop / step))
      .fill(start)
      .map((x, y) => x + y * step);

  // Render the UI for your table
  // react-table doesn't have UI, it's headless. We just need to put the react-table
  // props from the Hooks, and it will do its magic automatically
  return (
    <div className="browse-data-table-wrapper col-md-9">
      <div className="d-flex align-items-center justify-content-between">
        <PageSize
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizeOptions={range(50, preGlobalFilteredRows.length)}
        />
        <div className="file-download-button">
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center"
            disabled={Object.keys(selectedRowIds).length === 0}
            data-toggle="modal"
            data-target="#dataDownloadModal"
          >
            <span className="material-icons">file_download</span>
            <span>Download selected files</span>
          </button>
          <OpenAccessFileDownloadModal
            waitingForResponse={waitingForResponse}
            downloadRequestResponse={downloadRequestResponse}
            handleDownloadRequest={handleDownloadRequest}
            selectedFiles={selectedFlatRows}
            profile={profile}
          />
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <div className="table-responsive">
            <table
              {...getTableProps()}
              className="table table-sm browseDataTable"
            >
              <thead>
                {headerGroups.map((headerGroup) => {
                  const { key, ...restHeaderGroups } = headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...restHeaderGroups} className="table-head">
                      {headerGroup.headers.map((column) => {
                        const { key, ...rest } = column.getHeaderProps();
                        return (
                          <th key={key} {...rest}>
                          <div className="d-flex align-items-center justify-content-between">
                            {column.render('Header')}
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
                  const { key, ...restRowProps } = row.getRowProps();
                  return (
                    <tr key={key} {...restRowProps}>
                      {row.cells.map((cell) => {
                        const { key, ...restCellProps } = cell.getCellProps();
                        return (
                          <td
                            key={key}
                            {...restCellProps}
                            className={`${cell.column.id} ${
                              cell.value ? cell.value : 'not-available'
                            }`}
                          >
                            <span>{cell.render('Cell')}</span>
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

BrowseDataTable.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({ ...browseDataPropType }))
    .isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({ ...browseDataPropType }))
    .isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
};

export default BrowseDataTable;
