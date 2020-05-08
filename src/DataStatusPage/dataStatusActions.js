import axios from 'axios';
import GOOGLEAPIS_STORAGE_URL from './googleapis_storage_config';

export const DATA_STATUS_VIEW_CHANGE = 'DATA_STATUS_VIEW_CHANGE';
export const QC_DATA_FETCH_REQUEST = 'QC_DATA_FETCH_REQUEST';
export const QC_DATA_FETCH_SUCCESS = 'QC_DATA_FETCH_SUCCESS';
export const QC_DATA_FETCH_FAILURE = 'QC_DATA_FETCH_FAILURE';

function dataStatusViewChange(value) {
  return {
    type: DATA_STATUS_VIEW_CHANGE,
    value,
  };
}

function dataFetchRequest() {
  return {
    type: QC_DATA_FETCH_REQUEST,
  };
}

function dataFetchSuccess(payload) {
  return {
    type: QC_DATA_FETCH_SUCCESS,
    payload,
  };
}

function dataFetchFailure(errMsg = '') {
  return {
    type: QC_DATA_FETCH_FAILURE,
    errMsg,
  };
}

// Handler for predefined searches
function handleQcDataFetch() {
  return (dispatch) => {
    dispatch(dataFetchRequest());
    return axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc_report_atacseq.json`).then((response) => {
      dispatch(dataFetchSuccess(response));
    }).catch((err) => {
      dispatch(dataFetchFailure(`${err.error}: ${err.errorDescription}`));
    });
  };
}

const DataStatusActions = {
  dataStatusViewChange,
  handleQcDataFetch,
};

export default DataStatusActions;
