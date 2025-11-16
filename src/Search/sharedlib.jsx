import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import roundNumbers from '../lib/utils/roundNumbers';
import {
  sexList,
  randomGroupList,
  tissueListRatEndurance,
  tissueListRatAcute,
  tissueListHuman,
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
  omics: 'all',
  species: 'rat',
  study: 'pass1b06',
  analysis: 'all',
  filters: {
    tissue: [],
    assay: [],
    sex: [],
    comparison_group: [],
    contrast1_timepoint: [],
    p_value: { min: '', max: '' },
    adj_p_value: { min: '', max: '' },
    logFC: { min: '', max: '' },
  },
  fields: [
    'gene_symbol',
    'metabolite_refmet',
    'refmet_name',
    'feature_ID',
    'feature_id',
    'tissue',
    'assay',
    'omics',
    'sex',
    'comparison_group',
    'logFC',
    'p_value',
    'adj_p_value',
    'selection_fdr',
    'p_value_male',
    'p_value_female',
    'contrast1_randomGroupCode',
    'contrast1_timepoint',
    'contrast_type',
    'contrast',
  ],
  unique_fields: ['tissue', 'assay', 'sex', 'comparison_group', 'contrast1_timepoint'],
  size: 10000,
  start: 0,
  debug: true,
  save: false,
  convert_assay_code: 0,
  convert_tissue_code: 0,
};

export const searchParamsPropType = {
  ktype: PropTypes.string,
  keys: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  omics: PropTypes.string,
  species: PropTypes.string,
  study: PropTypes.string,
  analysis: PropTypes.string,
  filters: PropTypes.shape({
    tissue: PropTypes.arrayOf(PropTypes.string),
    assay: PropTypes.arrayOf(PropTypes.string),
    sex: PropTypes.arrayOf(PropTypes.string),
    comparison_group: PropTypes.arrayOf(PropTypes.string),
    contrast1_timepoint: PropTypes.arrayOf(PropTypes.string),
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
  convert_assay_code: PropTypes.number,
  convert_tissue_code: PropTypes.number,
};

/**
 * props common to transcriptomics, proteomics,
 * and metabolomic timewise dea results
 */
export const timewiseResultsTablePropType = {
  gene_symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  protein_name: PropTypes.string,
  metabolite_refmet: PropTypes.string,
  feature_id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
  protein_name: PropTypes.string,
  metabolite_refmet: PropTypes.string,
  feature_id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tissue: PropTypes.string,
  assay_name: PropTypes.string,
  p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  adj_p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value_male: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value_female: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export const ratsAcuteResultsTablePropType = {
  gene_symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  protein_name: PropTypes.string,
  refmet_name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  feature_id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tissue: PropTypes.string,
  assay: PropTypes.string,
  omics: PropTypes.string,
  logFC: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  adj_p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  contrast1_timepoint: PropTypes.string,
  contrast_type: PropTypes.string,
};

export const humanResultsTablePropType = {
  gene_symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  refmet_name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  feature_id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tissue: PropTypes.string,
  assay: PropTypes.string,
  omics: PropTypes.string,
  logFC: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  adj_p_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  contrast1_randomGroupCode: PropTypes.string,
  contrast1_timepoint: PropTypes.string,
  contrast_type: PropTypes.string,
};

/**
 * column headers common to transcriptomics, proteomics,
 * and metabolomic timewise dea results
 */
const commonTimewiseColumns = [
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
        <span className="material-icons col-header-info timewise-p-value-tooltip">
          info
        </span>
        <Tooltip anchorSelect=".timewise-p-value-tooltip" place="left">
          The p-value of the presented log fold change
        </Tooltip>
      </div>
    ),
    accessor: 'p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-adj-p-value-col-header">
        <span>Adj p-value</span>
        <span className="material-icons col-header-info timewise-adj-p-value-tooltip">
          info
        </span>
        <Tooltip anchorSelect=".timewise-adj-p-value-tooltip" place="left">
          The FDR adjusted p-value of the presented log-fold change
        </Tooltip>
      </div>
    ),
    accessor: 'adj_p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center timewise-selection-fdr-col-header">
        <span>Selection FDR</span>
        <span className="material-icons col-header-info timewise-selection-fdr-tooltip">
          info
        </span>
        <Tooltip anchorSelect=".timewise-selection-fdr-tooltip" place="left">
          Cross-tissue, IHW FDR adjusted p-value
        </Tooltip>
      </div>
    ),
    accessor: 'selection_fdr',
    sortType: 'basic',
  },
];

