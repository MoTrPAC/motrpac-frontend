import React from 'react';
import PropTypes from 'prop-types';

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
 * page count and page index rendering function
 * common to rna-seq, rrbs, and atac-seq
 * data qc status reports
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
  pageIndex: PropTypes.number.isRequired,
  pageOptions: PropTypes.shape({
    length: PropTypes.number,
  }).isRequired,
};

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
