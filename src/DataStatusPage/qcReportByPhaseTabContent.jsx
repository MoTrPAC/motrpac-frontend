import React from 'react';
import PropTypes from 'prop-types';
import selectOmicPrefix from './sharelib/qcReportByPhaseOmicPrefix';

/**
 * Renders the tabbed QC report samples by phase page content
 *
 * @param {Object} data QC reports data
 * @param {string} phases QC report phases
 *
 * @returns {object} JSX representation of QC report samples by phase page content
 */
function qcReportByPhaseTabContent({ data= {}, phases = [] }) {
  // FIXME: current implementation needs to be refactored to reduce the number of
  //       functions and variables for parsing and transforming data
  //       to be more readable and maintainable

  // pool all data and filter a subset of it by phase
  function getDataByPhase(phase) {
    // delete 'lastModified' key from data
    delete data.lastModified;
    const newData = {};
    const filteredData = {};
    Object.keys(data).forEach((key) => {
      const filteredList = data[key].filter(
        (item) => item.phase.toUpperCase().indexOf(phase.toUpperCase()) > -1 && !item.raw_files_fm
      );
      filteredData[key] = filteredList;
    });
    newData[phase] = filteredData;
    return newData;
  }

  // concatenate all data of different omics/assays for a given phase
  // 'ref' sample_category is omitted in the concatenated data
  function concatData(phase) {
    const dataObj = getDataByPhase(phase);
    const mergedData = [];
    let newSampleObj = {};
    Object.keys(dataObj[phase]).forEach((key) => {
      if (dataObj[phase][key].length > 0) {
        const filteredSet = dataObj[phase][key].filter(
          (item) =>
            !item.sample_category ||
            (item.sample_category && item.sample_category !== 'ref')
        );
        filteredSet.forEach((item) => {
          newSampleObj = {
            cas: item.cas,
            phase: item.phase,
            tissue: item.tissue,
            t_name: item.t_name,
            assay: item.assay,
            sample_count: item.sample_count || item.vial_label,
          };
          mergedData.push(newSampleObj);
        });
      }
    });
    return mergedData;
  }

  // create a list of unique tissue codes/names from
  // processed concatenated data in a given phase
  function getUnqiueTissues(phase) {
    const mergedData = concatData(phase);
    const uniqueTissues = [];
    mergedData.forEach((item) => {
      const tissueStr = `${item.tissue} - ${item.t_name}`;
      if (uniqueTissues.indexOf(tissueStr) === -1) {
        uniqueTissues.push(tissueStr);
      }
    });
    if (uniqueTissues.length > 1) {
      uniqueTissues.sort(
        (a, b) => Number(a.slice(1, 3)) - Number(b.slice(1, 3))
      );
    }
    return uniqueTissues;
  }

  // construct unique y-axis CAS labels composed of omic/cas/assay
  function getUniqueCasByOmicSiteAssay(phase) {
    const mergedData = concatData(phase);
    const labels = [];
    mergedData.forEach((item) => {
      const labelStr = `${selectOmicPrefix(
        item.assay
      )}-${item.cas.toUpperCase()}-${item.assay.toUpperCase()}`;
      if (labels.indexOf(labelStr) === -1) {
        labels.push(labelStr);
      }
    });
    return labels.sort();
  }

  /// group concatenated data by CAS in a given phase
  function groupSamplesByCas(phase) {
    const mergedData = concatData(phase);
    const CasLabels = getUniqueCasByOmicSiteAssay(phase);
    const groupedSamplesObj = {};
    CasLabels.forEach((label) => {
      const filteredData = mergedData.filter(
        (item) =>
          `${selectOmicPrefix(
            item.assay
          )}-${item.cas.toUpperCase()}-${item.assay.toUpperCase()}` === label
      );
      groupedSamplesObj[label] = filteredData;
    });
    return groupedSamplesObj;
  }

  /// get sample count for each x-axis tissue vs. y-axis CAS
  function getSampleCount(siteSamples, tissue) {
    let sampleCount = 0;
    siteSamples.forEach((item) => {
      const tissueStr = `${item.tissue} - ${item.t_name}`;
      if (tissueStr === tissue) {
        sampleCount = item.sample_count;
      }
    });
    return sampleCount;
  }

  /// render table body
  function renderGridBody(phase) {
    const samplesByCas = groupSamplesByCas(phase);
    const tissues = getUnqiueTissues(phase);
    return (
      <tbody>
        {Object.keys(samplesByCas).map((key) => {
          return (
            <tr key={key}>
              {tissues.map((tissue) => {
                return (
                  <td
                    key={`${key}-${tissue}`}
                    className="sample-submission-status border border-dark"
                  >
                    {getSampleCount(samplesByCas[key], tissue) < 1 ? (
                      <div className="no-sample-submission w-100 h-100">
                        <span>{getSampleCount(samplesByCas[key], tissue)}</span>
                      </div>
                    ) : (
                      <div className="sample-submission-count w-100 h-100">
                        <span>{getSampleCount(samplesByCas[key], tissue)}</span>
                      </div>
                    )}
                  </td>
                );
              })}
              <td className="submitted-tissues">{key}</td>
            </tr>
          );
        })}
      </tbody>
    );
  }

  /// render table footer
  function renderGridFooter(phase) {
    return (
      <tfoot>
        <tr>
          {getUnqiueTissues(phase).map((tissue) => {
            return (
              <th key={tissue}>
                <div className="footer-content-container">
                  <div className="footer-label">{tissue}</div>
                </div>
              </th>
            );
          })}
          <th>CAS</th>
        </tr>
      </tfoot>
    );
  }

  return (
    <div className="QCReportByPhaseTabPane content-wrapper col-12 mb-4">
      <div className="table-responsive">
        {phases.map((phase) => {
          return (
            <div key={phase} className={`${phase.toUpperCase()}-table-wrapper`}>
              <div className="d-flex align-items-center mb-2">
                <h5 className="text-muted mb-0 mr-4">{`${
                  phase.toUpperCase() === 'HUMAN'
                    ? phase.toUpperCase()
                    : phase.toUpperCase() + ' 6-Month'
                } Tissue Submitted by CAS/Assay`}</h5>
                <div className="ml-4">
                  <ul className="d-flex align-items-center list-unstyle list-inline mb-0">
                    <li className="d-flex align-items-center legend-item list-inline-item">
                      <div className="legend-item-color submitted" />
                      <span className="legend-item-label ml-1">
                        Samples submitted
                      </span>
                    </li>
                    <li className="d-flex align-items-center legend-item list-inline-item ml-3">
                      <div className="legend-item-color not-submitted" />
                      <span className="legend-item-label ml-1">
                        No sample submitted
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <table className={`table table-sm ${phase.toUpperCase()}`}>
                {renderGridBody(phase)}
                {renderGridFooter(phase)}
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

qcReportByPhaseTabContent.propTypes = {
  data: PropTypes.object,
  phases: PropTypes.arrayOf(PropTypes.string),
};

export default qcReportByPhaseTabContent;
