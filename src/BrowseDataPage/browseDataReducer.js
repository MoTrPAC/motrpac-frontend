import { types } from './browseDataActions';

export const defaultBrowseDataState = {
  sortBy: 'tissue_name',
  allFiles: [],
  filteredFiles: [],
  fileCount: 0,
  activeFilters: {
    study: [],
    assay: [],
    omics: [],
    tissue_name: [],
    category: [],
  },
  listUpdating: false,
  requireUpdate: false,
  selectedFileUrls: [],
  selectedFileNames: [],
  downloadRequestResponse: '',
  waitingForResponse: false,
  fetching: false,
  error: '',
  pass1b06DataSelected: false,
  pass1a06DataSelected: false,
  humanPrecovidSedAduDataSelected: false,
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

      // Select a filter in either tissue or assay should
      // return a subset of matching files
      // FIXME: need to optimize the workaround to return
      // merged metabolomics (not assay-specific) files
      if (
        action.category === 'assay' &&
        action.filter.match(/Targeted|Untargeted/)
      ) {
        // return all metabolomics files, including merged
        // (not specific to any one assay) files
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
      } else if (
        action.category === 'category' &&
        action.filter === 'Phenotype'
      ) {
        // FIXME: need to move phenotype to its own page
        // (phenotype not specific to any tissue, assay, or ome)
        newActiveFilters.assay = [];
        newActiveFilters.tissue_name = [];
        newActiveFilters.omics = [];
        Object.keys(state.activeFilters).forEach((cat) => {
          if (newActiveFilters[cat].length) {
            filtered = filtered.filter(
              (file) =>
                newActiveFilters[cat].findIndex((el) =>
                  el.includes(file[cat])
                ) !== -1
            );
          }
        });
      } else if (action.category.match(/assay|omics|tissue_name/)) {
        // FIXME: deselect phenotype filter if tissue, assay, or ome is selected
        if (newActiveFilters.category.indexOf('Phenotype') !== -1) {
          newActiveFilters.category.splice(
            newActiveFilters.category.indexOf('Phenotype'),
            1
          );
        }
        Object.keys(state.activeFilters).forEach((cat) => {
          if (newActiveFilters[cat].length) {
            filtered = filtered.filter(
              (file) =>
                newActiveFilters[cat].findIndex((el) =>
                  el.includes(file[cat])
                ) !== -1
            );
          }
        });
      } else {
        // return matching files, excluding metabolomics
        // merged files
        Object.keys(state.activeFilters).forEach((cat) => {
          if (newActiveFilters[cat].length) {
            filtered = filtered.filter(
              (file) =>
                newActiveFilters[cat].findIndex((el) =>
                  el.includes(file[cat])
                ) !== -1
            );
          }
        });
      }

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
          study: [],
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
    // Fetch data objects on page load
    case types.DATA_FETCH_REQUESTED:
      return {
        ...state,
        allFiles: [],
        filteredFiles: [],
        fileCount: 0,
        selectedFileUrls: [],
        selectedFileNames: [],
        fetching: true,
        error: '',
      };
    case types.DATA_FETCH_FAILURE:
      return {
        ...state,
        error: action.error,
        fetching: false,
      };
    case types.DATA_FETCH_SUCCESS: {
      const { results } = action;
      return {
        ...state,
        allFiles: results,
        filteredFiles: results.slice(0, results.length),
        fileCount: results.length,
        fetching: false,
        error: '',
      };
    }
    // Request file downloads
    case types.DOWNLOAD_REQUEST_SUBMITTED:
      return {
        ...state,
        waitingForResponse: true,
      };
    case types.DOWNLOAD_REQUEST_FAILURE:
      return {
        ...state,
        error: action.error,
        waitingForResponse: false,
      };
    case types.DOWNLOAD_REQUEST_SUCCESS: {
      const { results } = action;
      return {
        ...state,
        downloadRequestResponse: results.message,
        waitingForResponse: false,
        error: '',
      };
    }
    case types.SELECT_PASS1B_06_DATA:
      return {
        ...state,
        pass1b06DataSelected: true,
        pass1a06DataSelected: false,
        humanPrecovidSedAduDataSelected: false,
      };
    case types.SELECT_PASS1A_06_DATA:
      return {
        ...state,
        pass1b06DataSelected: false,
        pass1a06DataSelected: true,
        humanPrecovidSedAduDataSelected: false,
      };
    case types.SELECT_HUMAN_PRECOVID_SED_ADU_DATA:
      return {
        ...state,
        pass1b06DataSelected: false,
        pass1a06DataSelected: false,
        humanPrecovidSedAduDataSelected: true,
      };
    case types.RESET_BROWSE_STATE:
      return defaultBrowseDataState;
    default:
      return state;
  }
}

export default browseDataReducer;
