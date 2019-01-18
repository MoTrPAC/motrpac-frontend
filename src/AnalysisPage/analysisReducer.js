export const defaultAnalysisState = {
  match: {
    params: {
      subjectType: '',
    },
  },
  currentAnalysis: '',
  currentSubAnalysis: '',
  depth: 0,
  analysisSelected: false,
  subAnalysisSelected: false,
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
    case 'SUBANALYSIS_SELECT':
      return {
        ...state,
        currentSubAnalysis: action.subAnalysis,
        subAnalysisSelected: true,
        depth: 2,
      };
    case 'GO_BACK':
      return {
        ...state,
        depth: (state.depth > 0) ? state.depth - 1 : 0,
      };
    default:
      return state;
  }
}
