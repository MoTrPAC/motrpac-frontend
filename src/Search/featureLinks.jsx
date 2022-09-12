import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

/**
 * Renders the feature links on  search page
 *
 * @returns {Object} JSX representation of portal feature link card deck.
 */
function FeatureLinks({
  handleDataFetch,
  handleQCDataFetch,
  allFiles,
  lastModified,
}) {
  const handleDataObjectFetch = () => {
    if (allFiles.length === 0) {
      handleDataFetch();
    }
  };

  // Call to invoke Redux action to fetch QC data
  // if timestamp is empty or older than 24 hours
  const fecthQCData = () => {
    if (
      !lastModified ||
      !lastModified.length ||
      (lastModified.length && dayjs().diff(dayjs(lastModified), 'hour') >= 24)
    ) {
      handleQCDataFetch();
    }
  };

  const features = [
    {
      route: 'releases',
      description: 'Access data sets from prior data releases.',
      icon: 'rocket_launch',
      title: 'Data Releases',
      eventHandler: null,
    },
    {
      route: 'browse-data',
      description: 'Browse and download data by tissue, assay, or omics.',
      icon: 'view_list',
      title: 'Browse Data',
      eventHandler: handleDataObjectFetch,
    },
    {
      route: 'phenotype',
      description: 'Explore and download phenotypic data.',
      icon: 'bubble_chart',
      title: 'Phenotype',
      eventHandler: null,
    },
    {
      route: 'qc-data-monitor',
      description: 'Track submitted samples and their QC statuses.',
      icon: 'fact_check',
      title: 'QC Data Monitor',
      eventHandler: fecthQCData,
    },
    {
      route: 'summary',
      description: 'Overview of sample counts by tissue, assay, or omics.',
      icon: 'assessment',
      title: 'Sample Summary',
      eventHandler: null,
    },
  ];

  return (
    <div className="feature-links-container pt-2">
      <div className="card-deck mt-5">
        {features.map((item) => (
          <div
            key={item.route}
            className={`card mb-3 px-2 py-3 shadow-sm ${item.route}`}
          >
            <Link to={`/${item.route}`} onClick={item.eventHandler}>
              <div className="card-body">
                <div className="h-100 d-flex align-items-start">
                  <div className="feature-icon mr-2">
                    <span className="material-icons">{item.icon}</span>
                  </div>
                  <div className="feature-summary">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

FeatureLinks.propTypes = {
  handleDataFetch: PropTypes.func.isRequired,
  handleQCDataFetch: PropTypes.func.isRequired,
  allFiles: PropTypes.arrayOf(PropTypes.shape({})),
  lastModified: PropTypes.string,
};

FeatureLinks.defaultProps = {
  allFiles: [],
  lastModified: '',
};

export default FeatureLinks;
