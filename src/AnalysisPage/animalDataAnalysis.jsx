import React from 'react';
import PropTypes from 'prop-types';
import Pass1b06PhenotypeAnimalConnected from './pass1b06PhenotypeAnimal';

export default function AnimalDataAnalysis({ analysis }) {
  if (analysis === 'PHENOTYPE') {
    return <Pass1b06PhenotypeAnimalConnected />;
  }

  return null;
}

AnimalDataAnalysis.propTypes = {
  analysis: PropTypes.string.isRequired,
};
