import React from 'react';
import { Link } from 'react-router-dom';
import tissueList from '../lib/tissueList';
import passSamples from '../lib/passSamples';
import ProgressBar from '../lib/ui/progressbar';
import IconSet from '../lib/iconSet';

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
              {/* Temporarily suppressing links for other sites */}
              {item.site.match(/MSSM|Stanford/i) ? (
                <div>{samplesLink}</div>
              ) : (
                <div><span className="badge badge-success">{item.received_samples}</span></div>
              )}
            </div>
          );
        } else if (!item.expected_samples && item.received_samples) {
          // No samples expected per PASS-TAP but samples were received
          sampleNum = (
            <div className="sample-number-content d-inline-flex align-items-center flagged">
              {/* Temporarily suppressing links for other sites */}
              {item.site.match(/MSSM|Stanford/i) ? samplesLink : (
                <span className="badge badge-success">{item.received_samples}</span>
              )}
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

  // Render individual tissue's progress bar
  const renderProgressBar = (tissue) => {
    const totalExpectedSamples = [];
    const totalReceivedSamples = [];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    if (passSamples[tissue] && passSamples[tissue].length) {
      // Find all assays with expected samples
      const experimentSampleArray = passSamples[tissue].filter((item) => {
        return item.expected_samples && parseFloat(item.expected_samples);
      });
      experimentSampleArray.forEach((assay) => {
        totalExpectedSamples.push(assay.expected_samples);
        totalReceivedSamples.push(assay.received_samples);
      });
    }
    const totalExpectedNum = totalExpectedSamples.reduce(reducer);
    const totalReceivedNum = totalReceivedSamples.reduce(reducer);
    return (
      <ProgressBar
        currentValue={totalReceivedNum}
        expectedValue={totalExpectedNum}
      />
    );
  };

  // Renders individual rows of tissue samples
  const sampleTableRows = tissueList
    .map(tissue => (
      <tr key={tissue.label} className={tissue.label}>
        <th scope="row" className="text-left tissue-name text-nowrap">{tissue.display_name}</th>
        <td className="total-samples">
          {renderProgressBar(tissue.label)}
        </td>
        {renderSampleTableCell(tissue.label)}
      </tr>
    ));

  return (
    <div className="table-responsive">
      <table className="table table-sm tissueAnalysisStatusTable">
        <thead>
          <tr className="table-head">
            <th scope="col" rowSpan="3" className="text-left">Tissue</th>
            <th scope="col" rowSpan="3">Total Samples</th>
            <th colSpan="4" className="PASS-GET-1A phase-study-heading">
              <div className="d-flex align-items-center justify-content-center">
                <img src={IconSet.DNA} alt="Genomic" />
                <span>GET - Phase 1A assays/site</span>
              </div>
            </th>
            <th colSpan="4" className="PASS-GET-1B phase-study-heading">
              <div className="d-flex align-items-center justify-content-center">
                <img src={IconSet.DNA} alt="Genomic" />
                <span>GET - Phase 1B assays/site</span>
              </div>
            </th>
            <th colSpan="19" className="PASS-Metabolomics-1A phase-study-heading">
              <div className="d-flex align-items-center justify-content-center">
                <img src={IconSet.Metabolite} alt="Metabolomic" />
                <span>Metabolomics - Combined assays/site</span>
              </div>
            </th>
            <th colSpan="6" className="PASS-Proteomics-1A phase-study-heading">
              <div className="d-flex align-items-center justify-content-center">
                <img src={IconSet.Protein} alt="Proteomic" />
                <span>Proteomics - Combined assays/site</span>
              </div>
            </th>
          </tr>
          <tr className="table-head">
            {/* FIXME: Need to render these headings using data  */}
            {/* PASS-GET-1A */}
            <th className="assay-type PASS-GET-1A">
              <span className="experiment-name text-nowrap">RNA-seq</span>
              <Link to="/search?action=samples&phase=1A&study=GET&experiment=RNA-seq&site=MSSM">
                <span className="badge badge-sinai">MSSM</span>
              </Link>
            </th>
            <th className="assay-type PASS-GET-1A">
              <span className="experiment-name text-nowrap">RNA-seq</span>
              <Link to="/search?action=samples&phase=1A&study=GET&experiment=RNA-seq&site=Stanford">
                <span className="badge badge-stanford">Stanford</span>
              </Link>
            </th>
            <th className="assay-type PASS-GET-1A">
              <span className="experiment-name text-nowrap">ATAC-seq</span>
              <span className="badge badge-stanford">Stanford</span>
              {/* temp suppression of link for internal release
              <Link to="/search?action=samples&phase=1A&study=GET&experiment=ATAC-seq&site=Stanford">
                <span className="badge badge-stanford">Stanford</span>
              </Link>
              */}
            </th>
            <th className="assay-type PASS-GET-1A">
              <span className="experiment-name text-nowrap">Methylome</span>
              <Link to="/search?action=samples&phase=1A&study=GET&experiment=Methylome&site=MSSM">
                <span className="badge badge-sinai">MSSM</span>
              </Link>
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
              <span className="experiment-name">Untargeted HILIC-negative</span>
              <span className="badge badge-michigan">UM</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Untargeted HILIC-positive</span>
              <span className="badge badge-georgia-tech">GT</span>
            </th>
            <th className="assay-type PASS-Metabolomics-1A">
              <span className="experiment-name">Untargeted HILIC-negative</span>
              <span className="badge badge-georgia-tech">GT</span>
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
              <span className="experiment-name">Targeted TCA</span>
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
            <td colSpan="35 text-left">
              <div className="footnote">
                <p>
                  <span className="legend">
                    <span className="legend-label expected" />
                    <span className="legend-definition">Expected</span>
                  </span>
                  <span className="legend">
                    <span className="legend-label received" />
                    <span className="legend-definition">Received</span>
                  </span>
                  <span className="legend">
                    <span className="legend-label unexpected" />
                    <span className="legend-definition">Unexpected but received</span>
                  </span>
                </p>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TissueAnalysisPlanTable;
