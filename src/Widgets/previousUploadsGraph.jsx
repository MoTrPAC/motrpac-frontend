import React from 'react';
import { Bar as CBar } from 'react-chartjs-2';
import tinycolor from 'tinycolor2';
import PropTypes from 'prop-types';
import colors from '../lib/colors';

/**
 * Returns an object with unique keys for each present analysis and values
 * corresponding to the count of each analysis for creating histograms
 *
 * @param {Object} data data set to have occurances counted
 * @param {Array} types Array of unique labels for the data
 * @return {Object} Number of occurances for each type of data
 */
export function countUploads(data, types) {
  const counts = {};
  types.forEach((type) => { counts[type] = 0; });
  data.forEach((point) => {
    counts[point] += 1;
  });
  return counts;
}

function PreviousUploadsGraph({ previousUploads }) {
  const types = [...new Set(previousUploads.map(upload => upload.dataType))];
  const baseColors = Object.values(colors.base_palette);

  const shadeAmount = 19; // % difference in shades of fill color in bar chart
  const borderDiff = 5; // % difference in shade between border and fill color

  // Pending Q.C. sorted data
  const pendingQC = previousUploads.filter(upload => upload.availability === 'Pending Q.C.');
  const pendingQCCount = countUploads(pendingQC.map(upload => upload.dataType), types);
  const pendingQCColors = baseColors.map(color => tinycolor(color).lighten(shadeAmount).toHexString());
  const pendingQCBorders = baseColors.map(color => tinycolor(color).lighten(shadeAmount - borderDiff).toHexString());

  // Internally available sorted data
  const internalAvailable = previousUploads.filter(upload => upload.availability === 'Internally Available');
  const internalAvailableCount = countUploads(internalAvailable.map(upload => upload.dataType), types);
  const internalAvailableColors = baseColors;
  const internalAvailableBorders = baseColors.map(color => tinycolor(color).lighten(-borderDiff).toHexString());

  // Publically available sorted data
  const publicAvailable = previousUploads.filter(upload => upload.availability === 'Publicly Available');
  const publicAvailableCount = countUploads(publicAvailable.map(upload => upload.dataType), types);
  const publicAvailableColors = baseColors.map(color => tinycolor(color).lighten(-shadeAmount).toHexString());
  const publicAvailableBorders = baseColors.map(color => tinycolor(color).lighten(-shadeAmount - borderDiff).toHexString());

  // Input to chartJS bar chart
  const data = {
    labels: Object.keys(pendingQCCount),
    datasets: [
      {
        label: 'Pending Q.C.',
        data: Object.values(pendingQCCount),
        // borderColor: pendingQCBorders,
        borderWidth: 1,
        // backgroundColor: pendingQCColors,
        backgroundColor: colors.base_palette.accent_yellow,
      },
      {
        label: 'Internally Available',
        data: Object.values(internalAvailableCount),
        // borderColor: internalAvailableBorders,
        borderWidth: 1,
        // backgroundColor: internalAvailableColors,
        backgroundColor: colors.base_palette.primary_blue,
      },
      {
        label: 'Publicly Available',
        data: Object.values(publicAvailableCount),
        // borderColor: publicAvailableBorders,
        borderWidth: 1,
        // backgroundColor: publicAvailableColors,
        backgroundColor: colors.base_palette.accent_green,
      },
    ],
  };

  // ChartJS formatting options
  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
        scaleLabel: {
          display: true,
          labelString: '# Of Uploads',
          fontSize: 15,
        },
      }],
      xAxes: [{
        stacked: false,
        ticks: {
          fontSize: 15,
          fontStyle: 'bold',
        },
      }],
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <div className="col-12 col-lg-5 chartCol align-self-center">
      <CBar
        data={data}
        options={options}
      />
    </div>
  );
}

PreviousUploadsGraph.propTypes = {
  previousUploads: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
  })).isRequired,
};
export default PreviousUploadsGraph;
