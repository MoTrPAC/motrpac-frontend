import {
  DATA_STATUS_VIEW_CHANGE,
} from './dataStatusActions';

export const defaultDataStatusState = {
  dataStatusView: 'metabolomics',
  qcData: {
    metabolomics: [],
    rnaseq: [],
    rrbs: [],
    atacseq: [],
  },
  errorMsg: '',
  isFetchingQcData: false,
};

// Reducer to handle actions sent from components related to advanced search form
export function DataStatusReducer(state = { ...defaultDataStatusState }, action) {
  // Handle states given the action types
  switch (action.type) {
    // Handle different data QC views toggle
    case DATA_STATUS_VIEW_CHANGE: {
      return {
        ...state,
        dataStatusView: action.value,
      };
    }

    default:
      return state;
  }
}

export default DataStatusReducer;
