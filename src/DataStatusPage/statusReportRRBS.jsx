import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from 'react-table';
import axios from 'axios';
import GOOGLEAPIS_STORAGE_URL from './googleapis_storage_config';
import statusReportPropType, {
  tableColumns,
  PageIndex,
  PageSize,
  PageNavigationControl,
  GlobalFilter,
} from './common';

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function StatusReportRRBS() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchStorageData = async () => {
      const result = await axios(
        `${GOOGLEAPIS_STORAGE_URL}/data/qc_report_rrbs.json`,
      );
      setList(result.data);
    };
    fetchStorageData();
  }, []);

  // Define table column headers
  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => list, [list]);

  return <DataTable columns={columns} data={data} />;
}

/**
 * Renders the data qc status table
 *
 * @param {Array} columns Array of column header labels and its data source
 *
 * @returns {object} JSX representation of table on data qc status
 */
function DataTable({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => rows.filter((row) => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
          : true;
      }),
    }),
    [],
  );

  // Use the useTable hook to create your table configuration
  const instance = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        pageCount: 7,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
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
  const range = (start, stop, step = 10) => Array(Math.ceil(stop / step)).fill(start).map((x, y) => x + y * step);

  // Render the UI for your table
  // react-table doesn't have UI, it's headless. We just need to put the react-table
  // props from the Hooks, and it will do its magic automatically
  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <PageSize
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizeOptions={range(10, preGlobalFilteredRows.length)}
        />
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <div className="table-responsive">
            <table {...getTableProps()} className="table table-sm dataStatusTable">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="table-head">
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                      {row.cells.map((cell) => <td {...cell.getCellProps()} className={cell.value}>{cell.render('Cell')}</td>)}
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
    </>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({ ...statusReportPropType })).isRequired,
};

export default StatusReportRRBS;
