import React from 'react';
import PropTypes from 'prop-types';

function DataVizLink({ title, tissue, plotType }) {
  const url = `https://data-viz-dev.motrpac-data.org/?tissues[${tissue}]=1&plot_type=${plotType}&topk=10`;

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
};

export default DataVizLink;
