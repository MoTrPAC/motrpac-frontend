import AnalysisReducer, { defaultAnalysisState } from '../analysisReducer';

const analysisSelectAction = {
  type: 'ANALYSIS_SELECT',
  analysis: 'PDMA',
};
const subAnalysisSelectAction = {
  type: 'SUBANALYSIS_SELECT',
  analysis: 'MA_G',
};
const goBackAction = {
  type: 'GO_BACK',
};
describe('Analysis Reducer', () => {
  test('Return initial state if no action', () => {
    expect(AnalysisReducer(defaultAnalysisState, {})).toEqual(defaultAnalysisState);
  });
  test('Selecting analysis changes current analysis', () => {
    expect(AnalysisReducer(defaultAnalysisState, analysisSelectAction).currentAnalysis)
      .toEqual(analysisSelectAction.analysis);
  });
  test('Selecting subanalysis changes current subanalysis', () => {
    expect(AnalysisReducer(defaultAnalysisState, subAnalysisSelectAction).subAnalysis)
      .toEqual(subAnalysisSelectAction.subAnalysis);
  });
  test('Depth decreases by 1', () => {
    const deepState = {
      ...defaultAnalysisState,
      depth: 3,
    };
    expect(AnalysisReducer(deepState, goBackAction).depth)
      .toEqual(deepState.depth - 1);
  });
  test('Depth does not go lower than 0', () => {
    const shallowState = {
      ...defaultAnalysisState,
      depth: 0,
    };
    expect(AnalysisReducer(shallowState, goBackAction).depth)
      .toEqual(0);
  });
  test('Depth does not go lower than 0, even when state begins negative', () => {
    const negativeDepthState = {
      ...defaultAnalysisState,
      depth: -1,
    };
    expect(AnalysisReducer(negativeDepthState, goBackAction).depth)
      .toEqual(0);
  });
});
