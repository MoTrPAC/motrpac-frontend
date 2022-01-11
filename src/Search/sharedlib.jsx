import React from 'react';
import PropTypes from 'prop-types';

export const tissueList = [
  'Adrenal',
  'Brown Adipose',
  'Whole Blood',
  'Colon',
  'Cortex',
  'Gastrocnemius',
  'Heart',
  'Hippocampus',
  'Hypothalamus',
  'Kidney',
  'Liver',
  'Lung',
  'Ovary',
  'Plasma',
  'Small Intestine',
  'Spleen',
  'Testis',
  'Vastus Lateralis',
  'Vena Cava',
  'White Adipose',
];

export const assayList = ['RNA-seq', 'ATAC-seq', 'PROT'];

/**
 * props common to rna-seq, atac-seq, prot-pr,
 * and metabolomic timewise dea results
 */
export const timewiseResultsTablePropType = {
  feature_id: PropTypes.shape({
    raw: PropTypes.string,
  }),
  omic: PropTypes.shape({
    raw: PropTypes.string,
  }),
  assay_name: PropTypes.shape({
    raw: PropTypes.string,
  }),
  tissue_name: PropTypes.shape({
    raw: PropTypes.string,
  }),
  sex: PropTypes.shape({
    raw: PropTypes.string,
  }),
  comparison_group: PropTypes.shape({
    raw: PropTypes.string,
  }),
  covariates: PropTypes.shape({
    raw: PropTypes.string,
  }),
  logfc: PropTypes.shape({
    raw: PropTypes.string,
  }),
  logfc_se: PropTypes.shape({
    raw: PropTypes.string,
  }),
  p_value: PropTypes.shape({
    raw: PropTypes.string,
  }),
  adj_p_value: PropTypes.shape({
    raw: PropTypes.string,
  }),
  comparison_average_intensity: PropTypes.shape({
    raw: PropTypes.string,
  }),
  reference_average_intensity: PropTypes.shape({
    raw: PropTypes.string,
  }),
  selection_fdr: PropTypes.shape({
    raw: PropTypes.string,
  }),
};

/**
 * props common to rna-seq, atac-seq, prot-pr,
 * and metabolomic training dea results
 */
export const trainingResultsTablePropType = {
  feature_id: PropTypes.shape({
    raw: PropTypes.string,
  }),
  omic: PropTypes.shape({
    raw: PropTypes.string,
  }),
  assay_name: PropTypes.shape({
    raw: PropTypes.string,
  }),
  tissue_name: PropTypes.shape({
    raw: PropTypes.string,
  }),
  p_value: PropTypes.shape({
    raw: PropTypes.string,
  }),
  adj_p_value: PropTypes.shape({
    raw: PropTypes.string,
  }),
  p_value_male: PropTypes.shape({
    raw: PropTypes.string,
  }),
  p_value_female: PropTypes.shape({
    raw: PropTypes.string,
  }),
};

// react-table function to filter multiple values in one column
function multipleSelectFilter(rows, id, filterValue) {
  return filterValue.length === 0
    ? rows
    : rows.filter((row) => filterValue.includes(row.values[id]));
}

/**
 * column headers common to rna-seq, atac-seq, pro-pr,
 * and metabolomic timewsie dea results
 */
export const timewiseTableColumns = [
  {
    Header: 'Feature ID',
    accessor: 'feature_id.raw',
  },
  {
    Header: 'Omic',
    accessor: 'omic.raw',
  },
  {
    Header: 'Assay',
    accessor: 'assay_name.raw',
    filter: 'exactText',
  },
  {
    Header: 'Tissue',
    accessor: 'tissue_name.raw',
    filter: 'includes',
  },
  {
    Header: 'Sex',
    accessor: 'sex.raw',
    filter: 'exactText',
  },
  {
    Header: 'Timepoint',
    accessor: 'comparison_group.raw',
    filter: multipleSelectFilter,
  },
  {
    Header: 'Covariates',
    accessor: 'covariates.raw',
  },
  {
    Header: 'logFC',
    accessor: 'logfc.raw',
  },
  {
    Header: 'logFC se',
    accessor: 'logfc_se.raw',
  },
  {
    Header: 'P-Value',
    accessor: 'p_value.raw',
    filter: 'between',
  },
  {
    Header: 'Adj P-Value',
    accessor: 'adj_p_value.raw',
    filter: 'between',
  },
  {
    Header: 'Comparison Average Intensity',
    accessor: 'comparison_average_intensity.raw',
  },
  {
    Header: 'Reference Average Intensity',
    accessor: 'reference_average_intensity.raw',
  },

  {
    Header: 'Selection FDR',
    accessor: 'selection_fdr.raw',
  },
];

/**
 * column headers common to rna-seq, atac-seq, pro-pr,
 * and metabolomic training dea results
 */
export const trainingTableColumns = [
  {
    Header: 'Feature ID',
    accessor: 'feature_id.raw',
  },
  {
    Header: 'Omic',
    accessor: 'omic.raw',
  },
  {
    Header: 'Assay',
    accessor: 'assay_name.raw',
    filter: multipleSelectFilter,
  },
  {
    Header: 'Tissue',
    accessor: 'tissue_name.raw',
    filter: 'exactText',
  },
  {
    Header: 'P-Value',
    accessor: 'p_value.raw',
  },
  {
    Header: 'Adj P-Value',
    accessor: 'adj_p_value.raw',
  },
  {
    Header: 'Male P-Value',
    accessor: 'p_value_male.raw',
  },
  {
    Header: 'Female P-Value',
    accessor: 'p_value_female.raw',
  },
];

/**
 * Global filter rendering function
 * common to timewise DEA results
 */
export const TimewiseGlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;

  return (
    <div className="form-group d-flex align-items-center justify-content-end">
      <label htmlFor="searchFilterInput">Filter:</label>
      <input
        type="text"
        className="form-control global-filter"
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

TimewiseGlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.arrayOf(
    PropTypes.shape({ ...timewiseResultsTablePropType })
  ),
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

TimewiseGlobalFilter.defaultProps = {
  globalFilter: '',
  preGlobalFilteredRows: [],
};

/**
 * Global filter rendering function
 * common to training DEA results
 */
export const TrainingGlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;

  return (
    <div className="form-group d-flex align-items-center justify-content-end">
      <label htmlFor="searchFilterInput">Filter:</label>
      <input
        type="text"
        className="form-control global-filter"
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

TrainingGlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.arrayOf(
    PropTypes.shape({ ...trainingResultsTablePropType })
  ),
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

TrainingGlobalFilter.defaultProps = {
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
