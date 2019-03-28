import React from 'react';
import PropTypes from 'prop-types';
import AnimalPhenotypeDataAcuteTest from './animalPhenotypeAcuteTest';
import AnimalPhenotypeDataFamiliarization from './animalPhenotypeFamiliarization';

export default function AnimalDataAnalysis({
  analysis,
  subAnalysis,
}) {
  if (analysis === 'PD') {
    switch (subAnalysis) {
      case 'PD_AT':
        return <AnimalPhenotypeDataAcuteTest />;
      case 'PD_F':
        return <AnimalPhenotypeDataFamiliarization />;
      default:
        return null;
    }
  }
}

AnimalDataAnalysis.propTypes = {
  analysis: PropTypes.string.isRequired,
  subAnalysis: PropTypes.string.isRequired,
};
