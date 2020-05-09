import React from 'react';
import PropTypes from 'prop-types';

/**
 * props common to rna-seq, rrbs, and atac-seq
 * data qc status reports
*/
const statusReportPropType = {
  cas: PropTypes.string,
  phase: PropTypes.string,
  tissue: PropTypes.string,
  t_name: PropTypes.string,
  seq_flowcell_lane: PropTypes.string,
  version: PropTypes.string,
  sample_category: PropTypes.string,
  sample_count: PropTypes.string,
  dmaqc_valid: PropTypes.string,
};

export default statusReportPropType;

/**
 * column headers common to rna-seq, rrbs, and atac-seq
 * data qc status reports
*/
export const tableColumns = [
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
    Header: 'Seq Flowcell Lane',
    accessor: 'seq_flowcell_lane',
  },
  {
    Header: 'Version',
    accessor: 'version',
  },
  {
    Header: 'Category',
    accessor: 'sample_category',
  },
  {
    Header: 'Sample Count',
    accessor: 'sample_count',
  },
  {
    Header: 'DMAQC',
    accessor: 'dmaqc_valid',
  },
];

/**
 * Global filter rendering function
 * common to all data qc status reports
 */
export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
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
};

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.arrayOf(PropTypes.shape({ ...statusReportPropType })),
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

GlobalFilter.defaultProps = {
  globalFilter: '',
  preGlobalFilteredRows: [],
};

/**
 * page count and page index rendering function
 * common to all data qc status reports
*/
export const PageIndex = ({ pageIndex, pageOptions }) => (
  <span className="page-index">
    Showing Page
    {' '}
    {pageIndex + 1}
    {' '}
    of
    {' '}
    {pageOptions.length}
    {' '}
  </span>
);

PageIndex.propTypes = {
  pageIndex: PropTypes.number,
  pageOptions: PropTypes.arrayOf(PropTypes.number),
};

PageIndex.defaultProps = {
  pageIndex: 0,
  pageOptions: [],
};

/**
 * page size control rendering function
 * common to all data qc status reports
*/
export const PageSize = ({ pageSize, setPageSize, pageSizeOptions }) => (
  <div className="pagination-page-size d-flex align-items-center justify-content-start">
    <label htmlFor="pageSizeSelect">Show:</label>
    <select
      className="form-control"
      id="pageSizeSelect"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
      }}
    >
      {pageSizeOptions.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
    <span>entries</span>
  </div>
);

PageSize.propTypes = {
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
};

/**
 * page navigation control rendering function
 * common to all data qc status reports
*/
export const PageNavigationControl = ({
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  gotoPage,
  pageCount,
}) => (
  <div className="btn-group pagination-navigation-control" role="group">
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${!canPreviousPage ? 'disabled-btn' : ''}`}
      onClick={() => gotoPage(0)}
      disabled={!canPreviousPage}
    >
      First
    </button>
    {' '}
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${!canPreviousPage ? 'disabled-btn' : ''}`}
      onClick={() => previousPage()}
      disabled={!canPreviousPage}
    >
      Previous
    </button>
    {' '}
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${!canNextPage ? 'disabled-btn' : ''}`}
      onClick={() => nextPage()}
      disabled={!canNextPage}
    >
      Next
    </button>
    {' '}
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${!canNextPage ? 'disabled-btn' : ''}`}
      onClick={() => gotoPage(pageCount - 1)}
      disabled={!canNextPage}
    >
      Last
    </button>
  </div>
);

PageNavigationControl.propTypes = {
  canPreviousPage: PropTypes.bool.isRequired,
  canNextPage: PropTypes.bool.isRequired,
  previousPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  gotoPage: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
};
