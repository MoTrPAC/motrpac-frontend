import {
  QC_REPORT_VIEW_CHANGE,
  QC_DATA_FETCH_REQUEST,
  QC_DATA_FETCH_SUCCESS,
  QC_DATA_FETCH_FAILURE,
} from './dataStatusActions';

export const defaultDataStatusState = {
  qcReportView: 'phase',
  qcData: {
    atacSeq: [],
    immunoAssay: [],
    metabolomics: [],
    proteomics: [],
    rnaSeq: [],
    rrbs: [],
    lastModified: '',
  },
  errMsg: '',
  isFetchingQcData: false,
};

// Reducer to handle actions sent from components pertinent to data QC status page
export function DataStatusReducer(
  state = { ...defaultDataStatusState },
  action
) {
  // Handle states given the action types
  switch (action.type) {
    // Handle different data QC views toggle
    case QC_REPORT_VIEW_CHANGE:
      return {
        ...state,
        qcReportView: action.value,
      };

    case QC_DATA_FETCH_REQUEST:
      return {
        ...state,
        isFetchingQcData: true,
      };

    case QC_DATA_FETCH_SUCCESS:
      return {
        ...state,
        qcData: action.payload,
        isFetchingQcData: false,
      };

    // Handle data fetch error
    case QC_DATA_FETCH_FAILURE:
      return {
        ...state,
        errMsg: action.errMsg,
        isFetchingQcData: false,
      };

    default:
      return state;
  }
}

export default DataStatusReducer;