export const timewiseTableColumns = [
  {
    Header: 'Gene',
    accessor: 'gene_symbol',
  },
  ...commonTimewiseColumns,
];

export const proteinTimewiseTableColumns = [
  {
    Header: 'Protein',
    accessor: 'protein_name',
  },
  ...commonTimewiseColumns,
];

export const metabTimewiseTableColumns = [
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
  ...commonTimewiseColumns,
];

/**
 * column headers common to transcriptomics, proteomics,
 * and metabolomic training dea results
 */
const commonTrainingColumns = [
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
    Header: () => (
      <div className="d-flex align-items-center training-p-value-col-header">
        <span>P-value</span>
        <span className="material-icons col-header-info training-p-value-tooltip">
          info
        </span>
        <Tooltip anchorSelect=".training-p-value-tooltip" place="left">
          Combined p-value (males and females)
        </Tooltip>
      </div>
    ),
    accessor: 'p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-adj-p-value-col-header">
        <span>Adj p-value</span>
        <span className="material-icons col-header-info training-adj-p-value-tooltip">
          info
        </span>
        <Tooltip anchorSelect=".training-adj-p-value-tooltip" place="left">
          FDR-adjusted combined p-value
        </Tooltip>
      </div>
    ),
    accessor: 'adj_p_value',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-male-p-value-col-header">
        <span>Male p-value</span>
        <span className="material-icons col-header-info training-male-p-value-tooltip">
          info
        </span>
        <Tooltip anchorSelect=".training-male-p-value-tooltip" place="left">
          Training effect p-value, male data
        </Tooltip>
      </div>
    ),
    accessor: 'p_value_male',
    sortType: 'basic',
  },
  {
    Header: () => (
      <div className="d-flex align-items-center training-female-p-value-col-header">
        <span>Female p-value</span>
        <span className="material-icons col-header-info training-female-p-value-tooltip">
          info
        </span>
        <Tooltip anchorSelect=".training-female-p-value-tooltip" place="left">
          Training effect p-value, female data
        </Tooltip>
      </div>
    ),
    accessor: 'p_value_female',
    sortType: 'basic',
  },
];

export const trainingTableColumns = [
  {
    Header: 'Gene',
    accessor: 'gene_symbol',
  },
  ...commonTrainingColumns,
];

export const proteinTrainingTableColumns = [
  {
    Header: 'Protein',
    accessor: 'protein_name',
  },
  ...commonTrainingColumns,
];

export const metabTrainingTableColumns = [
  {
    Header: () => (
      <div className="d-flex align-items-center training-refmet-col-header">
        <span>RefMet Name</span>
        <span className="material-icons col-header-info training-refmet-tooltip">
          info
        </span>
        <Tooltip anchorSelect=".training-refmet-tooltip" place="right">
          Reference nomenclature for metabolite names
        </Tooltip>
      </div>
    ),
    accessor: 'refmet_name',
    sortType: 'basic',
  },
  ...commonTrainingColumns,
];

/**
 * column headers common to rats acute exercise gene and metabolite search results
 */
const commonRatsAcuteColumns = [
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
    Header: 'Sex',
    accessor: 'sex',
  },
  {
    Header: 'logFC',
    accessor: 'logFC',
    sortType: 'basic',
  },
  {
    Header: 'P-value',
    accessor: 'p_value',
    sortType: 'basic',
  },
  {
    Header: 'Adj p-value',
    accessor: 'adj_p_value',
    sortType: 'basic',
  },
  {
    Header: 'Timepoint',
    accessor: 'contrast1_timepoint',
  },
  {
    Header: 'Type',
    accessor: 'contrast_type',
  },
];

