import React from 'react';
import PropTypes from 'prop-types';
import tissues from '../lib/tissueCodes';

/**
 * Renders table view of release sample counts on dashboard
 *
 * @param {Array} data    Array of tissue sample metadata by phase/release
 * @param {String} sort   Redux state of table sort view
 *
 * @returns {object} JSX representation of the dashboard sample count table
 */
function ReleasedSampleTable({ data, sort, showQC }) {
  // Create new set of sorted data
  function datasetWithTissueName() {
    const clonedData = [...data];
    clonedData.forEach((tissueSample) => {
      const tissue = tissues.find(
        (item) => item.bic_tissue_code === tissueSample.tissue_code
      );
      return Object.assign(tissueSample, {
        tissue_name: tissue.bic_tissue_name,
      });
    });
    return clonedData;
  }

  // Sort dataset by tissue code/name
  function sortedDataset(arg) {
    const newDataset = datasetWithTissueName();
    switch (arg) {
      case 'default':
        return newDataset.sort((a, b) =>
          a.tissue_code.localeCompare(b.tissue_code)
        );
      case 'ascending':
        return newDataset.sort((a, b) =>
          a.tissue_name.localeCompare(b.tissue_name)
        );
      case 'descending':
        return newDataset.sort((a, b) =>
          b.tissue_name.localeCompare(a.tissue_name)
        );
      default:
        return newDataset.sort((a, b) =>
          a.tissue_code.localeCompare(b.tissue_code)
        );
    }
  }

  // Render table column headers
  const columnHeaders = () => (
    <thead>
      <tr>
        <th>
          <div className="header-tissue">Tissue</div>
        </th>
        {data[0].sample_data.map((assay) => (
          <th key={assay.assay_code}>
            <div className="header-content-container">
              <div
                className={`header-assay ${
                  data[0].sample_data.length < 20 ? 'short-list' : ''
                }`}
              >
                {assay.assay_name}
              </div>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  // Render table rows
  const rows = () => (
    <tbody>
      {sortedDataset(sort).map((tissue) => {
        return (
          <tr key={tissue.tissue_code}>
            <td>
              <div className="column-tissue-name">{`${tissue.tissue_code} ${tissue.tissue_name}`}</div>
            </td>
            {tissue.sample_data.map((row) => {
              return (
                <td key={`${tissue.tissue_code}_${row.assay_code}`}>
                  {!showQC && row.count ? row.count : ' '}
                  {showQC && row.qc_count ? row.qc_count : ' '}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );

  return (
    <div className="releasedSampleTable col-12">
      <div className="table-responsive">
        <table className="table table-striped table-hover table-sm">
          {columnHeaders()}
          {rows()}
        </table>
      </div>
    </div>
  );
}

ReleasedSampleTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      tissue_code: PropTypes.string.isRequired,
      sample_data: PropTypes.array.isRequired,
    })
  ).isRequired,
  sort: PropTypes.string.isRequired,
  showQC: PropTypes.bool.isRequired,
};

export default ReleasedSampleTable;
