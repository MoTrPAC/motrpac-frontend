import React from 'react';
import PropTypes from 'prop-types';
import roundNumbers from '../lib/utils/roundNumbers';
import {
  tissueList,
  assayList,
  sexList,
  timepointList,
} from '../lib/searchFilters';

export const searchParamsDefaultProps = {
  ktype: 'gene',
  keys: '',
  omics: 'all',
  filters: {
    tissue: '',
    assay: '',
    sex: '',
    comparison_group: '',
    p_value: [],
    adj_p_value: [],
    logFC: [],
  },
  debug: true,
  save: true,
};

export const searchParamsPropType = {
  ktype: PropTypes.string,
  keys: PropTypes.string,
  omics: PropTypes.string,
  filters: PropTypes.shape({
    tissue: PropTypes.string,
    assay: PropTypes.string,
    sex: PropTypes.string,
    comparison_group: PropTypes.string,
    p_value: PropTypes.arrayOf(PropTypes.string),
    adj_p_value: PropTypes.arrayOf(PropTypes.string),
    logFC: PropTypes.arrayOf(PropTypes.string),
  }),
  debug: PropTypes.bool,
  save: PropTypes.bool,
};

/**
 * props common to transcriptomics, proteomics,
 * and metabolomic timewise dea results
 */
export const timewiseResultsTablePropType = {
  gene_symbol: PropTypes.string,
  metabolite: PropTypes.string,
  dataset: PropTypes.string,
  feature_ID: PropTypes.string,
  tissue: PropTypes.string,
  assay: PropTypes.string,
  sex: PropTypes.string,
  comparison_group: PropTypes.string,
  logFC: PropTypes.string,
  p_value: PropTypes.string,
  adj_p_value: PropTypes.string,
  selection_fdr: PropTypes.string,
};

/**
 * props common to transcriptomics, proteomics,
 * and metabolomic training dea results
 */
export const trainingResultsTablePropType = {
  gene_symbol: PropTypes.string,
  metabolite: PropTypes.string,
  dataset: PropTypes.string,
  feature_ID: PropTypes.string,
  tissue: PropTypes.string,
  assay_name: PropTypes.string,
  p_value: PropTypes.string,
  adj_p_value: PropTypes.string,
  p_value_male: PropTypes.string,
  p_value_female: PropTypes.string,
};

// react-table function to filter multiple values in one column
function multipleSelectFilter(rows, id, filterValue) {
  return filterValue.length === 0
    ? rows
    : rows.filter((row) => filterValue.includes(row.values[id]));
}

/**
 * column headers common to transcriptomics, proteomics,
 * and metabolomic timewise dea results
 */
export const timewiseTableColumns = [
  {
    Header: 'Gene',
    accessor: 'gene_symbol',
  },
  {
    Header: 'Feature ID',
    accessor: 'feature_ID',
  },
  /*
  {
    Header: 'Omic',
    accessor: 'omic.raw',
    filter: multipleSelectFilter,
  },
  */
  {
    Header: 'Tissue',
    accessor: 'tissue',
    // filter: 'exactText',
  },
  {
    Header: 'Assay',
    accessor: 'assay',
    // filter: 'exactText',
  },

  {
    Header: 'Sex',
    accessor: 'sex',
    // filter: 'exactText',
  },
  {
    Header: 'Timepoint',
    accessor: 'comparison_group',
    // filter: multipleSelectFilter,
  },
  {
    Header: 'logFC',
    accessor: 'logFC',
  },
  {
    Header: 'P-Value',
    accessor: 'p_value',
    // filter: 'between',
  },
  {
    Header: 'Adj P-Value',
    accessor: 'adj_p_value',
    // filter: 'between',
  },
  {
    Header: 'Selection FDR',
    accessor: 'selection_fdr',
  },
];

export const metabTimewiseTableColumns = [
  {
    Header: 'Metabolite',
    accessor: 'metabolite',
  },
  {
    Header: 'Feature ID',
    accessor: 'feature_ID',
  },
  {
    Header: 'Tissue',
    accessor: 'tissue',
  },
  {
    Header: 'Assay',
    accessor: 'dataset',
  },
  {
    Header: 'Sex',
    accessor: 'sex',
  },
  {
    Header: 'Timepoint',
    accessor: 'comparison_group',
  },
  {
    Header: 'logFC',
    accessor: 'logFC',
  },
  {
    Header: 'P-Value',
    accessor: 'p_value',
  },
  {
    Header: 'Adj P-Value',
    accessor: 'adj_p_value',
  },
  {
    Header: 'Selection FDR',
    accessor: 'selection_fdr',
  },
];

/**
 * column headers common to transcriptomics, proteomics,
 * and metabolomic training dea results
 */
