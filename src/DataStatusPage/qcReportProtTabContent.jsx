import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  transformData,
  commonReportPropType,
  metabProtReportPropType,
  metabProtRawDataReportPropType,
  protProcessedDataTableColumns,
  protRawDataTableColumns,
} from './common';
import QcReportDataTable from './sharelib/qcReportDataTable';

/**
 * Sets up table column headers and renders the table component
 *
 * @returns {object} The data qc status table component
 */
function QcReportProtTabContent({ qcData, qcDataRaw, qcFiles }) {
  // Define table column headers
  const processedDataColumns = useMemo(() => protProcessedDataTableColumns, []);
  const processedQcData = useMemo(
    () => transformData(qcData, 'processed', 'prot'),
    [qcData]
  );
  const processedByCasQcData = processedQcData.filter(
    (item) => item.run_by_bic === false
  );
  const processedByBicQcData = processedQcData.filter(
    (item) => item.run_by_bic === true
  );
  const rawDataColumns = useMemo(() => protRawDataTableColumns, []);
  const rawQcData = useMemo(
    () => transformData(qcDataRaw, 'raw', 'prot'),
    [qcDataRaw]
  );
  return (
    <QcReportDataTable
      columns={qcFiles === 'raw' ? rawDataColumns : processedDataColumns}
      data={
        qcFiles === 'raw'
          ? rawQcData
          : qcFiles === 'processed_by_cas'
          ? processedByCasQcData
          : processedByBicQcData
      }
    />
  );
}

QcReportProtTabContent.propTypes = {
  qcData: PropTypes.arrayOf(
    PropTypes.shape({
      ...commonReportPropType,
      ...metabProtReportPropType,
    })
  ).isRequired,
  qcDataRaw: PropTypes.arrayOf(
    PropTypes.shape({
      ...commonReportPropType,
      ...metabProtRawDataReportPropType,
    })
  ).isRequired,
  qcFiles: PropTypes.string,
};

QcReportProtTabContent.defaultProps = {
  qcFiles: 'processed_by_bic',
};

export default QcReportProtTabContent;
