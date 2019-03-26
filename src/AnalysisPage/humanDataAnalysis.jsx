import React from 'react';
import PropTypes from 'prop-types';

export default function HumanDataAnalysis({
  analysis,
  subAnalysis,
}) {
  return (
    <div className="data-analysis-container">
      Coming Soon
    </div>
  );
}

HumanDataAnalysis.propTypes = {
  analysis: PropTypes.string.isRequired,
  subAnalysis: PropTypes.string.isRequired,
};
