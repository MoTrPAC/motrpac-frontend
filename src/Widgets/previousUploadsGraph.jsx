import React from 'react';
import { Bar as CBar } from 'react-chartjs-2';
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


  // Pending Q.C. sorted data
  const pendingQC = previousUploads.filter(upload => upload.availability === 'Pending Q.C.');
  const pendingQCCount = countUploads(pendingQC.map(upload => upload.dataType), types);

  // Internally available sorted data
  const internalAvailable = previousUploads.filter(upload => upload.availability === 'Internally Available');
  const internalAvailableCount = countUploads(internalAvailable.map(upload => upload.dataType), types);

  // Publically available sorted data
  const publicAvailable = previousUploads.filter(upload => upload.availability === 'Publicly Available');
  const publicAvailableCount = countUploads(publicAvailable.map(upload => upload.dataType), types);

  // Input to chartJS bar chart
  const data = {
    labels: Object.keys(pendingQCCount),
    datasets: [
      {
        label: 'Pending Q.C.',
        data: Object.values(pendingQCCount),
        borderWidth: 1,
        backgroundColor: colors.base_palette.accent_yellow,
      },
      {
        label: 'Internally Available',
        data: Object.values(internalAvailableCount),
        borderWidth: 1,
        backgroundColor: colors.base_palette.primary_blue,
      },
      {
        label: 'Publicly Available',
        data: Object.values(publicAvailableCount),
        borderWidth: 1,
        backgroundColor: colors.base_palette.accent_green,
      },
    ],
  };

  // increment y axis scale to be 1 or greater than the highest
  // upload number (regardless of statues) on bar chart
  const uploadRange = [];
  if (data && data.datasets && data.datasets.length) {
    data.datasets.forEach((set) => {
      uploadRange.push(...set.data);
    });
  }
  const maxScaleY = Math.max(...uploadRange);

  // ChartJS formatting options
  const options = {
    scales: {
      yAxes: [{
        ticks: {
          stepSize: 1, // integer only
          beginAtZero: true,
          suggestedMax: +maxScaleY + 1,
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
    <div className="col-12 chartCol align-self-center">
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
