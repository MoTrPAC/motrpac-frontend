import React from 'react';
import PropTypes from 'prop-types';
import getIcon from '../assets/dataSummaryIcons/get.png';
import metabolomicsIcon from '../assets/dataSummaryIcons/metabolomics.png';
import proteomicsIcon from '../assets/dataSummaryIcons/proteomics.png';
import assayIcon from '../assets/dataSummaryIcons/assay.png';
import tissueIcon from '../assets/dataSummaryIcons/tissue.png';

/**
 * Renders the highlighted items of release samples on data summary page
 *
 * @param {Array} data  Array of tissue sample metadata by phase/release
 *
 * @returns {object} JSX representation of release samples page highlighted items
 */
function ReleasedSampleHighlight({ data }) {
  // Utility function to get total count of
  // a given omic from each tissue
  function omicSet(omic) {
    let studyCount = 0;
    let qcCount = 0;
    let totalCount = 0;
    data.forEach((tissueSample) => {
      tissueSample.sample_data.forEach((item) => {
        if (item.omics_code === omic && item.count) {
          studyCount += Number(item.count);
          if (item.qc_count) {
            qcCount += Number(item.qc_count);
          }
          totalCount = studyCount + qcCount;
        }
      });
    });
    return totalCount;
  }

  // Get count for a given metric
  function getCount(metric) {
    switch (metric) {
      case 'tissue':
        return data.length;
      case 'assay':
        return data[0].sample_data.length;
      case 'get':
        return omicSet('transcriptomics') + omicSet('epigenomics');
      case 'metabolomics':
        return (
          omicSet('metabolomics-targeted') + omicSet('metabolomics-untargeted')
        );
      case 'proteomics':
        return omicSet('proteomics') + omicSet('immunoassay');
      default:
        return data.length;
    }
  }

  const highlightItems = [
    {
      metric: 'tissue',
      label: 'Tissues',
      count: getCount('tissue'),
      icon: tissueIcon,
    },
    {
      metric: 'assay',
      label: 'Platforms',
      count: getCount('assay'),
      icon: assayIcon,
    },
    {
      metric: 'get',
      label: 'Genomics Assays',
      count: getCount('get'),
      icon: getIcon,
    },
    {
      metric: 'metabolomic',
      label: 'Metabolomics Assays',
      count: getCount('metabolomics'),
      icon: metabolomicsIcon,
    },
    {
      metric: 'proteomic',
      label: 'Proteomics Assays',
      count: getCount('proteomics'),
      icon: proteomicsIcon,
    },
  ];

  return (
    <div className="release-sample-highlights card-deck">
      {highlightItems.map((item) => {
        return (
          <div className="card shadow-sm" key={item.metric}>
            <div className="py-3 card-body">
              <div className="media">
                <div className="d-inline-block mt-2 icon">
                  <img src={item.icon} alt={item.label} />
                </div>
                <div className="media-body">
                  <h3 className="mb-2 count">{item.count}</h3>
                  <div className="mb-0 label">{item.label}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

ReleasedSampleHighlight.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      tissue_code: PropTypes.string.isRequired,
      sample_data: PropTypes.array.isRequired,
    })
  ).isRequired,
};

export default ReleasedSampleHighlight;