export const geneRatsAcuteTableColumns = [
  {
    Header: 'Gene',
    accessor: 'gene_symbol',
  },
  ...commonRatsAcuteColumns,
];

export const proteinRatsAcuteTableColumns = [
  {
    Header: 'Protein Name',
    accessor: 'protein_name',
  },
  ...commonRatsAcuteColumns,
];

export const metabRatsAcuteTableColumns = [
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
  ...commonRatsAcuteColumns,
];

/**
 * column headers common to human gene and metabolite search results
 */
const commonHumanColumns = [
  {
    Header: 'Tissue',
    accessor: 'tissue',
  },
  {
    Header: 'Assay',
    accessor: 'assay',
  },
  {
    Header: 'logFC',
    accessor: 'logFC',
    sortType: 'basic',
  },
  {
    Header: 'P-value',
    accessor: 'p_value',
    sortType: 'basic',
  },
  {
    Header: 'Adj p-value',
    accessor: 'adj_p_value',
    sortType: 'basic',
  },
  {
    Header: 'Randomized Group',
    accessor: 'contrast1_randomGroupCode',
  },
  {
    Header: 'Timepoint',
    accessor: 'contrast1_timepoint',
  },
  {
    Header: 'Type',
    accessor: 'contrast_type',
  },
];

export const geneHumanTableColumns = [
  {
    Header: 'Gene',
    accessor: 'gene_symbol',
  },
  {
    Header: 'Feature ID',
    accessor: 'feature_id',
  },
  ...commonHumanColumns,
];

export const proteinHumanTableColumns = [
  {
    Header: 'Gene',
    accessor: 'gene_symbol',
  },
  {
    Header: 'Protein ID',
    accessor: 'feature_id',
  },
  ...commonHumanColumns,
];

export const metaboliteHumanTableColumns = [
  {
    Header: 'RefMet Name',
    accessor: 'refmet_name',
  },
  {
    Header: 'Feature ID',
    accessor: 'feature_id',
  },
  ...commonHumanColumns,
];

/**
 * page count and page index rendering function
 * common to all data qc status reports
 */
export function PageIndex({ pageIndex = 0, pageOptions = [] }) {
  return (
    <span className="page-index">
      Showing Page
      {' '}
      {pageIndex + 1}
      {' '}
      of
      {' '}
      {pageOptions.length}
    </span>
  );
}

PageIndex.propTypes = {
  pageIndex: PropTypes.number,
  pageOptions: PropTypes.arrayOf(PropTypes.number),
};

/**
 * page size control rendering function
 * common to all data qc status reports
 */
