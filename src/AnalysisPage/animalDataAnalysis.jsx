import React from 'react';
import PropTypes from 'prop-types';
import AnimalPhenotypeData from './animalPhenotypeData';

export default function AnimalDataAnalysis({
  analysis,
  subAnalysis,
}) {
  if (analysis === 'PD') {
    switch (subAnalysis) {
      case 'APD':
        return <AnimalPhenotypeData />;
      default:
        return null;
    }
  }
}

AnimalDataAnalysis.propTypes = {
  analysis: PropTypes.string.isRequired,
  subAnalysis: PropTypes.string.isRequired,
};
