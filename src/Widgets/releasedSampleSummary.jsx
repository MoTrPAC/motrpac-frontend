import React from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';

/**
 * Renders chart.js plots of release sample summary on dashboard
 *
 * @param {Array} data      Metadata of release samples
 * @param {String} release  Array of tissue sample metadata by phase/release
 *
 * @returns {object} JSX representation of the dashboard sample count plots
 */
function ReleasedSampleSummary({ data, release }) {
  // Utility function to get total count of
  // a given omic from each tissue
  function countSamples(tissueList, omic) {
    let count = 0;
    tissueList.forEach((tissue) => {
      tissue.sample_data.forEach((item) => {
        if (item.omics_code === omic && item.count) {
          count += Number(item.count);
        }
      });
    });
    return count;
  }

  // Get count for a given metric
  function computeCounts(metric) {
    const countObject = {
      transcriptomics: {
        label: 'Transcriptomics',
        count: 0,
      },
      epigenomics: {
        label: 'Epigenomics',
        count: 0,
      },
      metabolomics_targeted: {
        label: 'Metabolomics Targeted',
        count: 0,
      },
      metabolomics_untargeted: {
        label: 'Metabolomics Untargeted',
        count: 0,
      },
      proteomics: {
        label: 'Proteomics',
        count: 0,
      },
      pass1a_06: {
        label: 'PASS1A 6-Month',
        count: 0,
      },
      pass1b_06: {
        label: 'PASS1B 6-Month',
        count: 0,
      },
    };
    if (metric === 'internal') {
      // internal pass1a_06 samples
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
      // internal pass1b_06 samples
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
      // assign internal release sample counts
      countObject.transcriptomics.count =
        internalPass1A06TranscriptCount + internalPass1B06TranscriptCount;
      countObject.epigenomics.count =
        internalPass1A06EpigenCount + internalPass1B06EpigenCount;
      countObject.metabolomics_targeted.count =
        internalPass1A06MetaTargCount + internalPass1B06MetaTargCount;
      countObject.metabolomics_untargeted.count =
        internalPass1A06MetaUntargCount + internalPass1B06MetaUntargCount;
      countObject.proteomics.count =
        internalPass1A06ProtCount + internalPass1B06ProtCount;
      countObject.pass1a_06.count =
        internalPass1A06TranscriptCount +
        internalPass1A06EpigenCount +
        internalPass1A06MetaTargCount +
        internalPass1A06MetaUntargCount +
        internalPass1A06ProtCount;
      countObject.pass1b_06.count =
        internalPass1B06TranscriptCount +
        internalPass1B06EpigenCount +
        internalPass1B06MetaTargCount +
        internalPass1B06MetaUntargCount +
        internalPass1B06ProtCount;
    } else if (metric === 'external') {
      // external pass1a_06 samples
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
      // assign external release sample counts
      countObject.transcriptomics.count = externalPass1A06TranscriptCount;
      countObject.epigenomics.count = externalPass1A06EpigenCount;
      countObject.metabolomics_targeted.count = externalPass1A06MetaTargCount;
      countObject.metabolomics_untargeted.count = externalPass1A06MetaUntargCount;
      countObject.proteomics.count = externalPass1A06ProtCount;
      countObject.pass1a_06.count =
        externalPass1A06TranscriptCount +
        externalPass1A06EpigenCount +
        externalPass1A06MetaTargCount +
        externalPass1A06MetaUntargCount +
        externalPass1A06ProtCount;
    }
    return countObject;
  }

  const summary = computeCounts(release);

  const omicsData = {
    labels: [
      summary.transcriptomics.label,
      summary.epigenomics.label,
      summary.metabolomics_targeted.label,
      summary.metabolomics_untargeted.label,
      summary.proteomics.label,
    ],
    datasets: [
      {
        data: [
          summary.transcriptomics.count,
          summary.epigenomics.count,
          summary.metabolomics_targeted.count,
          summary.metabolomics_untargeted.count,
          summary.proteomics.count,
        ],
        backgroundColor: [
          '#71BAF0',
          '#ffde72',
          '#93D689',
          '#fd6666',
          '#b566ff',
        ],
      },
    ],
  };

  const phaseData = {
    labels: [summary.pass1a_06.label, summary.pass1b_06.label],
    datasets: [
      {
        data: [summary.pass1a_06.count, summary.pass1b_06.count],
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
      <div>
        <Pie data={omicsData} options={options} height={350} />
      </div>
      <div className="mt-4">
        <Pie data={phaseData} options={options} height={315} />
      </div>
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
};

export default ReleasedSampleSummary;
