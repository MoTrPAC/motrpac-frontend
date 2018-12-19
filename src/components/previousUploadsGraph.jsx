import React from 'react';
import { Bar as CBar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import colors from '../lib/colors';
// Returns an object with unique keys for each present analysis and values
//   corresponding to the count of each analysis for creating histograms
export function countUploads(data) {
  const counts = Object.create(null);
  data.forEach((point) => {
    counts[point] = counts[point] ? counts[point] + 1 : 1;
  });
  return counts;
}

function PreviousUploadsGraph({ previousUploads }) {
  const pendingQC = previousUploads.filter(upload => upload.availability === 'Pending Q.C.');
  const pendingQCCount = countUploads(pendingQC.map(upload => upload.type));
  const internalAvailable = previousUploads.filter(upload => upload.availability === 'Internally Available');
  const internalAvailableCount = countUploads(internalAvailable.map(upload => upload.type));
  const publicAvailable = previousUploads.filter(upload => upload.availability === 'Publicly Available');
  const publicAvailableCount = countUploads(publicAvailable.map(upload => upload.type));
  const data = {
    labels: Object.keys(pendingQCCount),
    datasets: [
      {
        label: 'Pending Q.C.',
        data: Object.values(pendingQCCount),
        borderColor: colors.graphs.dgray,
        borderWidth: 1,
        backgroundColor: colors.graphs.lgray,
      },
      {
        label: 'Internally Available',
        data: Object.values(internalAvailableCount),
        borderColor: colors.graphs.dblue,
        borderWidth: 1,
        backgroundColor: colors.graphs.lblue,
      },
      {
        label: 'Publicly Available',
        data: Object.values(publicAvailableCount),
        borderColor: colors.graphs.dgreen,
        borderWidth: 1,
        backgroundColor: colors.graphs.lgreen,
      },
    ],
  };
  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  };
  return (
    <div className="col-12 col-md-6 align-self-center">
      <CBar
        data={data}
        options={options}
        width={100}
        height={50}
      />
    </div>
  );
}

PreviousUploadsGraph.propTypes = {
  previousUploads: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
  })).isRequired,
};
export default PreviousUploadsGraph;
