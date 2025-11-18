import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  transformData,
  commonReportPropType,
  metabProtReportPropType,
  metabProtRawDataReportPropType,
  metabProcessedDataTableColumns,
  metabRawDataTableColumns,
} from './common';
import QcReportDataTable from './sharelib/qcReportDataTable';

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function QcReportMetabTabContent({ qcData, qcDataRaw, qcFiles = 'processed' }) {
  // Define table column headers
  const processedDataColumns = useMemo(
    () => metabProcessedDataTableColumns,
    [],
  );
  const processedQcData = useMemo(
    () => transformData(qcData, 'processed', 'metab'),
    [qcData],
  );
  const rawDataColumns = useMemo(() => metabRawDataTableColumns, []);
  const rawQcData = useMemo(
    () => transformData(qcDataRaw, 'raw', 'metab'),
    [qcDataRaw],
  );
  return (
    <QcReportDataTable
      columns={qcFiles === 'raw' ? rawDataColumns : processedDataColumns}
      data={qcFiles === 'raw' ? rawQcData : processedQcData}
    />
  );
}

QcReportMetabTabContent.propTypes = {
  qcData: PropTypes.arrayOf(
    PropTypes.shape({
      ...commonReportPropType,
      ...metabProtReportPropType,
    }),
  ).isRequired,
  qcDataRaw: PropTypes.arrayOf(
    PropTypes.shape({
      ...commonReportPropType,
      ...metabProtRawDataReportPropType,
    }),
  ).isRequired,
  qcFiles: PropTypes.string,
};

export default QcReportMetabTabContent;
