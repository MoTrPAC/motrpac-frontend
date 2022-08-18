import React from 'react';
import PropTypes from 'prop-types';
import roundNumbers from '../../lib/utils/roundNumbers';
import { tissueList, assayList } from '../../lib/searchFilters';

export const geneSearchParamsPropType = {
  ktype: PropTypes.string,
  keys: PropTypes.string,
  omics: PropTypes.string,
  index: PropTypes.string,
  filters: PropTypes.shape({
    assay: PropTypes.arrayOf(PropTypes.string),
    tissue: PropTypes.arrayOf(PropTypes.string),
  }),
  fields: PropTypes.arrayOf(PropTypes.string),
  debug: PropTypes.bool,
  save: PropTypes.bool,
};

/**
 * props common to transcriptomics, proteomics,
 * and metabolomic training dea results
 */
export const geneSearchTrainingResultsTablePropType = {
  gene_symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  feature_ID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tissue: PropTypes.string,
  assay: PropTypes.string,
  p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  adj_p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value_male: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value_female: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export const geneSearchTimewisePlotPropType = {
  gene_symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  feature_ID: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tissue: PropTypes.string,
  assay: PropTypes.string,
  sex: PropTypes.string,
  comparison_group: PropTypes.string,
  logFC: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  logFC_se: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

/**
 * column headers common to transcriptomics and proteomics training DEA data
 */
export const geneSearchTrainingTableColumns = [
  {
    Header: 'Gene',
    accessor: 'gene_symbol',
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
    // Round values
    if (item.p_value && item.p_value.length) {
      const newPVal = roundNumbers(item.p_value, 4);
      item.p_value = newPVal;
    }
    if (item.adj_p_value && item.adj_p_value.length) {
      const newAdjPVal = roundNumbers(item.adj_p_value, 4);
      item.adj_p_value = newAdjPVal;
    }
    if (item.p_value_male && item.p_value_male.length) {
      const newPValMale = roundNumbers(item.p_value_male, 4);
      item.p_value_male = newPValMale;
    }
    if (item.p_value_female && item.p_value_female.length) {
      const newPValFemale = roundNumbers(item.p_value_female, 4);
      item.p_value_female = newPValFemale;
    }
  });
  return tranformArray;
};
