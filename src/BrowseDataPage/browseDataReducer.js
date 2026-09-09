import { types } from './browseDataActions';
import facetValues from '../lib/fileFacets';

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
    reference_genome: [],
  },
  listUpdating: false,
  requireUpdate: false,
  selectedFileUrls: [],
  selectedFileNames: [],
  downloadRequestResponse: '',
  waitingForResponse: false,
  fetching: false,
  error: '',
  selectedCollections: [],
  loadedCollections: [],
  loadingFiles: false,
};

// A file matches a facet when one of its own values equals a selected one. The
// predicate this replaced asked whether the *selected* option contained the
// file's whole value as a substring, which no comma-joined row could satisfy -
// all 135 of them were unreachable.
function filterFiles(filters, files) {
  return files.filter((file) =>
    Object.keys(filters).every((category) => {
      if (!filters[category].length) return true;
      const fileValues = facetValues(file, category);
      return filters[category].some(
        (selected) =>
          fileValues.includes(selected)
          // Merged metabolomics files carry the generic omics value, so asking
          // for either specific metabolomics ome still finds them.
          || (category === 'omics'
            && selected.startsWith('Metabolomics')
            && fileValues.includes('Metabolomics'))
      );
    })
  );
}

/**
 * Drop filter values that no longer occur in the loaded files, keeping the rest.
 *
 * Changing the collection selection used to reset every filter, so toggling a
 * collection silently wiped the user's tissue and assay choices. Keeping them
 * wholesale is just as wrong: a value whose only source collection was removed
 * would stay active with its facet button gone, emptying the table for no
 * visible reason.
 */
function pruneFilters(activeFilters, files) {
  const pruned = {};
  Object.keys(activeFilters).forEach((category) => {
    const present = new Set();
    files.forEach((file) => facetValues(file, category).forEach((value) => present.add(value)));
    pruned[category] = activeFilters[category].filter((value) => present.has(value));
  });
  return pruned;
}

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


      // The Category/Metadata facets are gone -- a collection has exactly one
      // category, so the picker already expresses it -- which removed the
      // Phenotype special cases that used to live here.
      filtered = filterFiles(newActiveFilters, filtered);

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
            (file) => !(state.activeFilters[cat].indexOf(file[cat.toLowerCase()]) === -1),
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
          reference_genome: [],
        },
        selectedFileUrls: [],
        selectedFileNames: [],
        filteredFiles: state.allFiles,
        requireUpdate: true,
      };
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
    case types.SELECT_COLLECTIONS_START:
      return {
        ...state,
        loadingFiles: true,
        error: '',
        selectedCollections: action.selection ?? action.prefixes,
      };
    case types.SELECT_COLLECTIONS_SUCCESS: {
      const activeFilters = pruneFilters(state.activeFilters, action.files);
      const filteredFiles = filterFiles(activeFilters, action.files);
      return {
        ...state,
        allFiles: action.files,
        filteredFiles,
        fileCount: action.files.length,
        selectedFileUrls: [],
        selectedFileNames: [],
        selectedCollections: action.selection ?? action.prefixes,
        loadedCollections: action.prefixes,
        loadingFiles: false,
        error: '',
        activeFilters,
      };
    }
    case types.SELECT_COLLECTIONS_FAILURE:
      return {
        ...state,
        allFiles: [],
        filteredFiles: [],
        fileCount: 0,
        loadingFiles: false,
        error: action.error,
      };
    case types.RESET_BROWSE_STATE:
      return defaultBrowseDataState;
    default:
      return state;
  }
}

export default browseDataReducer;
