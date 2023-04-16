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
  analysis: 'all',
  filters: {
    tissue: [],
    assay: [],
    sex: [],
    comparison_group: [],
    p_value: { min: '', max: '' },
    adj_p_value: { min: '', max: '' },
    logFC: { min: '', max: '' },
  },
  fields: [
    'gene_symbol',
    'metabolite',
    'feature_ID',
    'tissue',
    'assay',
    'sex',
    'comparison_group',
    'logFC',
    'p_value',
    'adj_p_value',
    'selection_fdr',
    'p_value_male',
    'p_value_female',
  ],
  unique_fields: ['tissue', 'assay', 'sex', 'comparison_group'],
  size: 25000,
  start: 0,
  debug: true,
  save: false,
};

export const searchParamsPropType = {
  ktype: PropTypes.string,
  keys: PropTypes.string,
  omics: PropTypes.string,
  analysis: PropTypes.string,
  filters: PropTypes.shape({
    tissue: PropTypes.arrayOf(PropTypes.string),
    assay: PropTypes.arrayOf(PropTypes.string),
    sex: PropTypes.arrayOf(PropTypes.string),
    comparison_group: PropTypes.arrayOf(PropTypes.string),
    p_value: PropTypes.shape({
      min: PropTypes.string,
      max: PropTypes.string,
    }),
    adj_p_value: PropTypes.shape({
      min: PropTypes.string,
      max: PropTypes.string,
    }),
    logFC: PropTypes.shape({
      min: PropTypes.string,
      max: PropTypes.string,
    }),
  }),
  fields: PropTypes.arrayOf(PropTypes.string),
  unique_fields: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.number,
  start: PropTypes.number,
  debug: PropTypes.bool,
  save: PropTypes.bool,
};

/**
 * props common to transcriptomics, proteomics,
 * and metabolomic timewise dea results
 */
