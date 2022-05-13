import React from 'react';
import PropTypes from 'prop-types';
import { Pie, Doughnut } from 'react-chartjs-2';

/**
 * Renders chart.js plots of release sample summary on dashboard
 *
 * @param {Array} data      Metadata of release samples
 * @param {String} release  User-selected release state
 * @param {String} userType User who is either internal or external
 *
 * @returns {object} JSX representation of the dashboard sample count plots
 */
function ReleasedSampleSummary({ data, release, userType }) {
  // flag to temporarily suppress quick search rendering
  const inProduction = false;

  // Utility function to get total count of
  // a given omic from each tissue
  function countSamples(tissueList, omic, countType) {
    let studyCount = 0;
    let qcCount = 0;
    tissueList.forEach((tissue) => {
      tissue.sample_data.forEach((item) => {
        if (item.omics_code === omic && item.count) {
          studyCount += Number(item.count);
          if (item.qc_count) {
            qcCount += Number(item.qc_count);
          }
        }
      });
    });

    if (countType && countType === 'qcCount') {
      return qcCount;
    }

    return studyCount;
  }

  // Get count for a given metric
  function computeCounts(metric) {
    const countObject = {
      transcriptomics: {
        label: 'Transcriptomics',
        studyCount: 0,
        qcCount: 0,
      },
      epigenomics: {
        label: 'Epigenomics',
        studyCount: 0,
        qcCount: 0,
      },
      metabolomics_targeted: {
        label: 'Metabolomics Targeted',
        studyCount: 0,
        qcCount: 0,
      },
      metabolomics_untargeted: {
        label: 'Metabolomics Untargeted',
        studyCount: 0,
        qcCount: 0,
      },
      immunoassay: {
        label: 'Proteomics Targeted',
        studyCount: 0,
        qcCount: 0,
      },
      proteomics: {
        label: 'Proteomics Untargeted',
        studyCount: 0,
        qcCount: 0,
      },
      pass1a_06: {
        label: 'PASS1A 6-Month',
        studyCount: 0,
        qcCount: 0,
      },
      pass1b_06: {
        label: 'PASS1B 6-Month',
        studyCount: 0,
        qcCount: 0,
      },
    };
    if (metric === 'internal') {
      // internal pass1a_06 'study' samples for each omic
      const internalPass1A06TranscriptCount = countSamples(
        data.internal.pass1a_06,
        'transcriptomics'
      );
      const internalPass1A06EpigenCount = countSamples(
        data.internal.pass1a_06,
        'epigenomics'
      );
      const internalPass1A06MetaTargCount = countSamples(
        data.internal.pass1a_06,
        'metabolomics-targeted'
      );
      const internalPass1A06MetaUntargCount = countSamples(
        data.internal.pass1a_06,
        'metabolomics-untargeted'
      );
      const internalPass1A06ProtCount = countSamples(
        data.internal.pass1a_06,
        'proteomics'
      );
      // internal pass1a_06 'QC' samples for each omic
      const internalPass1A06TranscriptCountQC = countSamples(
        data.internal.pass1a_06,
        'transcriptomics',
        'qcCount'
      );
      const internalPass1A06EpigenCountQC = countSamples(
        data.internal.pass1a_06,
        'epigenomics',
        'qcCount'
      );
      const internalPass1A06MetaTargCountQC = countSamples(
        data.internal.pass1a_06,
        'metabolomics-targeted',
        'qcCount'
      );
      const internalPass1A06MetaUntargCountQC = countSamples(
        data.internal.pass1a_06,
        'metabolomics-untargeted',
        'qcCount'
      );
      const internalPass1A06ProtCountQC = countSamples(
        data.internal.pass1a_06,
        'proteomics',
        'qcCount'
      );
      // internal pass1b_06 'study' samples for each omic
      const internalPass1B06TranscriptCount = countSamples(
        data.internal.pass1b_06,
        'transcriptomics'
      );
      const internalPass1B06EpigenCount = countSamples(
        data.internal.pass1b_06,
        'epigenomics'
      );
      const internalPass1B06MetaTargCount = countSamples(
        data.internal.pass1b_06,
        'metabolomics-targeted'
      );
      const internalPass1B06MetaUntargCount = countSamples(
        data.internal.pass1b_06,
        'metabolomics-untargeted'
      );
      const internalPass1B06ProtCount = countSamples(
        data.internal.pass1b_06,
        'proteomics'
      );
      const internalPass1B06ImmunoassayCount = countSamples(
        data.internal.pass1b_06,
        'immunoassay'
      );
      // internal pass1b_06 'QC' samples for each omic
      const internalPass1B06TranscriptCountQC = countSamples(
        data.internal.pass1b_06,
        'transcriptomics',
        'qcCount'
      );
      const internalPass1B06EpigenCountQC = countSamples(
        data.internal.pass1b_06,
        'epigenomics',
        'qcCount'
      );
      const internalPass1B06MetaTargCountQC = countSamples(
        data.internal.pass1b_06,
        'metabolomics-targeted',
        'qcCount'
      );
      const internalPass1B06MetaUntargCountQC = countSamples(
        data.internal.pass1b_06,
        'metabolomics-untargeted',
        'qcCount'
      );
      const internalPass1B06ProtCountQC = countSamples(
        data.internal.pass1b_06,
        'proteomics',
        'qcCount'
      );
      const internalPass1B06ImmunoassayCountQC = countSamples(
        data.internal.pass1b_06,
        'immunoassay',
        'qcCount'
      );
      // assign internal release 'study' sample counts
      countObject.transcriptomics.studyCount =
        internalPass1A06TranscriptCount + internalPass1B06TranscriptCount;
      countObject.epigenomics.studyCount =
        internalPass1A06EpigenCount + internalPass1B06EpigenCount;
      countObject.metabolomics_targeted.studyCount =
        internalPass1A06MetaTargCount + internalPass1B06MetaTargCount;
      countObject.metabolomics_untargeted.studyCount =
        internalPass1A06MetaUntargCount + internalPass1B06MetaUntargCount;
      countObject.proteomics.studyCount =
        internalPass1A06ProtCount + internalPass1B06ProtCount;
      countObject.immunoassay.studyCount = internalPass1B06ImmunoassayCount;
      countObject.pass1a_06.studyCount =
        internalPass1A06TranscriptCount +
        internalPass1A06EpigenCount +
        internalPass1A06MetaTargCount +
        internalPass1A06MetaUntargCount +
        internalPass1A06ProtCount;
      countObject.pass1b_06.studyCount =
        internalPass1B06TranscriptCount +
        internalPass1B06EpigenCount +
        internalPass1B06MetaTargCount +
        internalPass1B06MetaUntargCount +
        internalPass1B06ProtCount +
        internalPass1B06ImmunoassayCount;
      // assign internal release 'QC' sample counts
      countObject.transcriptomics.qcCount =
        internalPass1A06TranscriptCountQC + internalPass1B06TranscriptCountQC;
      countObject.epigenomics.qcCount =
        internalPass1A06EpigenCountQC + internalPass1B06EpigenCountQC;
      countObject.metabolomics_targeted.qcCount =
        internalPass1A06MetaTargCountQC + internalPass1B06MetaTargCountQC;
      countObject.metabolomics_untargeted.qcCount =
        internalPass1A06MetaUntargCountQC + internalPass1B06MetaUntargCountQC;
      countObject.proteomics.qcCount =
        internalPass1A06ProtCountQC + internalPass1B06ProtCountQC;
      countObject.immunoassay.qcCount = internalPass1B06ImmunoassayCountQC;
      countObject.pass1a_06.qcCount =
        internalPass1A06TranscriptCountQC +
        internalPass1A06EpigenCountQC +
        internalPass1A06MetaTargCountQC +
        internalPass1A06MetaUntargCountQC +
        internalPass1A06ProtCountQC;
      countObject.pass1b_06.qcCount =
        internalPass1B06TranscriptCountQC +
        internalPass1B06EpigenCountQC +
        internalPass1B06MetaTargCountQC +
        internalPass1B06MetaUntargCountQC +
        internalPass1B06ProtCountQC +
        internalPass1B06ImmunoassayCountQC;
    } else if (metric === 'external') {
      // external pass1a_06 'study' samples for each omic
      const externalPass1A06TranscriptCount = countSamples(
        data.external.pass1a_06,
        'transcriptomics'
      );
      const externalPass1A06EpigenCount = countSamples(
        data.external.pass1a_06,
        'epigenomics'
      );
      const externalPass1A06MetaTargCount = countSamples(
        data.external.pass1a_06,
        'metabolomics-targeted'
      );
      const externalPass1A06MetaUntargCount = countSamples(
        data.external.pass1a_06,
        'metabolomics-untargeted'
      );
      const externalPass1A06ProtCount = countSamples(
        data.external.pass1a_06,
        'proteomics'
      );
      // external pass1a_06 'QC' samples for each omic
      const externalPass1A06TranscriptCountQC = countSamples(
        data.external.pass1a_06,
        'transcriptomics',
        'qcCount'
      );
      const externalPass1A06EpigenCountQC = countSamples(
        data.external.pass1a_06,
        'epigenomics',
        'qcCount'
      );
      const externalPass1A06MetaTargCountQC = countSamples(
        data.external.pass1a_06,
        'metabolomics-targeted',
        'qcCount'
      );
      const externalPass1A06MetaUntargCountQC = countSamples(
        data.external.pass1a_06,
        'metabolomics-untargeted',
        'qcCount'
      );
      const externalPass1A06ProtCountQC = countSamples(
        data.external.pass1a_06,
        'proteomics',
        'qcCount'
      );
      // assign external release sample counts
      countObject.transcriptomics.studyCount = externalPass1A06TranscriptCount;
      countObject.epigenomics.studyCount = externalPass1A06EpigenCount;
      countObject.metabolomics_targeted.studyCount = externalPass1A06MetaTargCount;
      countObject.metabolomics_untargeted.studyCount = externalPass1A06MetaUntargCount;
      countObject.proteomics.studyCount = externalPass1A06ProtCount;
      countObject.pass1a_06.studyCount =
        externalPass1A06TranscriptCount +
        externalPass1A06EpigenCount +
        externalPass1A06MetaTargCount +
        externalPass1A06MetaUntargCount +
        externalPass1A06ProtCount;
      // assign external release sample counts
      countObject.transcriptomics.qcCount = externalPass1A06TranscriptCountQC;
      countObject.epigenomics.qcCount = externalPass1A06EpigenCountQC;
      countObject.metabolomics_targeted.qcCount = externalPass1A06MetaTargCountQC;
      countObject.metabolomics_untargeted.qcCount = externalPass1A06MetaUntargCountQC;
      countObject.proteomics.qcCount = externalPass1A06ProtCountQC;
      countObject.pass1a_06.qcCount =
        externalPass1A06TranscriptCountQC +
        externalPass1A06EpigenCountQC +
        externalPass1A06MetaTargCountQC +
        externalPass1A06MetaUntargCountQC +
        externalPass1A06ProtCountQC;
    }
    return countObject;
  }

  const summary = computeCounts(userType === 'external' ? 'external' : release);

  const omicsData = {
    labels: [
      summary.transcriptomics.label,
      summary.epigenomics.label,
      summary.metabolomics_targeted.label,
      summary.metabolomics_untargeted.label,
      summary.immunoassay.label,
      summary.proteomics.label,
    ],
    datasets: [
      {
        data: [
          summary.transcriptomics.studyCount,
          summary.epigenomics.studyCount,
          summary.metabolomics_targeted.studyCount,
          summary.metabolomics_untargeted.studyCount,
          summary.immunoassay.studyCount,
          summary.proteomics.studyCount,
        ],
        backgroundColor: [
          '#71BAF0',
          '#ffde72',
          '#93D689',
          '#fd6666',
          '#8b9ead',
          '#b566ff',
        ],
      },
    ],
  };

  const omicsDataQC = {
    labels: [
      summary.transcriptomics.label,
      summary.epigenomics.label,
      summary.metabolomics_targeted.label,
      summary.metabolomics_untargeted.label,
      summary.immunoassay.label,
      summary.proteomics.label,
    ],
    datasets: [
      {
        data: [
          summary.transcriptomics.qcCount,
          summary.epigenomics.qcCount,
          summary.metabolomics_targeted.qcCount,
          summary.metabolomics_untargeted.qcCount,
          summary.immunoassay.qcCount,
          summary.proteomics.qcCount,
        ],
        backgroundColor: [
          '#71BAF0',
          '#ffde72',
          '#93D689',
          '#fd6666',
          '#8b9ead',
          '#b566ff',
        ],
      },
    ],
  };

  const phaseData = {
    labels: [summary.pass1a_06.label, summary.pass1b_06.label],
    datasets: [
      {
        data: [summary.pass1a_06.studyCount, summary.pass1b_06.studyCount],
        backgroundColor: ['#56bf46', '#f9c002'],
      },
    ],
  };

  const phaseDataQC = {
    labels: [summary.pass1a_06.label, summary.pass1b_06.label],
    datasets: [
      {
        data: [summary.pass1a_06.qcCount, summary.pass1b_06.qcCount],
        backgroundColor: ['#56bf46', '#f9c002'],
      },
    ],
  };

  // ChartJS formatting options
  const options = {
    legend: {
      align: 'start',
      position: 'bottom',
      labels: {
        boxWidth: 12,
        fontFamily: "'Open Sans', sans-serif",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="release-sample-summary-plots">
      <h5 className="release-sample-summary-plots-title mb-4">
        Total Study Assays
      </h5>
      <div>
        <Pie data={omicsData} options={options} height={350} />
      </div>
      <div className="mt-3">
        <Pie data={phaseData} options={options} height={315} />
      </div>
      {inProduction && (
        <div>
          <h5 className="release-sample-summary-plots-title mt-5 mb-4">
            Total QC-Reference
          </h5>
          <div>
            <Doughnut data={omicsDataQC} options={options} height={350} />
          </div>
          <div className="mt-3">
            <Doughnut data={phaseDataQC} options={options} height={315} />
          </div>
        </div>
      )}
    </div>
  );
}

const tissueSamplePropType = {
  tissue_code: PropTypes.string,
  sample_data: PropTypes.array,
};

ReleasedSampleSummary.propTypes = {
  data: PropTypes.shape({
    internal: PropTypes.shape({
      pass1a_06: PropTypes.arrayOf(
        PropTypes.shape({ ...tissueSamplePropType })
      ),
      pass1b_06: PropTypes.arrayOf(
        PropTypes.shape({ ...tissueSamplePropType })
      ),
    }),
    external: PropTypes.shape({
      pass1a_06: PropTypes.arrayOf(
        PropTypes.shape({ ...tissueSamplePropType })
      ),
    }),
  }).isRequired,
  release: PropTypes.string.isRequired,
  userType: PropTypes.string,
};

ReleasedSampleSummary.defaultProps = {
  userType: '',
};

export default ReleasedSampleSummary;