export function PageSize({ pageSize, setPageSize, pageSizeOptions }) {
  return (
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
}

PageSize.propTypes = {
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
};

/**
 * page navigation control rendering function
 * common to all data qc status reports
 */
export function PageNavigationControl({
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  gotoPage,
  pageCount,
}) {
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
        onClick={() => previousPage()}
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
        onClick={() => nextPage()}
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
  canPreviousPage: PropTypes.bool.isRequired,
  canNextPage: PropTypes.bool.isRequired,
  previousPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  gotoPage: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
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

  // Get precawg data viz URL
  const dataVizHost = getDataVizURL('human-precovid');

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
          featureLink = `${dataVizHost}tissues=${item.tissue.toLowerCase()}&assays=${item.assay}&ftype=genes&genes=${newGeneVal}&fids=${newFeatureId}`;
          item.gene_symbol = (
            <a
              href={`${dataVizHost}query=${newGeneVal}`}
              target="_blank"
              rel="noreferrer"
            >
              {newGeneVal.toUpperCase()}
            </a>
          );
          break;
        case omicsValue.startsWith('proteomics'):
          featureLink = `${dataVizHost}tissues=${item.tissue.toLowerCase()}&assays=${item.assay}&ftype=prot&prot=${newFeatureId}&fids=${newFeatureId}`;
          item.gene_symbol = (
            <a
              href={`${dataVizHost}query=${newGeneVal}`}
              target="_blank"
              rel="noreferrer"
            >
              {newGeneVal.toUpperCase()}
            </a>
          );
          break;
        case omicsValue.startsWith('metabolomics'):
          featureLink = `${dataVizHost}tissues=${item.tissue.toLowerCase()}&assays=${item.assay}&ftype=metab&metab=${encodeURIComponent(newRefmetName)}&fids=${encodeURIComponent(newFeatureId)}`;
          item.refmet_name = (
            <a
              href={`${dataVizHost}query=${encodeURIComponent(newRefmetName)}`}
              target="_blank"
              rel="noreferrer"
            >
              {newRefmetName}
            </a>
          );
          break;
        default:
          featureLink = `${dataVizHost}tissues=${item.tissue.toLowerCase()}&assays=${item.assay}&ftype=genes&genes=${newGeneVal}&fids=${newFeatureId}`;
          item.gene_symbol = (
            <a
              href={`${dataVizHost}query=${newGeneVal}`}
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
      const matchedTissue = tissueListHuman.find(
        (filter) => filter.filter_value === item.tissue
      );
      item.tissue = matchedTissue ? matchedTissue.filter_label : (item.tissue === 'plasma' || item.tissue === 'blood-rna' ? 'Blood' : item.tissue);
    } else if (item.tissue && item.tissue.length) {
      const tissueList = item.contrast1_timepoint && item.contrast1_timepoint !== 'NA'
        ? tissueListRatAcute
        : tissueListRatEndurance;
      const matchedTissue = tissueList.find(
        (filter) => filter.filter_value === item.tissue
      );
      item.tissue = matchedTissue ? matchedTissue.filter_label : item.tissue;
    }
    // Transform randomGroupCode values
    if (item.contrast1_randomGroupCode && item.contrast1_randomGroupCode.length) {
      const matchedRnadomGroupCode = randomGroupList.find(
        (filter) => filter.filter_value === item.contrast1_randomGroupCode,
      );
      item.contrast1_randomGroupCode = matchedRnadomGroupCode ? matchedRnadomGroupCode.filter_label
        : item.contrast1_randomGroupCode;
    }
    // Transform human timepoint and pass1a06 timepoint values
    if (item.contrast1_timepoint && item.contrast1_timepoint.length && item.contrast1_randomGroupCode && item.contrast1_randomGroupCode !== 'NA') {
      const matchedHumanTimepoint = timepointListHuman.find(
        (filter) => filter.filter_value === item.contrast1_timepoint,
      );
      item.contrast1_timepoint = matchedHumanTimepoint ? matchedHumanTimepoint.filter_label
        : item.contrast1_timepoint;
    } else if (item.contrast1_timepoint && item.contrast1_timepoint.length) {
      const matchedTimepoint = timepointListRatAcute.find(
        (filter) => filter.filter_value === item.contrast1_timepoint,
      );
      item.contrast1_timepoint = matchedTimepoint ? matchedTimepoint.filter_label
        : item.contrast1_timepoint;
    }
    // Transform human type values
    if (item.contrast_type && item.contrast_type.length) {
      item.contrast_type = normalizeString(item.contrast_type);
    }
    // Transform sex values
    if (item.sex && item.sex.length) {
      const matchedSex = sexList.find(
        (filter) => filter.filter_value.toLowerCase() === item.sex.toLowerCase()
      );
      item.sex = matchedSex ? matchedSex.filter_label : item.sex;
    }
    // Transform pass1b-06 timepoint values
    if (item.comparison_group && item.comparison_group.length) {
      const matchedTimepoint = timepointListRatEndurance.find(
        (filter) => filter.filter_value === item.comparison_group
      );
      item.comparison_group = matchedTimepoint ? matchedTimepoint.filter_label : item.comparison_group;
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
