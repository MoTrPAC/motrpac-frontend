import axios from 'axios';
import dayjs from 'dayjs';

export const QC_REPORT_VIEW_CHANGE = 'DATA_STATUS_VIEW_CHANGE';
export const QC_DATA_FETCH_REQUEST = 'QC_DATA_FETCH_REQUEST';
export const QC_DATA_FETCH_SUCCESS = 'QC_DATA_FETCH_SUCCESS';
export const QC_DATA_FETCH_FAILURE = 'QC_DATA_FETCH_FAILURE';

function qcReportViewChange(value) {
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

const api = process.env.REACT_APP_API_SERVICE_ADDRESS_DEV;
const endpoint = process.env.REACT_APP_QC_DATA_ENDPOINT;
const key = process.env.REACT_APP_API_SERVICE_KEY_DEV;

// Handler for predefined searches
function fetchData() {
  return (dispatch) => {
    dispatch(dataFetchRequest());
    return axios
      .all([
        axios
          .get(`${api}${endpoint}/metabolomics?type=results&key=${key}`)
          .catch(useNull),
        axios
          .get(`${api}${endpoint}/metabolomics?type=raw&key=${key}`)
          .catch(useNull),
        axios
          .get(`${api}${endpoint}/proteomics?type=results&key=${key}`)
          .catch(useNull),
        axios
          .get(`${api}${endpoint}/proteomics?type=raw&key=${key}`)
          .catch(useNull),
        axios.get(`${api}${endpoint}/immunoassay?key=${key}`).catch(useNull),
        axios.get(`${api}${endpoint}/rna_seq?key=${key}`).catch(useNull),
        axios.get(`${api}${endpoint}/rrbs?key=${key}`).catch(useNull),
        axios.get(`${api}${endpoint}/atac_seq?key=${key}`).catch(useNull),
      ])
      .then(
        axios.spread(
          (
            metabolomics,
            metabolomicsRaw,
            proteomics,
            proteomicsRaw,
            immunoAssay,
            rnaSeq,
            rrbs,
            atacSeq
          ) => {
            const payload = {
              metabolomics: metabolomics.data,
              metabolomicsRaw: metabolomicsRaw.data,
              proteomics: proteomics.data,
              proteomicsRaw: proteomicsRaw.data,
              immunoAssay: immunoAssay.data,
              rnaSeq: rnaSeq.data,
              rrbs: rrbs.data,
              atacSeq: atacSeq.data,
              lastModified: dayjs().format(),
            };
            dispatch(dataFetchSuccess(payload));
          }
        )
      )
      .catch((err) => {
        dispatch(dataFetchFailure(`${err.error}: ${err.errorDescription}`));
      });
  };
}

const DataStatusActions = {
  qcReportViewChange,
  fetchData,
};

export default DataStatusActions;
