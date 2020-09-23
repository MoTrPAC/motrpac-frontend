import React from 'react';
import PropTypes from 'prop-types';
import getIcon from '../assets/dashboardIcons/get.png';
import metabolomicsIcon from '../assets/dashboardIcons/metabolomics.png';
import proteomicsIcon from '../assets/dashboardIcons/proteomics.png';
import assayIcon from '../assets/dashboardIcons/assay.png';
import tissueIcon from '../assets/dashboardIcons/tissue.png';

/**
 * Renders the highlighted items of release samples on dashboard
 *
 * @param {Array} data  Array of tissue sample metadata by phase/release
 *
 * @returns {object} JSX representation of the dashboard highlighted items
 */
function ReleasedSampleHighlight({ data }) {
  // Utility function to get total count of
  // a given omic from each tissue
  function omicSet(omic) {
    let count = 0;
    data.forEach((tissueSample) => {
      tissueSample.sample_data.forEach((item) => {
        if (item.omics_code === omic && item.count) {
          count += Number(item.count);
        }
      });
    });
    return count;
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
        return omicSet('proteomics');
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
      label: 'Assays',
      count: getCount('assay'),
      icon: assayIcon,
    },
    {
      metric: 'get',
      label: 'Genomics Samples',
      count: getCount('get'),
      icon: getIcon,
    },
    {
      metric: 'metabolomic',
      label: 'Metabolomics Samples',
      count: getCount('metabolomics'),
      icon: metabolomicsIcon,
    },
    {
      metric: 'proteomic',
      label: 'Proteomics Samples',
      count: getCount('proteomics'),
      icon: proteomicsIcon,
    },
  ];

  return (
    <div className="dashboard-highlights row">
      {highlightItems.map((item) => {
        return (
          <div className="col-md-6 col-xl" key={item.metric}>
            <div className="flex-fill card shadow-sm">
              <div className="py-3 card-body">
                <div className="media">
                  <div className="d-inline-block mt-2 mr-3">
                    <img src={item.icon} alt={item.label} />
                  </div>
                  <div className="media-body">
                    <h3 className="mb-2">{item.count}</h3>
                    <div className="mb-0">{item.label}</div>
                  </div>
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
