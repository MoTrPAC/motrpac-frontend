import React from 'react';
import AnalysisCategoryNavigation from './Components/Pass1ac-06/analysisCategoryNavigation';
import CategorySummaryStatistics from './Components/Pass1ac-06/SummaryStatistics/categorySummaryStatistics';
import CategoryCorrelationAnalyses from './Components/Pass1ac-06/correlationAnalyses/categoryCorrelationAnalyses';

/**
 * Functional component for PASS1AC-06 phenotypic data analysis visualization
 *
 * @return JSX element of the PASS1AC-06 phenotypic data analysis
 */
function PhenotypePass1a06Rats() {
  return (
    <div className="analysis-phenotype-container pass1ac-06">
      <div className="analysis-phenotype-summary-container row mb-4">
        <div className="lead col-12">
          This analysis aims to investigate the phenotypic data collected from
          the MoTrPAC PASS1A/1C study, focusing on key variables that may impact
          differential analysis results. Understanding these variables is
          crucial for ensuring that our statistical models accurately reflect
          the biological processes underlying exercise response and adaptation.
        </div>
      </div>
      <div className="analysis-phenotype-plot-container row mb-4">
        {/* analysis category navigation component */}
        <AnalysisCategoryNavigation />
        {/* content of analysis categories */}
        <div className="col-lg-10 analysis-category-content-container">
          <CategorySummaryStatistics />
          <CategoryCorrelationAnalyses />
        </div>
      </div>
    </div>
  );
}

export default PhenotypePass1a06Rats;
