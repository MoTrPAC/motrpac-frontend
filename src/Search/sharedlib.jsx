import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import roundNumbers from '../lib/utils/roundNumbers';
import {
  sexList,
  randomGroupList,
  tissues,
  assayListRat,
  assayListHuman,
  timepointListRatEndurance,
  timepointListRatAcute,
  timepointListHuman,
} from '../lib/searchFilters';
import { getDataVizURL } from '../lib/utils/dataVizUrl';

export const searchParamsDefaultProps = {
  ktype: 'gene',
  keys: [] || '',
  omics: [],
  study: [],
  analysis: 'all',
  filters: {
    tissue: [],
    assay: [],
    sex: [],
    timepoint: [],
    p_value: { min: '', max: '' },
    adj_p_value: { min: '', max: '' },
    logFC: { min: '', max: '' },
    contrast_type: ['exercise_with_controls', 'acute'],
    must_not: {
      assay: ['epigen-atac-seq', 'epigen-rrbs', 'epigen-methylcap-seq'],
    }
  },
  fields: [
    'gene_symbol',
    'refmet_name',
    'feature_id',
    'tissue',
    'assay',
    'omics',
    'sex',
    'timepoint',
    'logFC',
    'p_value',
    'adj_p_value',
    'contrast1_randomGroupCode',
    'contrast_type',
  ],
  unique_fields: ['tissue', 'omics', 'assay', 'sex', 'timepoint'],
  size: 50,
  start: 0,
  debug: true,
  save: false,
  convert_assay_code: 0,
  convert_tissue_code: 0,
};

export const searchParamsPropType = {
  ktype: PropTypes.string,
  keys: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  omics: PropTypes.arrayOf(PropTypes.string),
  study: PropTypes.arrayOf(PropTypes.string),
  analysis: PropTypes.string,
  filters: PropTypes.shape({
    tissue: PropTypes.arrayOf(PropTypes.string),
    assay: PropTypes.arrayOf(PropTypes.string),
    sex: PropTypes.arrayOf(PropTypes.string),
    timepoint: PropTypes.arrayOf(PropTypes.string),
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
    contrast_type: PropTypes.arrayOf(PropTypes.string),
    must_not: PropTypes.shape({
      assay: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  fields: PropTypes.arrayOf(PropTypes.string),
  unique_fields: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.number,
  start: PropTypes.number,
  debug: PropTypes.bool,
  save: PropTypes.bool,
  convert_assay_code: PropTypes.number,
  convert_tissue_code: PropTypes.number,
};

export const searchResultsTablePropType = {
  gene_symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  refmet_name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  feature_id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tissue: PropTypes.string,
  assay: PropTypes.string,
  sex: PropTypes.string,
  timepoint: PropTypes.string,
  logFC: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  adj_p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  contrast1_randomGroupCode: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  contrast_type: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

/**
 * column headers common to da search results across omes
 */
const commonSearchResultColumns = [
  {
    Header: 'Feature ID',
    accessor: 'feature_id',
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
    Header: 'Sex Stratum',
    accessor: 'sex',
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
        <i
          className="bi bi-info-circle-fill ml-2 text-secondary col-header-info"
          data-tooltip-id="timewise-p-value-tooltip"
          data-tooltip-html="<span>The p-value of the presented log fold change</span>"
          data-tooltip-place="top"
        />
        <Tooltip id="timewise-p-value-tooltip" />
      </div>
    ),
    accessor: 'p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-adj-p-value-col-header">
        <span>Adj p-value</span>
        <i
          className="bi bi-info-circle-fill ml-2 text-secondary col-header-info"
          data-tooltip-id="timewise-adj-p-value-tooltip"
          data-tooltip-html="<span>The FDR adjusted p-value of the presented log fold change</span>"
          data-tooltip-place="top"
        />
        <Tooltip id="timewise-adj-p-value-tooltip" />
      </div>
    ),
    accessor: 'adj_p_value',
    sortType: 'basic',
  },
  {
    Header: 'Exercise Mode',
    // Use contrast1_randomGroupCode for human (precawg), static 'Endurance' for pass1b06, 'Acute' for pass1a06
    accessor: (row) => {
      // Human data (precawg) has valid contrast1_randomGroupCode
      if (row.contrast1_randomGroupCode && row.contrast1_randomGroupCode !== 'NA') {
        return row.contrast1_randomGroupCode;
      }
      // Rat acute (pass1a06) has contrast_type
      if (row.contrast_type && row.contrast_type === 'acute') {
        return 'Acute';
      }
      // Rat endurance (pass1b06) uses comparison_group
      return 'Endurance';
    },
    id: 'exercise_mode',
  },
  {
    Header: 'Timepoint',
    accessor: 'timepoint',
  },
  {
    Header: 'Intervention Effect',
    // Use static 'Pre Training Acute Bout' for precawg and pass1a06 while 'Training' for pass1b06
    accessor: (row) => {
      if (row.contrast_type && row.contrast_type !== 'NA') {
        return 'Pre Training Acute Bout';
      }
      return 'Training';
    },
    id: 'intervention_effect',
  },
];

export const geneResultTableColumns = [
  {
    Header: 'Gene',
    accessor: 'gene_symbol',
  },
  ...commonSearchResultColumns,
];

export const proteinResultTableColumns = [
  {
    Header: 'Protein Name',
    accessor: 'protein_name',
  },
  ...commonSearchResultColumns,
];

export const metaboliteResultTableColumns = [
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-refmet-col-header">
        <span>RefMet Name</span>
        <span className="material-icons col-header-info timewise-refmet-tooltip">
          info
        </span>
        <Tooltip anchorSelect=".timewise-refmet-tooltip" place="right">
          Reference nomenclature for metabolite names
        </Tooltip>
      </div>
    ),
    accessor: 'refmet_name',
    sortType: 'basic',
  },
  ...commonSearchResultColumns,
];

/**
 * Server-side pagination: page count and page index rendering function
 * Uses total, size, and start from API response
 */
export function PageIndex({ total = 0, size = 50, start = 0 }) {
  const pageCount = Math.ceil(total / size) || 1;
  const currentPage = Math.floor(start / size) + 1;

  return (
    <span className="page-index">
      Showing Page
      {' '}
      {currentPage}
      {' '}
      of
      {' '}
      {pageCount}
      {' '}
      ({total.toLocaleString()} total results)
    </span>
  );
}

PageIndex.propTypes = {
  total: PropTypes.number,
  size: PropTypes.number,
  start: PropTypes.number,
};

/**
 * Server-side pagination: page size control rendering function
 * Resets to first page when page size changes
 */
export function PageSize({
  size,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100, 250],
}) {
  return (
    <div className="pagination-page-size d-flex align-items-center justify-content-start">
      <label htmlFor="pageSizeSelect">Show:</label>
      <select
        className="form-control"
        id="pageSizeSelect"
        value={size}
        onChange={(e) => {
          onPageSizeChange(Number(e.target.value));
        }}
      >
        {pageSizeOptions.map((sizeOption) => (
          <option key={sizeOption} value={sizeOption}>
            {sizeOption}
          </option>
        ))}
      </select>
      <span>entries</span>
    </div>
  );
}

