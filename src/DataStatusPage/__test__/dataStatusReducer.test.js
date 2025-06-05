import { describe, test, expect } from 'vitest';
import {
  DataStatusReducer,
  defaultDataStatusState,
} from '../dataStatusReducer';
import {
  QC_REPORT_VIEW_CHANGE,
  QC_DATA_FETCH_REQUEST,
  QC_DATA_FETCH_SUCCESS,
  QC_DATA_FETCH_FAILURE,
} from '../dataStatusActions';

describe('QC Reports Reducer', () => {
  // Shared variables
  const state = { ...defaultDataStatusState };

  // Default state
  test('Returns initial state if no action or state', () => {
    expect(DataStatusReducer(undefined, {})).toEqual({
      ...defaultDataStatusState,
    });
  });

  // No action, no state changes
  test('Returns state given if no action', () => {
    expect(
      DataStatusReducer(
        { ...defaultDataStatusState, qcReportView: 'phase' },
        {}
      )
    ).toEqual({ ...defaultDataStatusState, qcReportView: 'phase' });
  });

  // Button group selection is changed
  test('Updates QC report view after metabolomics button is clicked', () => {
    const qcReportViewChangeAction = {
      type: QC_REPORT_VIEW_CHANGE,
      value: 'metabolomics',
    };
    const dataReportViewState = DataStatusReducer(
      defaultDataStatusState,
      qcReportViewChangeAction
    );
    expect(dataReportViewState.qcReportView).toEqual(
      qcReportViewChangeAction.value
    );
  });

  // QC report data is being fetched
  test('Data fetching request is triggered', () => {
    const newState = {
      ...state,
      isFetchingQcData: true,
    };
    const dataFetchRequestAction = {
      type: QC_DATA_FETCH_REQUEST,
    };
    const dataFetchRequestState = DataStatusReducer(
      newState,
      dataFetchRequestAction
    );
    expect(dataFetchRequestState.isFetchingQcData).toBeTruthy();
  });

  // QC report data fetching fails due to some error
  test('Data fetching unsuccessful', () => {
    const newState = {
      ...state,
      isFetchingQcData: false,
    };
    const dataFetchRequestFailureAction = {
      type: QC_DATA_FETCH_FAILURE,
      errMsg: 'Error 404',
    };
    const dataFetchRequestState = DataStatusReducer(
      newState,
      dataFetchRequestFailureAction
    );
    expect(dataFetchRequestState.isFetchingQcData).toBeFalsy();
    expect(dataFetchRequestState.errMsg).toEqual('Error 404');
  });

  // QC report data fetching successful
  test('Data fetching successfully returns data', () => {
    const newState = {
      ...state,
      isFetchingQcData: false,
    };
    const dataFetchRequestSuccessAction = {
      type: QC_DATA_FETCH_SUCCESS,
      payload: { metabolomics: [{ length: 1 }] },
    };
    const dataFetchRequestState = DataStatusReducer(
      newState,
      dataFetchRequestSuccessAction
    );
    expect(dataFetchRequestState.qcData.metabolomics.length).toBeGreaterThan(0);
    expect(dataFetchRequestState.isFetchingQcData).toBeFalsy();
    expect(dataFetchRequestState.errMsg).toEqual('');
  });
});
