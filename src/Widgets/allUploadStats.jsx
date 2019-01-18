import React from 'react';
import PropTypes from 'prop-types';

const stats = {
  totalSamples: 176,
  totalSize: 13.4,
};

function AllUploadStats({ allUploadStats }) {
  return (
    <div className="col uploadStats align-self-center ">
      <p className="align-middle">
        Total Samples:&nbsp;
        <span className="green">
          {allUploadStats.totalSamples}
        </span>
      </p>
      <p className="align-middle">
        Total Data Size:&nbsp;
        <span className="green">
          {allUploadStats.totalSize}
          &nbsp;GB
        </span>
      </p>
    </div>
  );
}

AllUploadStats.propTypes = {
  allUploadStats: PropTypes.shape({
    totalSamples: PropTypes.number.isRequired,
    totalSize: PropTypes.number.isRequired,
  }),
};
AllUploadStats.defaultProps = {
  allUploadStats: stats,
};

export default AllUploadStats;
