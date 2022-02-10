import axios from 'axios';
import dayjs from 'dayjs';
import GOOGLEAPIS_STORAGE_URL from './googleapis_storage_config';

export const QC_REPORT_VIEW_CHANGE = 'DATA_STATUS_VIEW_CHANGE';
export const QC_DATA_FETCH_REQUEST = 'QC_DATA_FETCH_REQUEST';
export const QC_DATA_FETCH_SUCCESS = 'QC_DATA_FETCH_SUCCESS';
export const QC_DATA_FETCH_FAILURE = 'QC_DATA_FETCH_FAILURE';

function dataStatusViewChange(value) {
  return {
    type: QC_REPORT_VIEW_CHANGE,
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

function useNull() {
  return null;
}

// Handler for predefined searches
function fetchData() {
  return (dispatch) => {
    dispatch(dataFetchRequest());
    return axios.all([
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc-reports/metabolomics.json`).catch(useNull),
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc-reports/proteomics.json`).catch(useNull),
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc-reports/immunoassay.json`).catch(useNull),
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc-reports/rna_seq.json`).catch(useNull),
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc-reports/rrbs.json`).catch(useNull),
      axios.get(`${GOOGLEAPIS_STORAGE_URL}/data/qc-reports/atac_seq.json`).catch(useNull),
    ]).then(axios.spread((metabolomics, proteomics, immunoAssay, rnaSeq, rrbs, atacSeq) => {
      const payload = {
        metabolomics: metabolomics.data,
        proteomics: proteomics.data,
        immunoAssay: immunoAssay.data,
        rnaSeq: rnaSeq.data,
        rrbs: rrbs.data,
        atacSeq: atacSeq.data,
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
