import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from 'react-table';
import { PageIndex, PageSize, PageNavigationControl } from './common';

/**
 * Utility function to return the sum of all issues
 */
const toSum = (list) => {
  let total = 0;
  list.forEach((value) => {
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(Number(value))) {
      total += Number(value);
    }
  });
  return total;
};

/**
 * Utility function to tranform each object in raw qc data array
 */
const transformData = (arr) => {
  const cloneArray = [...arr];
  // Replace instances of 'OK' string to 'PASS'
  // Replace instances of 'NOT_AVAILABLE' string to 'NOT AVAILABLE'
  const newArray = JSON.stringify(cloneArray)
    .replace(/OK/g, 'PASS')
    .replace(/NOT_AVAILABLE/g, 'NOT AVAILABLE');
  const tranformArray = JSON.parse(newArray);
  // Add new 'issues' property
  tranformArray.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.issues = toSum([
      item.critical_issues,
      item.m_metab_n,
      item.m_metab_u,
      item.m_sample_n,
      item.m_sample_u,
      item.results_n,
      item.results_u,
    ]);
  });
  return tranformArray;
};

/**
 * Renders global filter UI
 */
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <div className="form-group d-flex align-items-center justify-content-end">
      <label htmlFor="searchFilterInput">Search:</label>
      <input
        type="text"
        className="form-control"
        id="searchFilterInput"
        value={globalFilter || ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined);
        }}
        placeholder={`${count} entries`}
      />
    </div>
  );
}

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function StatusReportMetabolomics({ metabolomicsData }) {
  // Define table column headers
  const columns = useMemo(
    () => [
      {
        Header: 'CAS',
        accessor: 'cas',
      },
      {
        Header: 'Phase',
        accessor: 'phase',
      },
      {
        Header: 'Tissue',
        accessor: 'tissue',
      },
      {
        Header: 'Tissue Name',
        accessor: 't_name',
      },
      {
        Header: 'Assay',
        accessor: 'assay',
      },
      {
        Header: 'Version',
        accessor: 'version',
      },
      {
        Header: 'Vials',
        accessor: 'vial_label',
      },
      {
        Header: 'QC Samples',
        accessor: 'qc_samples',
      },
      {
        Header: 'Issues',
        accessor: 'issues',
      },
      {
        Header: 'DMAQC Valid',
        accessor: 'dmaqc_valid',
      },
      {
        Header: 'Raw Manifest',
        accessor: 'raw_manifest',
      },
      {
        Header: 'QC Date',
        accessor: 'qc_date',
      },
    ],
    [],
  );

  const data = useMemo(() => transformData(metabolomicsData), [metabolomicsData]);
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
        pageSize: 20,
        pageCount: 15,
        sortBy: [{ id: 'qc_date', desc: true }],
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
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className={`${cell.column.id} ${cell.column.id}-${cell.value} ${cell.value}`}
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
    </>
  );
}

const metabolomicsStatusReportPropType = {
  cas: PropTypes.string,
  phase: PropTypes.string,
  tissue: PropTypes.string,
  t_name: PropTypes.string,
  assay: PropTypes.string,
  version: PropTypes.string,
  vial_label: PropTypes.string,
  qc_samples: PropTypes.string,
  issues: PropTypes.number,
  dmaqc_valid: PropTypes.string,
  raw_manifest: PropTypes.string,
  qc_date: PropTypes.string,
};

StatusReportMetabolomics.propTypes = {
  metabolomicsData: PropTypes.arrayOf(PropTypes.shape({ ...metabolomicsStatusReportPropType })).isRequired,
};

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.arrayOf(PropTypes.shape({
    ...metabolomicsStatusReportPropType,
  })),
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

GlobalFilter.defaultProps = {
  globalFilter: '',
  preGlobalFilteredRows: [],
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.string,
    accessor: PropTypes.string,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({ ...metabolomicsStatusReportPropType })).isRequired,
};

export default StatusReportMetabolomics;
