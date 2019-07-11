import React from 'react';
import { Link } from 'react-router-dom';
import tissueList from '../lib/tissueList';
import passSamples from '../lib/passSamples';

/**
 * Renders the data analysis plan & tracking status table
 *
 * @returns {object} JSX representation of table on data summary page
 */
function TissueAnalysisPlanTable() {
  // Renders individual cells of tissue samples
  function renderSampleTableCell(tissue) {
    let cells;
    if (passSamples[tissue] && passSamples[tissue].length) {
      cells = passSamples[tissue].map((item) => {
        const received = item && item.received_samples ? ' received' : '';
        let sampleNum;
        // let internalStatus;
        const samplesLink = (
          <Link to={`/search?action=samples&tissue=${encodeURI(tissue)}&phase=${item.phase}&study=${item.study}&experiment=${encodeURI(item.experiment)}&site=${item.site}`}>
            <span className="badge badge-success">
              {item.received_samples}
            </span>
          </Link>
        );

        if (!item.expected_samples && !item.received_samples) {
          sampleNum = (
            <span className="sample-number-content" />
          );
        } else if (item.expected_samples && !item.received_samples) {
          sampleNum = (
            <div className="sample-number-content d-inline-flex align-items-center">
              <div>{item.expected_samples}</div>
            </div>
          );
        } else if (item.expected_samples && item.received_samples) {
          sampleNum = (
            <div className="sample-number-content d-inline-flex align-items-center">
              <div>{item.expected_samples}</div>
              <div>{samplesLink}</div>
            </div>
          );
        } else if (!item.expected_samples && item.received_samples) {
          // No samples expected per PASS-TAP but samples were received
          sampleNum = (
            <div className="sample-number-content d-inline-flex align-items-center flagged">
              {samplesLink}
            </div>
          );
        }

        /* FIXME: Need well-defined QC statuses or classifications
        if (item.internal_status) {
          const checkSums = item.internal_status.verified_checksums ? <i className="material-icons">check</i> : <i className="material-icons">close</i>;
          const processed = item.internal_status.processed ? <i className="material-icons">check</i> : <i className="material-icons">close</i>;
          internalStatus = (
            <span className="sample-internal-status-content">
              <span className="qc-status" data-toggle="tooltip" data-placement="top" data-html="true" title={`Verified Checksums ${checkSums}; Processed ${processed}`}>
                <i className="material-icons">check_circle</i>
              </span>
            </span>
          );
        } else {
          internalStatus = (
            <span className="sample-internal-status-content" />
          );
        }
        */

        return (
          <td
            key={`${item.study}-${item.phase}-${item.experiment}-${item.site}`}
            className={`PASS-${item.study}-${item.phase}${received}`}
          >
            {sampleNum}
          </td>
        );
      });
    }

    return cells;
  }

  // Renders individual rows of tissue samples
  const sampleTableRows = tissueList
    .map(tissue => (
      <tr key={tissue.label} className={tissue.label}>
        <th scope="row" className="text-left tissue-name text-nowrap">{tissue.name}</th>
        {renderSampleTableCell(tissue.label)}
      </tr>
    ));

  return (
    <div className="table-responsive">
      <table className="table table-sm tissueAnalysisStatusTable">
        <thead>
          <tr className="table-head">
            <th scope="col" rowSpan="3" className="text-left">Tissue</th>
            <th colSpan="4" className="PASS-GET-1A">GET - Phase 1A assays/site</th>
            <th colSpan="4" className="PASS-GET-1B">GET - Phase 1B assays/site</th>
            <th colSpan="16" className="PASS-Metabolomics-1A">Metabolomics - Phase 1A and 1B assays/site</th>
            <th colSpan="6" className="PASS-Proteomics-1A">Proteomics - Phase 1A and 1B assays/site</th>
          </tr>
          <tr className="table-head">
            {/* FIXME: Need to render these headings using data  */}
            {/* PASS-GET-1A */}
            <th className="assay-type PASS-GET-1A">
              <span className="experiment-name text-nowrap">RNA-seq</span>
              <span className="badge badge-sinai">MSSM</span>
            </th>
            <th className="assay-type PASS-GET-1A">
              <span className="experiment-name text-nowrap">RNA-seq</span>
              <span className="badge badge-stanford">Stanford</span>
            </th>
            <th className="assay-type PASS-GET-1A">
              <span className="experiment-name text-nowrap">ATAC-seq</span>
              <span className="badge badge-stanford">Stanford</span>
            </th>
            <th className="assay-type PASS-GET-1A">
              <span className="experiment-name text-nowrap">Methylome</span>
              <span className="badge badge-sinai">MSSM</span>
            </th>
            {/* PASS-GET-1B */}
            <th className="assay-type PASS-GET-1B text-nowrap">
              <span className="experiment-name text-nowrap">RNA-seq</span>
              <span className="badge badge-sinai">MSSM</span>
            </th>
            <th className="assay-type PASS-GET-1B">
              <span className="experiment-name text-nowrap">RNA-seq</span>
              <span className="badge badge-stanford">Stanford</span>
            </th>
            <th className="assay-type PASS-GET-1B">
              <span className="experiment-name text-nowrap">ATAC-seq</span>
              <span className="badge badge-stanford">Stanford</span>
            </th>
            <th className="assay-type PASS-GET-1B">
              <span className="experiment-name text-nowrap">Methylome</span>
              <span className="badge badge-sinai">MSSM</span>
            </th>
            {/* PASS-Metabolomics-1A */}
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Untargeted Reversed Phase</span>
              <span className="badge badge-michigan">UM</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Untargeted HILIC-positive</span>
              <span className="badge badge-broad">Broad</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Untargeted HILIC -negative</span>
              <span className="badge badge-michigan">UM</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Untargeted Lipidomics</span>
              <span className="badge badge-georgia-tech">GT</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Amino Acids/Acylcarnitines</span>
              <span className="badge badge-duke">Duke</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Branched-Chain Metabolites</span>
              <span className="badge badge-duke">Duke</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Acyl-CoA</span>
              <span className="badge badge-duke">Duke</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Organic Acids</span>
              <span className="badge badge-duke">Duke</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Nucleotides</span>
              <span className="badge badge-duke">Duke</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Ceramides</span>
              <span className="badge badge-duke">Duke</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Clinical Panel</span>
              <span className="badge badge-duke">Duke</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Amines</span>
              <span className="badge badge-mayo">Mayo</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Tageted Organic Acids</span>
              <span className="badge badge-mayo">Mayo</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Ceramides</span>
              <span className="badge badge-mayo">Mayo</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Targeted Acylcarnitines</span>
              <span className="badge badge-mayo">Mayo</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Oxylipids</span>
              <span className="badge badge-emory">Emory</span>
            </th>
            {/* PASS-Proteomics-1A */}
            <th className="assay-type PASS-Proteomics-1A">
              <span className="experiment-name">Global Proteomics</span>
              <span className="badge badge-broad">Broad</span>
            </th>
            <th className="assay-type PASS-Proteomics-1A">
              <span className="experiment-name">Global Phospho-proteomics</span>
              <span className="badge badge-broad">Broad</span>
            </th>
            <th className="assay-type PASS-Proteomics-1A">
              <span className="experiment-name">Global Proteomics</span>
              <span className="badge badge-pnnl">PNNL</span>
            </th>
            <th className="assay-type PASS-Proteomics-1A">
              <span className="experiment-name">Global Phospho-proteomics</span>
              <span className="badge badge-pnnl">PNNL</span>
            </th>
            <th className="assay-type PASS-Proteomics-1A">
              <span className="experiment-name">Global Redox-proteomics</span>
              <span className="badge badge-pnnl">PNNL</span>
            </th>
            <th className="assay-type PASS-Proteomics-1A">
              <span className="experiment-name">Acyl/Acetyl proteome</span>
              <span className="badge badge-unknown text-nowrap">Respective Group</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sampleTableRows}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="31 text-left">
              <div className="footnote">
                <p>* GT submitted tissue samples beyond the experiment as indicated on this TAP.</p>
                <p>* Mayo submitted tissue samples for <em>Targeted TCA</em> experiment not as indicated on this TAP.</p>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TissueAnalysisPlanTable;
