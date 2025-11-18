import React from 'react';
import PlotRatWork from './plotRatWork';

/**
 * Function component for rat work section of summary statistics category
 * in the PASS1AC-06 phenotypic data analysis
 *
 * @param {array} phenoData Curated phenotypic data
 *
 * @returns JSX element of the rat work section
 */
function SectionRatWork() {
  return (
    <div className="analysis-section-content-container w-100">
      <h3>Rat Work</h3>
      <p>
        The rats ran on the treadmill set to 5 degrees, which equals an incline
        of 8.7%. Therefore, the work is calculated in joules using 8.7% as the
        slope.
      </p>
      <p>
        <span className="font-weight-bold">Equation - </span>
        <code>
          Work = (Body weight (g) / 1000) x distance (meters) x 0.087 x9.80665
        </code>
      </p>
      <p>
        <span className="font-weight-bold">Example - </span>
        <span>For a rat weighing 0.200 kg running 500 meters: </span>
        <code>Work = 0.200 x 500 x 0.087 x 9.80665 = 85.318 joules</code>
      </p>
      <div className="analysis-section-plot-container row mb-4">
        {/* phenotypic data analysis plots */}
        <PlotRatWork />
      </div>
    </div>
  );
}

export default SectionRatWork;
