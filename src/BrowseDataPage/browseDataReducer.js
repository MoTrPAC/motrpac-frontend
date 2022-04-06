import { types } from './browseDataActions';

export const defaultBrowseDataState = {
  sortBy: 'identifier',
  maxRows: 10,
  currentPage: 1,
  activeFilters: {
    type: [],
    subject: [],
    availability: [],
  },
  listUpdating: false,
  requireUpdate: false,
  siteName: '',
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

function browseDataReducer(state = defaultBrowseDataState, action) {
  switch (action.type) {
    case types.CHANGE_FILTER: {
      const isActiveFilter = state.activeFilters[action.category].indexOf(
        action.filter
      );
      const newActiveFilters = { ...state.activeFilters };

      if (isActiveFilter === -1) {
        // Adds filter if new
        newActiveFilters[action.category] = newActiveFilters[
          action.category
        ].concat([action.filter]);
      } else {
        // Removes filter if already exists
        newActiveFilters[action.category] = newActiveFilters[
          action.category
        ].filter((filter) => !(filter === action.filter));
      }
      let filtUploads = state.allUploads;

      // if any filters placed filters appropriately
      Object.keys(state.activeFilters).forEach((cat) => {
        if (newActiveFilters[cat].length) {
          filtUploads = filtUploads.filter(
            (upload) => !(newActiveFilters[cat].indexOf(upload[cat]) === -1)
          );
        }
      });

      return {
        ...state,
        activeFilters: newActiveFilters,
        filteredUploads: filtUploads,
        requireUpdate: true,
      };
    }
    case types.APPLY_FILTERS: {
      let filtUploads = state.allUploads;
      Object.keys(state.activeFilters).forEach((cat) => {
        if (state.activeFilters[cat].length) {
          filtUploads = filtUploads.filter(
            (upload) => !(state.activeFilters[cat].indexOf(upload[cat]) === -1)
          );
        }
      });
      return {
        ...state,
        filteredUploads: filtUploads,
      };
    }
    case types.SORT_CHANGE:
      return {
        ...state,
        sortBy: action.column,
        allUploads: state.allUploads.sort(createSorter(action.column)),
      };
    case types.CHANGE_PAGE:
      return {
        ...state,
        currentPage: action.page,
      };
    case types.REQUEST_UPDATE_LIST:
      return {
        ...state,
        listUpdating: true,
      };
    case types.RECIEVE_UPDATE_LIST:
      return {
        ...state,
        allUploads: action.uploads.sort(createSorter(state.sortBy)),
        listUpdating: false,
        requireUpdate: false,
        uploadCount: action.uploadCount,
      };
    default:
      return state;
  }
}

export default browseDataReducer;
