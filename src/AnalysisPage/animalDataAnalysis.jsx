import React from 'react';
import PropTypes from 'prop-types';
import Pass1b06PhenotypeAnimalConnected from './pass1b06PhenotypeAnimal';
import DifferenrialExpressionConnected from '../DataExploration/DifferentialExpression/differentialExpressionPage';
import GraphicalClustering from './GraphicalClustering/graphicalClusteringPage';

export default function AnimalDataAnalysis({ analysis }) {
  switch (analysis) {
    case 'PHENOTYPE':
      return <Pass1b06PhenotypeAnimalConnected />;
    case 'DEA':
      return <DifferenrialExpressionConnected />;
    case 'GRAPHICAL_CLUSTERING':
      return <GraphicalClustering />;
    default:
      return null;
  }
}

AnimalDataAnalysis.propTypes = {
  analysis: PropTypes.string.isRequired,
};
