import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Import order is important!
import HighchartsMore from 'highcharts/highcharts-more';
import HeatMap from 'highcharts/modules/heatmap';
import Boost from 'highcharts/modules/boost';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';

// Initialize modules
HighchartsMore(Highcharts);
HeatMap(Highcharts);
Boost(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);

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
