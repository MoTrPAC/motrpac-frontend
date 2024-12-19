import React from 'react';
import PlotOverallCorrelationMatrix from './plotOverallCorrelationMatrix';

/**
 * Function component for weight distribution section of summary statistics category
 * in the PASS1AC-06 phenotypic data analysis
 *
 * @param {array} phenoData Curated phenotypic data
 *
 * @returns JSX element of the weight distribution section
 */
function SectionOverallCorrelationMatrix() {
  return (
    <div className="analysis-section-content-container w-100">
      <h3>Overall Correlation Matrix</h3>
      <div className="analysis-section-plot-container row mb-4">
        {/* phenotpypic data analysis plots */}
        <PlotOverallCorrelationMatrix />
      </div>
    </div>
  );
}

export default SectionOverallCorrelationMatrix;
