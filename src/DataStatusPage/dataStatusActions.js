import axios from 'axios';
import dayjs from 'dayjs';
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
function fetchData() {
  return (dispatch) => {
    dispatch(dataFetchRequest());
    return axios.all([
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc_report_metabolomics.json`),
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc_report_rnaseq.json`),
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc_report_rrbs.json`),
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc_report_atacseq.json`),
    ]).then(axios.spread((metabolomics, rnaseq, rrbs, atacseq) => {
      const payload = {
        metabolomics: metabolomics.data,
        rnaseq: rnaseq.data,
        rrbs: rrbs.data,
        atacseq: atacseq.data,
        lastModified: dayjs().format(),
      };
      dispatch(dataFetchSuccess(payload));
    })).catch((err) => {
      dispatch(dataFetchFailure(`${err.error}: ${err.errorDescription}`));
    });
  };
}

const DataStatusActions = {
  dataStatusViewChange,
  fetchData,
};

export default DataStatusActions;
