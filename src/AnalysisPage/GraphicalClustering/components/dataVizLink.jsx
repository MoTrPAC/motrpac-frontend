import React from 'react';
import PropTypes from 'prop-types';

function DataVizLink({
  title, tissue, plotType, minClusterSize, clusterName,
}) {
  let topkStr = '';
  let minClusterSizeStr = '';
  let clusterNameStr = '';

  // include 'topk' param for non-trajectory plots
  if (plotType !== 'Trajectories') {
    topkStr = '&topk=10';
  }

  // include 'cluster' param for pathway plots
  if (plotType === 'Pathway') {
    topkStr = '';
    clusterNameStr = clusterName && clusterName.length ? `&cluster=${clusterName}` : '';
  }

  // include 'min_cluster_size' param if minClusterSize is provided
  if (minClusterSize && typeof (minClusterSize) === 'number') {
    minClusterSizeStr = `&min_cluster_size=${minClusterSize}`;
  }

  const url = `https://data-viz.motrpac-data.org/?tissues[${tissue}]=1&plot_type=${plotType}${topkStr}${minClusterSizeStr}${clusterNameStr}`;

  return (
    <p className="data-visualization-link-container text-center">
      <a
        className="btn btn-primary data-viz-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        role="button"
      >
        {`Explore interactive ${title} visualization`}
      </a>
    </p>
  );
}

DataVizLink.propTypes = {
  title: PropTypes.string.isRequired,
  tissue: PropTypes.string.isRequired,
  plotType: PropTypes.string.isRequired,
  minClusterSize: PropTypes.number,
  clusterName: PropTypes.string,
};

DataVizLink.defaultProps = {
  minClusterSize: null,
  clusterName: null,
};

export default DataVizLink;