PageSize.propTypes = {
  size: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
};

/**
 * Server-side pagination: page navigation control rendering function
 * Calculates page state from total, size, and start
 */
export function PageNavigationControl({
  total = 0,
  size = 50,
  start = 0,
  onPageChange,
}) {
  const pageCount = Math.ceil(total / size) || 1;
  const currentPage = Math.floor(start / size);
  const canPreviousPage = currentPage > 0;
  const canNextPage = currentPage < pageCount - 1;

  const gotoPage = (pageIndex) => {
    const newStart = pageIndex * size;
    onPageChange(newStart);
  };

  const previousPage = () => {
    if (canPreviousPage) {
      gotoPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (canNextPage) {
      gotoPage(currentPage + 1);
    }
  };

  return (
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
      </button>
      {' '}
      <button
        type="button"
        className={`btn btn-sm btn-outline-primary ${
          !canPreviousPage ? 'disabled-btn' : ''
        }`}
        onClick={previousPage}
        disabled={!canPreviousPage}
      >
        Previous
      </button>
      {' '}
      <button
        type="button"
        className={`btn btn-sm btn-outline-primary ${
          !canNextPage ? 'disabled-btn' : ''
        }`}
        onClick={nextPage}
        disabled={!canNextPage}
      >
        Next
      </button>
      {' '}
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
}

PageNavigationControl.propTypes = {
  total: PropTypes.number,
  size: PropTypes.number,
  start: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
};

/** normalize string */
function normalizeString(str) {
  return str
    // Step 1: Capitalize the first letter of the first word
    .replace(/^([a-z])/, (match, firstChar) => firstChar.toUpperCase())
    // Step 2: Replace underscores with spaces
    .replace(/_/g, ' ');
}

/**
 * Utility function to tranform some fields within each object in the array
 */
export const transformData = (arr) => {
  const tranformArray = [...arr];

  // Get precawg data viz base URL
  const dataVizHost = getDataVizURL('human-precovid');
  const dataVizQuerySep = dataVizHost.includes('?') ? '&' : '?';

  tranformArray.forEach((item) => {
    // Determine if the data is human or rat
    const isHumanData = item.contrast1_randomGroupCode && item.contrast1_randomGroupCode !== 'NA';

    if (isHumanData && item.feature_id && item.feature_id.length) {
      const omicsValue = item.omics;
      const newGeneVal = item.gene_symbol;
      const newRefmetName = item.refmet_name;
      const newFeatureId = item.feature_id;
      let featureLink = '';
      // Transform gene values and refmet names for humans
      switch (true) {
        case omicsValue.startsWith('transcriptomics'):
          featureLink = `${dataVizHost}${dataVizQuerySep}tissues=${item.tissue.toLowerCase()}&assays=${item.assay}&ftype=genes&genes=${newGeneVal}&fids=${newFeatureId}`;
          item.gene_symbol = (
            <a
              href={`${dataVizHost}${dataVizQuerySep}query=${newGeneVal}`}
              target="_blank"
              rel="noreferrer"
            >
              {newGeneVal.toUpperCase()}
            </a>
          );
          break;
        case omicsValue.startsWith('proteomics'):
          featureLink = `${dataVizHost}${dataVizQuerySep}tissues=${item.tissue.toLowerCase()}&assays=${item.assay}&ftype=prot&prot=${newFeatureId}&fids=${newFeatureId}`;
          item.gene_symbol = (
            <a
              href={`${dataVizHost}${dataVizQuerySep}query=${newGeneVal}`}
              target="_blank"
              rel="noreferrer"
            >
              {newGeneVal.toUpperCase()}
            </a>
          );
          break;
        case omicsValue.startsWith('metabolomics'):
          featureLink = `${dataVizHost}${dataVizQuerySep}tissues=${item.tissue.toLowerCase()}&assays=${item.assay}&ftype=metab&metab=${encodeURIComponent(newRefmetName)}&fids=${encodeURIComponent(newFeatureId)}`;
          item.refmet_name = (
            <a
              href={`${dataVizHost}${dataVizQuerySep}query=${encodeURIComponent(newRefmetName)}`}
              target="_blank"
              rel="noreferrer"
            >
              {newRefmetName}
            </a>
          );
          break;
        default:
          featureLink = `${dataVizHost}${dataVizQuerySep}tissues=${item.tissue.toLowerCase()}&assays=${item.assay}&ftype=genes&genes=${newGeneVal}&fids=${newFeatureId}`;
          item.gene_symbol = (
            <a
              href={`${dataVizHost}${dataVizQuerySep}query=${newGeneVal}`}
              target="_blank"
              rel="noreferrer"
            >
              {newGeneVal.toUpperCase()}
            </a>
          );
          break;
      }
      // Transform feature_id values into links
      item.feature_id = (
        <a
          href={featureLink}
          target="_blank"
          rel="noreferrer"
        >
          {newFeatureId}
        </a>
      );
    } else if (item.gene_symbol && item.gene_symbol.length) {
      // Transform gene values for rats
      const newGeneVal = item.gene_symbol;
      item.gene_symbol = (
        <a
          href={`https://cfdeknowledge.org/r/kc_entity_gene?entity=gene&gene=${newGeneVal.toUpperCase()}`}
          target="_blank"
          rel="noreferrer"
        >
          {newGeneVal.toUpperCase()}
        </a>
      );
    }
    // Transform assay values
    if (item.assay && item.assay.length && item.contrast1_randomGroupCode && item.contrast1_randomGroupCode !== 'NA') {
      const matchedAssay = assayListHuman.find(
        (filter) => filter.filter_value === item.assay
      );
      item.assay = matchedAssay ? matchedAssay.filter_label : item.assay;
    } else if (item.assay && item.assay.length) {
      const matchedAssay = assayListRat.find(
        (filter) => filter.filter_value === item.assay
      );
      item.assay = matchedAssay ? matchedAssay.filter_label : item.assay;
    }
    // Transform tissue values
    if (item.tissue && item.tissue.length && item.contrast1_randomGroupCode && item.contrast1_randomGroupCode !== 'NA') {
      const matchedTissue = tissues.find(
        (filter) => filter.filter_value === item.tissue
      );
      item.tissue = matchedTissue ? matchedTissue.filter_label : (item.tissue === 'plasma' || item.tissue === 'blood-rna' ? 'Blood' : item.tissue);
    } else if (item.tissue && item.tissue.length) {
      const matchedTissue = tissues.find(
        (filter) => filter.filter_value === item.tissue
      );
      item.tissue = matchedTissue ? matchedTissue.filter_label : item.tissue;
    }
    // Transform randomGroupCode values
    if (item.contrast1_randomGroupCode && item.contrast1_randomGroupCode.length) {
      const matchedRnadomGroupCode = randomGroupList.find(
        (filter) => filter.filter_value.toLowerCase() === item.contrast1_randomGroupCode,
      );
      item.contrast1_randomGroupCode = matchedRnadomGroupCode ? matchedRnadomGroupCode.filter_label
        : item.contrast1_randomGroupCode;
    }
    // Transform timepoint values
    if (item.timepoint && item.timepoint.length) {
      const matchedTimepoint = [...timepointListRatEndurance, ...timepointListHuman, ...timepointListRatAcute].find(
        (filter) => filter.filter_value === item.timepoint,
      );
      item.timepoint = matchedTimepoint ? matchedTimepoint.filter_label : item.timepoint;
    }
    // Transform sex values
    if (item.sex && item.sex.length) {
      const matchedSex = sexList.find(
        (filter) => filter.filter_value.toLowerCase() === item.sex.toLowerCase()
      );
      item.sex = matchedSex ? matchedSex.filter_label : 'None';
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
  });
  return tranformArray;
};
