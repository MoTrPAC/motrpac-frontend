import React from 'react';
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
function FeatureLinks() {
  return (
    <div className="feature-links-container pt-2">
      <div className="card-deck mt-5">
        {features.map((item) => (
          <div
            key={item.route}
            className={`card mb-3 px-4 py-1 shadow-sm ${item.route}`}
          >
            <Link to={`/${item.route}`}>
              <div className="row no-gutters h-100">
                <div className="col-md-3 d-flex align-items-center">
                  <span className="material-icons w-100">{item.icon}</span>
                </div>
                <div className="col-md-9">
                  <div className="card-body">
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

export default FeatureLinks;
