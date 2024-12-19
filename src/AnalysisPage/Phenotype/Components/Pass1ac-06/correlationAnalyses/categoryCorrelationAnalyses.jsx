import React from 'react';
import { useSelector } from 'react-redux';
import SectionOverallCorrelationMatrix from './sectionOverallCorrelationMatrix';

/**
 * Function component for the summary statistics category of PASS1AC-06 phenotypic data analysis
 *
 * @param {array} phenoData Curated phenotypic data
 *
 * @returns JSX element of the summary statistics category
 */
function CategoryCorrelationAnalyses() {
  const analysisState = useSelector((state) => state.analysis);

  return (
    <div className="w-100 analysis-category-content-container">
      <h2>Correlation Analyses</h2>
      <p>
        In this section, we explore the relationships between key variables within
        the rat phenotypic data using correlation analyses. By examining how variables
        such as weight, distance, lactate change, and electric shocks are related to
        each other, we aim to identify patterns and potential dependencies. This helps
        to better understand the associations between these variables, which can inform
        further analysis of biological significance. The analyses include overall
        correlation matrices and detailed pairwise comparisons visualized through
        scatter plots and heatmaps.
      </p>
      {/* weight distribution section */}
      {analysisState.pass1ac06AnalysisCategoryOptions.correlationAnalysis.overall_correlation_matrix && (
        <SectionOverallCorrelationMatrix />
      )}
    </div>
  );
}

export default CategoryCorrelationAnalyses;
