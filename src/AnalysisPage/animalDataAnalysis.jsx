import React from 'react';
import PropTypes from 'prop-types';
import AnimalPhenotypeData from './animalPhenotypeData';

export default function AnimalDataAnalysis({ analysis }) {
  if (analysis === 'PHENOTYPE') {
    return <AnimalPhenotypeData />;
  }

  return null;
}

AnimalDataAnalysis.propTypes = {
  analysis: PropTypes.string.isRequired,
};
