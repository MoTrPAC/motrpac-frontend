import React from 'react';
import PropTypes from 'prop-types';
import HumanGeneMetaAnalysis from './humanGeneMetaAnalysis';

export default function HumanDataAnalysis({ analysis, subAnalysis }) {
  if (analysis === 'META_ANALYSIS') {
    switch (subAnalysis) {
      case 'META_ANALYSIS_PUBLIC_DATA':
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
