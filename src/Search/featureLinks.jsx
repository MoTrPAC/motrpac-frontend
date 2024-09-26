import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory} from 'react-router-dom';
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
  userType,
}) {
  const history = useHistory();

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
      name: 'data-download',
      route: 'data-download',
      description:
        'Browse and download the available MoTrPAC study data in young adult rats by tissue, assay, or omics.',
      icon: 'cloud_download',
      title: 'Data Downloads',
      eventHandler: handleDataObjectFetch,
    },
    {
      name: 'pass1b-06-data-visualization',
      route: process.env.NODE_ENV !== 'production' ? 'https://data-viz-dev.motrpac-data.org/' : 'https://data-viz.motrpac-data.org/',
      description:
        'An interactive data visualization tool for the graphical clustering analysis of endurance training response in young adult rats.',
      icon: 'data_exploration',
      title: 'Endurance Trained Young Adult Rats Data Visualization',
      eventHandler: null,
    },
    {
      name: 'code-repositories',
      route: 'code-repositories',
      description:
        'Explore the source code essential to the workflow for the young adult rats data in the endurance training study.',
      icon: 'terminal',
      title: 'Code Repositories',
      eventHandler: null,
    },
    {
      name: 'sample-summary',
      route: 'summary',
      description:
        'A dashboard to visualize sample counts by tissue, assay, or omics in the young adult rat endurance training and acute exercise studies.',
      icon: 'assessment',
      title: 'Sample Summary',
      eventHandler: null,
    },
    /*
    {
      route: 'releases',
      description:
        'Access prior versions of the data sets in the young adult rat endurance training and acute exercise studies.',
      icon: 'rocket_launch',
      title: 'Data Releases',
      eventHandler: null,
    },
    */
    {
      name: 'motrpac-collab',
      route:
        'https://collab.motrpac-data.org/hub/oauth_login?next=%2Fhub%2Fhome',
      description:
        'A multi-user Jupyter notebook workspace containing a collection of notebooks for in-depth data exploration and analysis.',
      icon: 'hub',
      title: 'MoTrPAC Collab',
      eventHandler: null,
    },
    {
      name: 'qc-data-monitor',
      route: 'qc-data-monitor',
      description:
        'Track and visualize the sample-level data submissions and their QC statuses by omics or assays.',
      icon: 'fact_check',
      title: 'QC Data Monitor',
      eventHandler: fecthQCData,
    },
    {
      name: 'precovid-human-data-visualization',
      route: process.env.NODE_ENV !== 'production' ? 'https://data-viz-dev.motrpac-data.org/precawg' : 'https://data-viz.motrpac-data.org/precawg',
      description:
        'An interactive data visualization tool for the analysis of pre-COVID human sedentary adults study data.',
      icon: 'airline_seat_recline_normal',
      title: 'Pre-COVID Human Data Visualization',
      eventHandler: null,
    },
    {
      name: 'multiomics-working-groups',
      route: 'multiomics-working-groups',
      description:
        'Data analysis resources, including onboarding guide and Jupyter notebooks, for each of the MoTrPAC multi-omics working groups.',
      icon: 'group',
      title: 'Multi-omics Working Groups',
      eventHandler: null,
    },
  ];

  const featuresToRender = userType === 'internal' ? features : features.slice(0, 4);

  // handle click event for external links
  function handleFeatureLinkClick(e, item) {
    e.stopPropagation();

    if (item.route.indexOf('https') !== -1) {
      return window.open(item.route, '_blank');
    }

    history.push(`/${item.route}`);
    if (item.eventHandler) {
      item.eventHandler();
    }
  }

  return (
    <div className="feature-links-container pt-2">
      <div className="row row-cols-1 row-cols-xl-4 row-cols-lg-3 row-cols-sm-1 mt-5">
        {featuresToRender.map((item) => (
          <div key={item.name} className="col mb-4">
            {/*
              eslint-disable-next-line jsx-a11y/no-static-element-interactions,
              jsx-a11y/click-events-have-key-events
            */}
            <div
              className={`card h-100 mb-3 p-3 shadow-sm ${item.name}`}
              onClick={(e) => handleFeatureLinkClick(e, item)}
            >
              <div className="card-body">
                <div className="h-100 d-flex align-items-start">
                  <div className="feature-icon mr-3">
                    <span className="material-icons">{item.icon}</span>
                  </div>
                  <div className="feature-summary">
                    <h4 className="card-title">{item.title}</h4>
                    <p className="card-text">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
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
  userType: PropTypes.string,
};

FeatureLinks.defaultProps = {
  allFiles: [],
  lastModified: '',
  userType: '',
};

export default FeatureLinks;
