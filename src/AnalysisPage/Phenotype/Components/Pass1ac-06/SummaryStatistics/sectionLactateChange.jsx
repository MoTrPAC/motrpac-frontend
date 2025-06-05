import React from 'react';
import PlotLactateChange from './plotLactateChange';

/**
 * Function component for lactate change section of summary statistics category
 * in the PASS1AC-06 phenotypic data analysis
 *
 * @param {array} phenoData Curated phenotypic data
 *
 * @returns JSX element of the lactate change section
 */
function SectionLactateChange() {
  return (
    <div className="analysis-section-content-container w-100">
      <h3>Lactate Change (before / after) Due to Acute Exercise</h3>
      <div className="analysis-section-plot-container row mb-4">
        {/* phenotypic data analysis plots */}
        <PlotLactateChange />
      </div>
    </div>
  );
}

export default SectionLactateChange;
