import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import { Doughnut } from 'react-chartjs-2';
import { countUploads } from './previousUploadsGraph';
import colors from '../lib/colors';

function AllUploadsDoughnut({ allUploads }) {
  const types = [...new Set(allUploads.map(upload => upload.availability))];
  const availabilityCount = countUploads(allUploads.map(upload => upload.availability), types);
  const baseColors = [colors.base_palette.accent_green, colors.base_palette.primary_blue, colors.base_palette.stanford_cool_grey];
  const borderColors = baseColors.map(c => tinycolor(c).darken(10).toHexString());
  const bgColors = baseColors.map(c => tinycolor(c).lighten(10).toHexString());
  const data = {
    labels: Object.keys(availabilityCount),
    datasets: [
      {
        data: Object.values(availabilityCount),
        backgroundColor: bgColors,
        borderColor: borderColors,
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
