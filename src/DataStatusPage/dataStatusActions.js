import axios from 'axios';

export const DATA_STATUS_VIEW_CHANGE = 'DATA_STATUS_VIEW_CHANGE';

function dataStatusViewChange(value) {
  return {
    type: DATA_STATUS_VIEW_CHANGE,
    value,
  };
}

const DataStatusActions = {
  dataStatusViewChange,
};

export default DataStatusActions;
