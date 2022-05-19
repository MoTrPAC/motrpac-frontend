import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const features = [
  {
    route: 'releases',
    description: 'Access data sets from prior data releases.',
    icon: 'rocket_launch',
    title: 'Data Releases',
  },
  {
    route: 'browse-data',
    description: 'Browse and download data by tissue, assay, or omics.',
    icon: 'view_list',
    title: 'Browse Data',
  },
  {
    route: 'qc-data-monitor',
    description: 'Track submitted samples and their QC statuses.',
    icon: 'fact_check',
    title: 'QC Data Monitor',
  },
  {
    route: 'summary',
    description: 'Overview of sample counts by tissue, assay, or omics.',
    icon: 'assessment',
    title: 'Sample Summary',
  },
];

/**
 * Renders the feature links on  search page
 *
 * @returns {Object} JSX representation of portal feature link card deck.
 */
function FeatureLinks({ handleDataFetch, allFiles }) {
  const handleDataObjectFetch = () => {
    if (allFiles.length === 0) {
      handleDataFetch();
    }
  };

  return (
    <div className="feature-links-container pt-2">
      <div className="card-deck mt-5">
        {features.map((item) => (
          <div
            key={item.route}
            className={`card mb-3 p-3 shadow-sm ${item.route}`}
          >
            <Link
              to={`/${item.route}`}
              onClick={
                item.route === 'browse-data' ? handleDataObjectFetch : null
              }
            >
              <div className="card-body">
                <div className="h-100 d-flex align-items-start">
                  <div className="feature-icon mr-3">
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
  allFiles: PropTypes.arrayOf(PropTypes.shape({})),
};

FeatureLinks.defaultProps = {
  allFiles: [],
};

export default FeatureLinks;
