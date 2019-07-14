import React from 'react';
import PropTypes from 'prop-types';
import HumanGeneMetaAnalysis from './humanGeneMetaAnalysis';

export default function HumanDataAnalysis({
  analysis,
  subAnalysis,
}) {
  if (analysis === 'PDMA') {
    switch (subAnalysis) {
      case 'MA_G':
        return <HumanGeneMetaAnalysis />;
      default:
        return null;
    }
  }
}

HumanDataAnalysis.propTypes = {
  analysis: PropTypes.string.isRequired,
  subAnalysis: PropTypes.string.isRequired,
};
