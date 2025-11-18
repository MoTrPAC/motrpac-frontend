import React from 'react';
import { useSelector } from 'react-redux';
import SectionWeightDistribution from './sectionWeightDistribution';
import SectionLactateChange from './sectionLactateChange';
import SectionRatWork from './sectionRatWork';

/**
 * Function component for the summary statistics category of PASS1AC-06 phenotypic data analysis
 *
 * @param {array} phenoData Curated phenotypic data
 *
 * @returns JSX element of the summary statistics category
 */
function CategorySummaryStatistics() {
  const analysisState = useSelector((state) => state.analysis);

  return (
    <div className="w-100 analysis-category-content-container">
      <h2>Summary Statistics</h2>
      <p>
        In this section, various summary statistics and visualizations that
        explore key variables across the phenotypic data are presented. The
        analysis covers weight distribution, electric shocks (both number and
        duration), distance covered during the acute test, and lactate changes
        due to exercise. Each variable is visualized through a combination of
        boxplots, histograms, and density plots, broken down by relevant factors
        such as sex, phase, and intervention group. Additionally, we analyze the
        time taken to freeze tissues, including comparisons across different
        groups and a detailed look at the order in which tissues were frozen for
        each animal. These visualizations help to identify patterns and trends
        within the phenotypic data.
      </p>
      {/* weight distribution section */}
      {analysisState.pass1ac06AnalysisCategoryOptions.summaryStatistics
        .weight_distribution && <SectionWeightDistribution />}
      {/* lactate change section */}
      {analysisState.pass1ac06AnalysisCategoryOptions.summaryStatistics
        .lactate_change && <SectionLactateChange />}
      {/* rat work section */}
      {analysisState.pass1ac06AnalysisCategoryOptions.summaryStatistics
        .rat_work && <SectionRatWork />}
    </div>
  );
}

export default CategorySummaryStatistics;
