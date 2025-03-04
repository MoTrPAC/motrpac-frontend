import React from 'react';
import PlotWeightDistribution from './plotWeightDistribution';

/**
 * Function component for weight distribution section of summary statistics category
 * in the PASS1AC-06 phenotypic data analysis
 *
 * @param {array} phenoData Curated phenotypic data
 *
 * @returns JSX element of the weight distribution section
 */
function SectionWeightDistribution() {
  return (
    <div className="analysis-section-content-container w-100">
      <h3>Weight Distribution</h3>
      <div className="analysis-section-plot-container row mb-4">
        {/* phenotpypic data analysis plots */}
        <PlotWeightDistribution />
      </div>
    </div>
  );
}

export default SectionWeightDistribution;
