import React, { useMemo, useEffect, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
  useRowSelect,
} from 'react-table';
import browseDataPropType, {
  tableColumns,
  PageIndex,
  PageSize,
  PageNavigationControl,
  transformData,
} from './helper';
import IconSet from '../lib/iconSet';

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
  selectedFileUrls,
  selectedFileNames,
  waitingForResponse,
  error,
  handleDownloadRequest,
  downloadRequestResponse,
  profile,
}) {
  // Define table column headers
  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => transformData(filteredFiles), [filteredFiles]);
  return (
    <DataTable
      columns={columns}
      data={data}
      selectedFileUrls={selectedFileUrls}
      selectedFileNames={selectedFileNames}
      handleDownloadRequest={handleDownloadRequest}
      downloadRequestResponse={downloadRequestResponse}
      waitingForResponse={waitingForResponse}
      error={error}
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
  selectedFileUrls,
  selectedFileNames,
  waitingForResponse,
  error,
  handleDownloadRequest,
  downloadRequestResponse,
  profile,
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
        pageCount: 59,
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
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
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
    rows,
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
  const range = (start, stop, step = 10) =>
    Array(Math.ceil(stop / step))
      .fill(start)
      .map((x, y) => x + y * step);

  // function to convert bytes to human readable format
  function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
  }

  // Render file manifest download link
  function renderManifestDownloadLink() {
    if (error && error.length) {
      return false;
    }

    // Create array of selected object paths
    const objects = [];
    selectedFileNames.forEach((item) => objects.push(item.object));
    const sortedObjects = objects.sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
    // Convert array to csv
    const manifestContent = sortedObjects.join('\r\n');

    // Create a blob
    const blob = new Blob([manifestContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const fileManifestUrl = URL.createObjectURL(blob);

    return (
      <tr className="file-download-list-item manifest-file">
        <td colSpan="2" className="font-weight-bold">
          List of selected files with file structure paths
        </td>
        <td className="file-download-link-item">
          <a
            id="file-manifest-download"
            href={fileManifestUrl}
            download="file_manifest.csv"
            className="file-download-list-item-link"
          >
            <span className="material-icons">file_download</span>
          </a>
        </td>
      </tr>
    );
  }

  // Render modal message
  function renderFileDownloadLinks() {
    if (error && error.length) {
      return <span className="modal-message">{error}</span>;
    }

    return (
      <div className="modal-message">
        {selectedFileUrls.length > 0 && (
          <div className="table-responsive">
            <table className="table table-sm file-download-list">
              <tbody>
                {selectedFileUrls.map((url) => {
                  const matched = selectedFileNames.find(
                    (item) => url.indexOf(item.file) > -1
                  );
                  return (
                    <tr key={url} className="file-download-list-item">
                      <td>{matched.file}</td>
                      <td>{bytesToSize(matched.size)}</td>
                      <td className="file-download-link-item">
                        <a
                          id={matched.file}
                          href={`${url}&response-content-disposition=attachment`}
                          download
                          className="file-download-list-item-link"
                        >
                          <span className="material-icons">file_download</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
                {renderManifestDownloadLink()}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Render modal
  function renderModal() {
    return (
      <div
        className="modal fade data-download-modal"
        id="dataDownloadModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="dataDownloadModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">File Download Request</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {downloadRequestResponse.length > 0 && !waitingForResponse ? (
                <div className="modal-message my-3">
                  <span className="file-download-request-response">
                    Your download request has been submitted. Processing time
                    may vary depending on the total file size. We will notify
                    you by email when the download is ready.
                  </span>
                </div>
              ) : (
                <div className="loading-spinner my-5">
                  <img src={IconSet.Spinner} alt="" />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  /* End: Download modal */

  // Render the UI for your table
  // react-table doesn't have UI, it's headless. We just need to put the react-table
  // props from the Hooks, and it will do its magic automatically
  return (
    <div className="browse-data-table-wrapper col-md-9">
      <div className="d-flex align-items-center justify-content-between">
        <PageSize
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizeOptions={range(10, preGlobalFilteredRows.length)}
        />
        <div className="file-download-button">
          <button
            type="button"
            className="btn btn-sm btn-primary d-flex align-items-center"
            disabled={Object.keys(selectedRowIds).length === 0}
            data-toggle="modal"
            data-target=".data-download-modal"
            onClick={() => {
              handleDownloadRequest(
                profile.user_metadata.email,
                profile.user_metadata.name,
                selectedFlatRows
              );
            }}
          >
            <span className="material-icons">file_download</span>
            <span>Download selected files</span>
          </button>
          {Object.keys(selectedRowIds).length > 0 ? renderModal() : null}
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
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="table-head"
                  >
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        <div className="d-flex align-items-center justify-content-between">
                          {column.render('Header')}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.slice(0, pageSize).map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className={`${cell.column.id} ${
                            cell.value ? cell.value : 'not-available'
                          }`}
                        >
                          <span>{cell.render('Cell')}</span>
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

BrowseDataTable.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({ ...browseDataPropType }))
    .isRequired,
  selectedFileUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedFileNames: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
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
  selectedFileUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedFileNames: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default BrowseDataTable;
