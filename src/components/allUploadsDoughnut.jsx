import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import { countUploads } from './previousUploadsGraph';

function AllUploadsDoughnut({ allUploads }) {
  const availabilityCount = countUploads(allUploads.map(upload => upload.availability));
  const data = {
    labels: Object.keys(availabilityCount),
    datasets: [
      {
        data: Object.values(availabilityCount),
        backgroundColor: ['#EAEFF4', '#EDF4EC', '#F1F1F1'],
        borderColor: ['#11397E', '#4C9046', 'gray'],
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
