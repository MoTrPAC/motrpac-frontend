import React from 'react';
import PropTypes from 'prop-types';
import DifferentialExpressionConnected from '../DataExploration/DifferentialExpression/differentialExpressionPage';
import GeneCentricViewConnected from './GeneCentricViewRat/geneCentricViewPage';
import GraphicalClustering from './GraphicalClustering/graphicalClusteringPage';
import Pass1b06PhenotypeAnimalConnected from './pass1b06PhenotypeAnimal';

export default function AnimalDataAnalysis({ analysis }) {
  switch (analysis) {
    case 'PHENOTYPE':
      return <Pass1b06PhenotypeAnimalConnected />;
    case 'DEA':
      return <DifferentialExpressionConnected />;
    case 'GRAPHICAL_CLUSTERING':
      return <GraphicalClustering />;
    case 'GENE_CENTRIC_RAT':
      return <GeneCentricViewConnected />;
    default:
      return null;
  }
}

AnimalDataAnalysis.propTypes = {
  analysis: PropTypes.string.isRequired,
};