export const trainingTableColumns = [
  {
    Header: 'Gene',
    accessor: 'gene_symbol',
  },
  {
    Header: 'Feature ID',
    accessor: 'feature_ID',
  },
  /*
  {
    Header: 'Omic',
    accessor: 'omic.raw',
    filter: multipleSelectFilter,
  },
  */
  {
    Header: 'Tissue',
    accessor: 'tissue',
    // filter: 'exactText',
  },
  {
    Header: 'Assay',
    accessor: 'assay',
    // filter: multipleSelectFilter,
  },
  {
    Header: 'P-Value',
    accessor: 'p_value',
  },
  {
    Header: 'Adj P-Value',
    accessor: 'adj_p_value',
  },
  {
    Header: 'Male P-Value',
    accessor: 'p_value_male',
  },
  {
    Header: 'Female P-Value',
    accessor: 'p_value_female',
  },
];

export const metabTrainingTableColumns = [
  {
    Header: 'Metabolite',
    accessor: 'metabolite',
  },
  {
    Header: 'Feature ID',
    accessor: 'feature_ID',
  },
  {
    Header: 'Tissue',
    accessor: 'tissue',
  },
  {
    Header: 'Assay',
    accessor: 'dataset',
  },
  {
    Header: 'P-Value',
    accessor: 'p_value',
  },
  {
    Header: 'Adj P-Value',
    accessor: 'adj_p_value',
  },
  {
    Header: 'Male P-Value',
    accessor: 'p_value_male',
  },
  {
    Header: 'Female P-Value',
    accessor: 'p_value_female',
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

/**
 * Utility function to tranform some fields within each object in the array
 */
export const transformData = (arr) => {
  const tranformArray = [...arr];

  tranformArray.forEach((item) => {
    // Transform gene values
    if (item.gene_symbol !== null && item.gene_symbol !== undefined) {
      const newGeneVal = item.gene_symbol;
      item.gene_symbol = newGeneVal.toUpperCase();
    }
    // Transform metabolomics dataset (aka assay) values
    if (item.dataset !== null && item.dataset !== undefined) {
      const matchedDataset = assayList.find(
        (filter) => filter.filter_value === item.dataset
      );
      item.dataset = matchedDataset && matchedDataset.filter_label;
    }
    // Transform tissue values
    if (item.tissue !== null && item.tissue !== undefined) {
      const matchedTissue = tissueList.find(
        (filter) => filter.filter_value === item.tissue
      );
      item.tissue = matchedTissue && matchedTissue.filter_label;
    }
    // Transform assay values
    if (item.assay !== null && item.assay !== undefined) {
      const matchedAssay = assayList.find(
        (filter) => filter.filter_value === item.assay
      );
      item.assay = matchedAssay && matchedAssay.filter_label;
    }
    // Transform sex values
    if (item.sex !== null && item.sex !== undefined) {
      const matchedSex = sexList.find(
        (filter) => filter.filter_value.toLowerCase() === item.sex
      );
      item.sex = matchedSex.filter_label;
    }
    // Transform timepoint values
    if (item.comparison_group !== null && item.comparison_group !== undefined) {
      const matchedTimepoint = timepointList.find(
        (filter) => filter.filter_value === item.comparison_group
      );
      item.comparison_group = matchedTimepoint.filter_label;
    }
    // Round values
    if (item.p_value !== null && item.p_value !== undefined) {
      const newPVal = roundNumbers(item.p_value, 4);
      item.p_value = newPVal && newPVal.toString();
    }
    if (item.adj_p_value !== null && item.adj_p_value !== undefined) {
      const newAdjPVal = roundNumbers(item.adj_p_value, 4);
      item.adj_p_value = newAdjPVal && newAdjPVal.toString();
    }
    if (item.logFC !== null && item.logFC !== undefined) {
      const logFCVal = roundNumbers(item.logFC, 4);
      item.logFC = logFCVal && logFCVal.toString();
    }
    if (item.selection_fdr !== null && item.selection_fdr !== undefined) {
      const newSelFdrVal = roundNumbers(item.selection_fdr, 4);
      item.selection_fdr = newSelFdrVal && newSelFdrVal.toString();
    }
    if (item.p_value_male !== null && item.p_value_male !== undefined) {
      const newPValMale = roundNumbers(item.p_value_male, 4);
      item.p_value_male = newPValMale && newPValMale.toString();
    }
    if (item.p_value_female !== null && item.p_value_female !== undefined) {
      const newPValFemale = roundNumbers(item.p_value_female, 4);
      item.p_value_female = newPValFemale && newPValFemale.toString();
    }
  });
  return tranformArray;
};
