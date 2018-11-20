export const defaultAnalysisState = {
  currentAnalysis: '',
  depth: 0,
};

export default function AnalysisReducer(state = { ...defaultAnalysisState }, action) {
  switch (action.type) {
    case 'ANALYSIS_SELECT':
      return {
        ...state,
        currentAnalysis: action.analysis,
        analysisSelected: true,
        depth: 1,
      };
    case 'GO_BACK':
      return {
        ...state,
        depth: state.depth ? state.depth - 1 : 0,
      };
    default:
      return state;
  }
}
