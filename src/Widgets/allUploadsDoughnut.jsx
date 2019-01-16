import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import { countUploads } from './previousUploadsGraph';
import colors from '../lib/colors';

function AllUploadsDoughnut({ allUploads }) {
  const types = [...new Set(allUploads.map(upload => upload.availability))];
  const availabilityCount = countUploads(allUploads.map(upload => upload.availability), types);
  const data = {
    labels: Object.keys(availabilityCount),
    datasets: [
      {
        data: Object.values(availabilityCount),
        backgroundColor: [colors.graphs.lgreen, colors.graphs.lblue, colors.graphs.lgray],
        borderColor: [colors.graphs.dgreen, colors.graphs.dblue, colors.graphs.dgray],
        borderWidth: 0.5,
      },
    ],
  };
  return (
    <div className="col-8 col-md-4 align-self-center">
      <Doughnut
        data={data}
        width={50}
        height={50}
      />
    </div>
  );
}
AllUploadsDoughnut.propTypes = {
  allUploads: PropTypes.arrayOf(PropTypes.shape({
    availability: PropTypes.string.isRequired,
  })).isRequired,
};

export default AllUploadsDoughnut;
