import { types } from './browseDataActions';

export const defaultBrowseDataState = {
  sortBy: 'tissue_name',
  allFiles: [],
  filteredFiles: [],
  fileCount: 0,
  activeFilters: {
    assay: [],
    omics: [],
    tissue_name: [],
    category: [],
  },
  listUpdating: false,
  requireUpdate: false,
  selectedFileUrls: [],
  selectedFileNames: [],
  fetching: false,
  error: '',
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
      let filtered = state.allFiles;

      // if any filters placed filters appropriately
      Object.keys(state.activeFilters).forEach((cat) => {
        if (newActiveFilters[cat].length) {
          filtered = filtered.filter(
            (file) =>
              newActiveFilters[cat].findIndex((el) =>
                el.includes(file[cat])
              ) !== -1 || file[cat] === 'Merged'
          );
        }
      });

      return {
        ...state,
        activeFilters: newActiveFilters,
        filteredFiles: filtered,
        requireUpdate: true,
      };
    }
    case types.APPLY_FILTERS: {
      let filtered = state.allUFiles;
      Object.keys(state.activeFilters).forEach((cat) => {
        if (state.activeFilters[cat].length) {
          filtered = filtered.filter(
            (file) => !(state.activeFilters[cat].indexOf(file[cat.toLowerCase()]) === -1)
          );
        }
      });
      return {
        ...state,
        filteredFiles: filtered,
      };
    }
    case types.SORT_CHANGE:
      return {
        ...state,
        sortBy: action.column,
        allFiles: state.allFiles.sort(createSorter(action.column)),
      };
    case types.REQUEST_UPDATE_LIST:
      return {
        ...state,
        listUpdating: true,
      };
    case types.RECIEVE_UPDATE_LIST:
      return {
        ...state,
        allFiles: action.files.sort(createSorter(state.sortBy)),
        listUpdating: false,
        requireUpdate: false,
        fileCount: action.fileCount,
      };
    case types.URL_FETCH_START:
      return {
        ...state,
        fetching: true,
      };
    case types.URL_FETCH_SUCCESS:
      return {
        ...state,
        selectedFileUrls: action.results.map((item) => item.data.url),
        selectedFileNames: action.selectedFiles.map((item) => {
          return {
            file: item.original.filename,
            size: item.original.object_size,
            object: item.original.object,
          };
        }),
        fetching: false,
      };
    case types.URL_FETCH_FAILURE:
      return {
        ...state,
        error: action.error,
        fetching: false,
      };
    case types.RESET_FILTERS:
      return {
        ...state,
        activeFilters: {
          assay: [],
          omics: [],
          tissue_name: [],
          category: [],
        },
        selectedFileUrls: [],
        selectedFileNames: [],
        filteredFiles: state.allFiles,
        requireUpdate: true,
      };
    case types.LOAD_DATA_OBJECTS: {
      const { files } = action;
      return {
        ...state,
        allFiles: files,
        filteredFiles: files.slice(0, files.length),
        fileCount: files.length,
      };
    }
    default:
      return state;
  }
}

export default browseDataReducer;
