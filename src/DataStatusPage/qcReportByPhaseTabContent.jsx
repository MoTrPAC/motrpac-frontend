import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the tabbed QC report samples by phase page content
 *
 * @param {Object} data QC reports data
 * @param {string} phase QC report phase
 *
 * @returns {object} JSX representation of QC report samples by phase page content
 */
function qcReportByPhaseTabContent({ data, phase }) {
  // FIXME: current implementation needs to be refactored to reduce the number of
  //       functions and variables for parsing and transforming data
  //       to be more readable and maintainable

  // pool all data and filter a subset of it by phase
  function getDataByPhase() {
    // delete 'lastModified' key from data
    delete data.lastModified;
    const newData = {};
    const filteredData = {};
    Object.keys(data).forEach((key) => {
      const filteredList = data[key].filter(
        (item) => item.phase.toUpperCase().indexOf(phase.toUpperCase()) > -1
      );
      filteredData[key] = filteredList;
    });
    newData[phase] = filteredData;
    return newData;
  }

  // concatenate all data of different omics/assays for a given phase
  // 'ref' sample_category is omitted in the concatenated data
  function concatData() {
    const dataObj = getDataByPhase();
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

  // create a list of unique tissue codes from
  // processed concatenated data in a given phase
  function getUnqiueTissues() {
    const mergedData = concatData();
    const uniqueTissues = [];
    mergedData.forEach((item) => {
      if (uniqueTissues.indexOf(item.tissue) === -1) {
        uniqueTissues.push(item.tissue);
      }
    });
    if (uniqueTissues.length > 1) {
      uniqueTissues.sort(
        (a, b) => Number(a.substring(1)) - Number(b.substring(1))
      );
    }
    return uniqueTissues;
  }

  // group concatenated data by tissue in a given phase
  function groupSamplesByTissue() {
    const mergedData = concatData();
    const tissueCodes = getUnqiueTissues();
    const groupedSamplesObj = {};
    tissueCodes.forEach((tissueCode) => {
      const filteredData = mergedData.filter(
        (item) => item.tissue === tissueCode
      );
      groupedSamplesObj[tissueCode] = filteredData;
    });
    return groupedSamplesObj;
  }

  // select x-axis label prefix (GET, METAB, PROT)
  function renderOmicPrefix(assay) {
    let omicPrefix = 'METAB';
    const patternGet = /rna-seq|rrbs|atac-seq/;
    if (assay.toLowerCase().match(patternGet)) {
      omicPrefix = 'GET';
    }
    const patternImmuno = /rat-adipokine|rat-mag27plex|rat-metabolic|rat-myokine|rat-pituitary/;
    if (assay.toLowerCase().match(patternImmuno)) {
      omicPrefix = 'IMMUNO';
    }
    if (assay.toLowerCase().indexOf('prot') > -1) {
      omicPrefix = 'PROT';
    }
    return omicPrefix;
  }

  // construct unique x-axis labels composed of omic, cas, assay
  function getLabelsByOmicSiteAssay() {
    const samplesByTissue = groupSamplesByTissue();
    const labels = [];
    Object.keys(samplesByTissue).forEach((key) => {
      samplesByTissue[key].forEach((item) => {
        const labelStr = `${renderOmicPrefix(
          item.assay
        )}-${item.cas.toUpperCase()}-${item.assay.toUpperCase()}`;
        if (labels.indexOf(labelStr) === -1) {
          labels.push(labelStr);
        }
      });
    });
    return labels.sort();
  }

  // get sample count for each x-axis label vs tissue
  function getSampleCount(tisseSamples, label) {
    let sampleCount = 0;
    tisseSamples.forEach((item) => {
      const labelStr = `${renderOmicPrefix(
        item.assay
      )}-${item.cas.toUpperCase()}-${item.assay.toUpperCase()}`;
      if (labelStr === label) {
        sampleCount = item.sample_count;
      }
    });
    return sampleCount;
  }

  // render table body
  function renderGridBody() {
    const samplesByTissue = groupSamplesByTissue();
    const labels = getLabelsByOmicSiteAssay();
    return (
      <tbody>
        {Object.keys(samplesByTissue).map((key) => {
          return (
            <tr key={key}>
              {labels.map((label) => {
                return (
                  <td
                    key={`${key}-${label}`}
                    className="sample-submission-status border border-dark"
                  >
                    {getSampleCount(samplesByTissue[key], label) < 1 ? (
                      <div className="no-sample-submission w-100 h-100">
                        <span>
                          {getSampleCount(samplesByTissue[key], label)}
                        </span>
                      </div>
                    ) : (
                      <div className="sample-submission-count w-100 h-100">
                        <span>
                          {getSampleCount(samplesByTissue[key], label)}
                        </span>
                      </div>
                    )}
                  </td>
                );
              })}
              <td className="submitted-tissues">
                {`${key} - ${samplesByTissue[key][0].t_name}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }

  // render table footer
  function renderGridFooter() {
    return (
      <tfoot>
        <tr>
          {getLabelsByOmicSiteAssay().map((label) => {
            return (
              <th key={label}>
                <div className="footer-content-container">
                  <div className="footer-label">{label}</div>
                </div>
              </th>
            );
          })}
          <th>Tissue</th>
        </tr>
      </tfoot>
    );
  }

  return (
    <div className="QCReportByPhaseTabPane content-wrapper col-12 mb-4">
      <h5 className="text-muted mb-2">{`${
        phase.toUpperCase() === 'HUMAN' ? phase : phase + '-06'
      } Tissue Submitted by CAS/Assay`}</h5>
      <div className="table-responsive">
        <table className={`table table-sm ${phase}`}>
          {renderGridBody()}
          {renderGridFooter()}
        </table>
      </div>
    </div>
  );
}

qcReportByPhaseTabContent.propTypes = {
  data: PropTypes.object,
  phase: PropTypes.string,
};

qcReportByPhaseTabContent.defaultProps = {
  data: {},
  phase: '',
};

export default qcReportByPhaseTabContent;