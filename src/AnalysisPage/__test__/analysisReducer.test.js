import { describe, test, expect } from 'vitest';
import AnalysisReducer, { defaultAnalysisState } from '../analysisReducer';

const analysisSelectAction = {
  type: 'ANALYSIS_SELECT',
  analysis: 'PHENOTYPE',
};

const goBackAction = {
  type: 'GO_BACK',
};

describe('Analysis Reducer', () => {
  test('Return initial state if no action', () => {
    expect(AnalysisReducer(defaultAnalysisState, {})).toEqual(
      defaultAnalysisState,
    );
  });
  test('Selecting analysis changes current analysis', () => {
    expect(
      AnalysisReducer(defaultAnalysisState, analysisSelectAction)
        .currentAnalysis,
    ).toEqual(analysisSelectAction.analysis);
  });
  test('Depth decreases by 1', () => {
    const deepState = {
      ...defaultAnalysisState,
      depth: 2,
    };
    expect(AnalysisReducer(deepState, goBackAction).depth).toEqual(
      deepState.depth - 1,
    );
  });
  test('Depth does not go lower than 0', () => {
    const shallowState = {
      ...defaultAnalysisState,
      depth: 0,
    };
    expect(AnalysisReducer(shallowState, goBackAction).depth).toEqual(0);
  });
  test('Depth does not go lower than 0, even when state begins negative', () => {
    const negativeDepthState = {
      ...defaultAnalysisState,
      depth: -1,
    };
    expect(AnalysisReducer(negativeDepthState, goBackAction).depth).toEqual(0);
  });
});