export const timewiseResultsTablePropType = {
  gene_symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  metabolite: PropTypes.string,
  feature_ID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tissue: PropTypes.string,
  assay: PropTypes.string,
  sex: PropTypes.string,
  comparison_group: PropTypes.string,
  logFC: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  adj_p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selection_fdr: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

/**
 * props common to transcriptomics, proteomics,
 * and metabolomic training dea results
 */
export const trainingResultsTablePropType = {
  gene_symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  metabolite: PropTypes.string,
  feature_ID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tissue: PropTypes.string,
  assay_name: PropTypes.string,
  p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  adj_p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value_male: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value_female: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// react-table function to filter multiple values in one column
/*
function multipleSelectFilter(rows, id, filterValue) {
  return filterValue.length === 0
    ? rows
    : rows.filter((row) => filterValue.includes(row.values[id]));
}
*/

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
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-p-value-col-header">
        <span>P-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="timewise-p-value-tooltip">
          The p-value of the presented log fold change
          <i />
        </span>
      </div>
    ),
    accessor: 'p_value',
    sortType: 'basic',
    // filter: 'between',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-adj-p-value-col-header">
        <span>Adj p-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="timewise-adj-p-value-tooltip">
          The FDR adjusted p-value of the presented log-fold change
          <i />
        </span>
      </div>
    ),
    accessor: 'adj_p_value',
    sortType: 'basic',
    // filter: 'between',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-selection-fdr-col-header">
        <span>Selection FDR</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="timewise-selection-fdr-tooltip">
          Cross-tissue, IHW FDR adjusted p-value
          <i />
        </span>
      </div>
    ),
    accessor: 'selection_fdr',
    sortType: 'basic',
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
    accessor: 'assay',
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
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-p-value-col-header">
        <span>P-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="timewise-p-value-tooltip">
          The p-value of the presented log fold change
          <i />
        </span>
      </div>
    ),
    accessor: 'p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-adj-p-value-col-header">
        <span>Adj p-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="timewise-adj-p-value-tooltip">
          The FDR adjusted p-value of the presented log-fold change
          <i />
        </span>
      </div>
    ),
    accessor: 'adj_p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-selection-fdr-col-header">
        <span>Selection FDR</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="timewise-selection-fdr-tooltip">
          Cross-tissue, IHW FDR adjusted p-value
          <i />
        </span>
      </div>
    ),
    accessor: 'selection_fdr',
    sortType: 'basic',
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
    Header: () => (
      <div className="d-flex align-items-center training-p-value-col-header">
        <span>P-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="training-p-value-tooltip">
          Combined p-value (males and females)
          <i />
        </span>
      </div>
    ),
    accessor: 'p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-adj-p-value-col-header">
        <span>Adj p-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="training-adj-p-value-tooltip">
          FDR-adjusted combined p-value
          <i />
        </span>
      </div>
    ),
    accessor: 'adj_p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-male-p-value-col-header">
        <span>Male p-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="training-male-p-value-tooltip">
          Training effect p-value, male data
          <i />
        </span>
      </div>
    ),
    accessor: 'p_value_male',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-female-p-value-col-header">
        <span>Female p-value</span>
        <span className="material-icons col-header-info">info</span>
        <span
          className="tooltip-on-bottom"
          id="training-female-p-value-tooltip"
        >
          Training effect p-value, female data
          <i />
        </span>
      </div>
    ),
    accessor: 'p_value_female',
    sortType: 'basic',
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
    accessor: 'assay',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-p-value-col-header">
        <span>P-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="training-p-value-tooltip">
          Combined p-value (males and females)
          <i />
        </span>
      </div>
    ),
    accessor: 'p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-adj-p-value-col-header">
        <span>Adj p-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="training-adj-p-value-tooltip">
          FDR-adjusted combined p-value
          <i />
        </span>
      </div>
    ),
    accessor: 'adj_p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-male-p-value-col-header">
        <span>Male p-value</span>
        <span className="material-icons col-header-info">info</span>
        <span className="tooltip-on-bottom" id="training-male-p-value-tooltip">
          Training effect p-value, male data
          <i />
        </span>
      </div>
    ),
    accessor: 'p_value_male',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-female-p-value-col-header">
        <span>Female p-value</span>
        <span className="material-icons col-header-info">info</span>
        <span
          className="tooltip-on-bottom"
          id="training-female-p-value-tooltip"
        >
          Training effect p-value, female data
          <i />
        </span>
      </div>
    ),
    accessor: 'p_value_female',
    sortType: 'basic',
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
    Showing Page {pageIndex + 1} of {pageOptions.length}
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
      className={`btn btn-sm btn-outline-primary ${
        !canPreviousPage ? 'disabled-btn' : ''
      }`}
      onClick={() => gotoPage(0)}
      disabled={!canPreviousPage}
    >
      First
    </button>{' '}
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${
        !canPreviousPage ? 'disabled-btn' : ''
      }`}
      onClick={() => previousPage()}
      disabled={!canPreviousPage}
    >
      Previous
    </button>{' '}
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${
        !canNextPage ? 'disabled-btn' : ''
      }`}
      onClick={() => nextPage()}
      disabled={!canNextPage}
    >
      Next
    </button>{' '}
    <button
      type="button"
      className={`btn btn-sm btn-outline-primary ${
        !canNextPage ? 'disabled-btn' : ''
      }`}
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
    if (item.gene_symbol && item.gene_symbol.length) {
      const newGeneVal = item.gene_symbol;
      item.gene_symbol = (
        <a
          href={`https://www.ncbi.nlm.nih.gov/gene/?term=${newGeneVal.toLowerCase()}`}
          target="_blank"
          rel="noreferrer"
        >
          {newGeneVal.toUpperCase()}
        </a>
      );
    }
    // Transform protein id values
    /*
    if (item.assay.match(/protein|proteomics|prot-/i)) {
      const newProteinVal = item.feature_ID;
      item.feature_ID = (
        <a
          href={`https://www.ncbi.nlm.nih.gov/protein/${newProteinVal}`}
          target="_blank"
          rel="noreferrer"
        >
          {newProteinVal}
        </a>
      );
    } else if (item.assay.match(/transcript-rna-seq/i)) {
      const newFidVal = item.feature_ID;
      item.feature_ID = (
        <a
          href={`http://uswest.ensembl.org/Rattus_norvegicus/Gene/Idhistory?g=${newFidVal}`}
          target="_blank"
          rel="noreferrer"
        >
          {newFidVal}
        </a>
      );
    }
    */
    // Transform tissue values
    if (item.tissue && item.tissue.length) {
      const matchedTissue = tissueList.find(
        (filter) => filter.filter_value === item.tissue
      );
      item.tissue = matchedTissue && matchedTissue.filter_label;
    }
    // Transform assay values
    if (item.assay && item.assay.length) {
      const matchedAssay = assayList.find(
        (filter) => filter.filter_value === item.assay
      );
      item.assay = matchedAssay && matchedAssay.filter_label;
    }
    // Transform sex values
    if (item.sex && item.sex.length) {
      const matchedSex = sexList.find(
        (filter) => filter.filter_value.toLowerCase() === item.sex
      );
      item.sex = matchedSex && matchedSex.filter_label;
    }
    // Transform timepoint values
    if (item.comparison_group && item.comparison_group.length) {
      const matchedTimepoint = timepointList.find(
        (filter) => filter.filter_value === item.comparison_group
      );
      item.comparison_group = matchedTimepoint && matchedTimepoint.filter_label;
    }
    // Round values
    if (item.p_value && item.p_value.length && item.p_value !== 'NA') {
      const newPVal = roundNumbers(item.p_value, 4);
      item.p_value = newPVal;
    }
    if (
      item.adj_p_value &&
      item.adj_p_value.length &&
      item.adj_p_value !== 'NA'
    ) {
      const newAdjPVal = roundNumbers(item.adj_p_value, 4);
      item.adj_p_value = newAdjPVal;
    }
    if (item.logFC && item.logFC.length && item.logFC !== 'NA') {
      const logFCVal = roundNumbers(item.logFC, 4);
      item.logFC = logFCVal;
    }
    if (
      item.selection_fdr &&
      item.selection_fdr.length &&
      item.selection_fdr !== 'NA'
    ) {
      const newSelFdrVal = roundNumbers(item.selection_fdr, 4);
      item.selection_fdr = newSelFdrVal;
    }
    if (
      item.p_value_male &&
      item.p_value_male.length &&
      item.p_value_male !== 'NA'
    ) {
      const newPValMale = roundNumbers(item.p_value_male, 4);
      item.p_value_male = newPValMale;
    }
    if (
      item.p_value_female &&
      item.p_value_female.length &&
      item.p_value_female !== 'NA'
    ) {
      const newPValFemale = roundNumbers(item.p_value_female, 4);
      item.p_value_female = newPValFemale;
    }
  });
  return tranformArray;
};
