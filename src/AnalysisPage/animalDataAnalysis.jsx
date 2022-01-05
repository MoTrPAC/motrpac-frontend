import React from 'react';
import PropTypes from 'prop-types';
import Pass1b06PhenotypeAnimalConnected from './pass1b06PhenotypeAnimal';
import DifferenrialExpressionConnected from '../DataExploration/DifferentialExpression/differentialExpressionPage';
import GeneCentricSearch from '../DataExploration/GeneCentricResults/geneCentricSearch';

export default function AnimalDataAnalysis({ analysis }) {
  switch (analysis) {
    case 'PHENOTYPE':
      return <Pass1b06PhenotypeAnimalConnected />;
    case 'DEA':
      return <DifferenrialExpressionConnected />;
    case 'GENE_CENTRIC_RESULTS':
      return <GeneCentricSearch />;
    default:
      return null;
  }
}

AnimalDataAnalysis.propTypes = {
  analysis: PropTypes.string.isRequired,
};
