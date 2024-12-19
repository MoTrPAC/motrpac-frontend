import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Import order is important!
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/boost')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

/**
 * A component to render a Highcharts chart wrapper container.
 * @param {Object} options - Options for rendering Highcharts.
 * @param {String} className - Class name for HighchartsReact containerProps.
 * @returns {JSX.Element} - The rendered JSX object.
 */
function Chart({ options, className }) {
  return (
    <div className="flex-fill w-100 card shadow-sm mb-3">
      <div className="card-body">
        <div className="plot-container">
          <div className="w-100">
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              containerProps={{ className }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Chart.propTypes = {
  options: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};

export default Chart;
