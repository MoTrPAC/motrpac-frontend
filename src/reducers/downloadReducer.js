export const defaultDownloadState = {
  sortBy: 'identifier',
  allUploads: [],
};


function createSorter(sortBy) {
  function sortTableEntries(a, b) {
    if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    if (a[sortBy] > b[sortBy]) {
      return 1;
    }
    return 0;
  }
  return sortTableEntries;
}

function downloadReducer(state = defaultDownloadState, action) {
  switch (action.type) {
    case 'SORT_CHANGE':
      return {
        ...state,
        sortBy: action.column,
        allUploads: state.allUploads.sort(createSorter(action.column)),
      };
    case 'UPDATE_LIST':
      return {
        ...state,
        allUploads: action.uploads.sort(createSorter(state.sortBy)),
      };

    default:
      return state;
  }
}

export default downloadReducer;
