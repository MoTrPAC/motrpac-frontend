import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  getDataTableColumns,
  transformData,
  commonReportPropType,
  getDataReportPropType,
} from './common';
import QcReportDataTable from './sharelib/qcReportDataTable';

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function StatusReportGetData({ qcData }) {
  // Define table column headers
  const columns = useMemo(() => getDataTableColumns, []);
  const data = useMemo(() => transformData(qcData), [qcData]);
  return <QcReportDataTable columns={columns} data={data} />;
}

StatusReportGetData.propTypes = {
  qcData: PropTypes.arrayOf(
    PropTypes.shape({ ...commonReportPropType, ...getDataReportPropType })
  ).isRequired,
};

export default StatusReportGetData;
