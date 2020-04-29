import PropTypes from 'prop-types';

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
    Header: 'Assay',
    accessor: 'assay',
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

const statusReportPropType = {
  cas: PropTypes.string,
  phase: PropTypes.string,
  tissue: PropTypes.string,
  t_name: PropTypes.string,
  seq_flowcell_lane: PropTypes.string,
  assay: PropTypes.string,
  version: PropTypes.string,
  sample_category: PropTypes.string,
  sample_count: PropTypes.string,
  dmaqc_valid: PropTypes.string,
};

export default statusReportPropType;
