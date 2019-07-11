import React from 'react';
import PropTypes from 'prop-types';
import tissueList from '../lib/tissueList';

const sinaiPass1aRNAseqMetadata = require('../data/sinai_pass1a_get_rna_seq_metadata');
const sinaiPass1aMethylomeMetadata = require('../data/sinai_pass1a_get_methylome_metadata');
const stanfordPass1aRNAseqMetadata = require('../data/stanford_pass1a_get_rna_seq_metadata');

/**
 * Renders a given tissue analysis samples table
 *
 * @returns {object} JSX representation of table on tissue analysis samples
 */
function SampleSearchResultTable({ params }) {
  // Map tissue param value to tissue object
  const tissueObj = tissueList.find(entry => entry.label === params.tissue);

  let data;
  if (params.site === 'Stanford' && params.phase === '1A') {
    data = stanfordPass1aRNAseqMetadata;
  } else if (params.site === 'MSSM' && params.phase === '1A') {
    if (params.experiment === 'Methylome') {
      data = sinaiPass1aMethylomeMetadata;
    } else {
      data = sinaiPass1aRNAseqMetadata;
    }
  }

  const sampleSubset = data.filter((item) => {
    const tissueName = tissueObj.name.toLowerCase();
    const tissueAlias = tissueObj.alias ? tissueObj.alias.toLowerCase() : null;
    const tissueLabel = item.Tissue.toLowerCase();
    return tissueAlias ? tissueLabel.indexOf(tissueAlias) > -1 : tissueLabel.indexOf(tissueName) > -1;
  });

  // Renders individual cells of tissue samples
  function renderSampleTableCell(sample) {
    const keys = Object.keys(sample);
    let cells;
    if (keys && keys.length) {
      cells = keys.map((key) => {
        return (
          <td key={`${key}-${sample[key]}`} className="sample-metadata-value text-nowrap">
            {sample[key] && sample[key].length ? <span>{sample[key]}</span> : ''}
          </td>
        );
      });
    }

    return cells;
  }

  // Renders individual rows of tissue samples
  const renderSampleTableRows = () => {
    const rows = sampleSubset.map(sample => (
      <tr key={sample.vial_label} className={`${sample.vial_label} ${sample.Species} ${sample.BID}`}>
        {renderSampleTableCell(sample)}
      </tr>
    ));

    return rows;
  };

  // Renders table head of tissue samples
  const renderSampleTableHead = () => {
    const keys = Object.keys(data[0]);
    return (
      <tr className="table-head">
        {keys.map(key => (
          <th key={key} scope="col" className="sample-metadata-label text-nowrap">{key}</th>
        ))}
      </tr>
    );
  };

  // Handle click event to download data in JSON format
  const JsonDownloadButton = () => {
    const dataStr = JSON.stringify(sampleSubset);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    return (
      <a
        className="json-download-button"
        title="Download table to JSON-formatted data"
        aria-label="Download table to JSON-formatted data"
        href={`data:${dataUri}`}
        download={`Data-PASS${params.phase}-${params.tissue}-${params.experiment}-${params.site}.json`}
      >
        <span className="material-icons">get_app</span>
      </a>
    );
  };

  return (
    <div className="pass-tissue-sample-results-panel">
      <div className="card mb-3">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <h5>
              {`PASS${params.phase} ${tissueObj.name} samples for ${params.experiment}`}
              <span className={`badge badge-${params.site.toLowerCase()} site-label`}>{params.site}</span>
            </h5>
            <JsonDownloadButton />
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm table-striped tissueSampleResultsTable">
              <thead className="thead-dark">
                {renderSampleTableHead()}
              </thead>
              <tbody>
                {renderSampleTableRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

SampleSearchResultTable.propTypes = {
  params: PropTypes.shape({
    action: PropTypes.string,
    tissue: PropTypes.string,
    phase: PropTypes.string,
    study: PropTypes.string,
    experiment: PropTypes.string,
    site: PropTypes.string,
  }).isRequired,
};

export default SampleSearchResultTable;
