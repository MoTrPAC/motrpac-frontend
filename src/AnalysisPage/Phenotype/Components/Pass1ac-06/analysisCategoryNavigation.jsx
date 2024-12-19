import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AnalysisActions from '../../../analysisActions';

const analysisCategories = [
  {
    title: 'Summary Statistics',
    categoryVal: 'summaryStatistics',
    selections: [
      { label: 'Weight Distribution', value: 'weight_distribution' },
      { label: 'Lactate Change (before / after) Due to Acute Exercise', value: 'lactate_change' },
      { label: 'Rat Work', value: 'rat_work' },
    ],
  },
  {
    title: 'Correlation Analyses',
    categoryVal: 'correlationAnalysis',
    selections: [
      { label: 'Overall Correlation Matrix', value: 'overall_correlation_matrix' },
    ],
  },
];

/**
 * Analysis Category Navigation component
 * - Displays the analysis categories for the user to select to view
 */
function AnalysisCategoryNavigation() {
  const analysisState = useSelector((state) => state.analysis);
  const dispatch = useDispatch();

  return (
    <div className="col-lg-2 analysis-category-navigation-container">
      <div className="card bg-light shadow-sm analysis-category-navigation-panel">
        <div className="card-header panel-header">
          <span className="font-weight-bold panel-header-text">Analysis Categories</span>
        </div>
        <div className="card-body">
          {analysisCategories.map((category) => (
            <div className="form-group" key={category.title}>
              <h6>{category.title}</h6>
              <div className="form-group">
                {category.selections.map((sel) => {
                  const otherValues = category.selections.filter((s) => s.value !== sel.value);
                  const isOtherChecked = otherValues.find((s) => analysisState.pass1ac06AnalysisCategoryOptions[category.categoryVal][s.value]);

                  return (
                    <div className="form-group form-check selection-item" key={sel.label}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={sel.label}
                        value={sel.value}
                        checked={
                          analysisState.pass1ac06AnalysisCategoryOptions[category.categoryVal][
                            sel.value
                          ]
                        }
                        disabled={!isOtherChecked}
                        onChange={() => dispatch(
                          AnalysisActions.pass1ac06AnalysisCategoryOptionChange(
                            category.categoryVal,
                            sel.value,
                          ),
                        )}
                      />
                      <label className="form-check-label" htmlFor={sel.label}>{sel.label}</label>
                    </div>
                  );
})}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalysisCategoryNavigation;
