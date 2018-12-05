export const defaultDownloadState = {
  sortBy: 'identifier',
  allUploads: [],
  filteredUploads: [],
  maxRows: 10,
  currentPage: 1,
  activeFilters: {
    type: [],
    subject: [],
    availability: [],
  },
  cartItems: [],
  uploadCount: 0,
  viewCart: false,
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
    case 'ADD_TO_CART': {
      let newItem = true;
      const newCartItems = state.cartItems.filter((item) => {
        if (item === action.cartItem) {
          newItem = false;
          return false;
        }
        return true;
      });
      if (newItem) {
        return {
          ...state,
          cartItems: [
            ...newCartItems,
            action.cartItem,
          ],
        };
      }
      return {
        ...state,
        cartItems: newCartItems,
      };
    }

    case 'CHANGE_FILTER': {
      const isActiveFilter = state.activeFilters[action.category].indexOf(action.filter);
      const newActiveFilters = { ...state.activeFilters };
      if (isActiveFilter === -1) {
        newActiveFilters[action.category] = newActiveFilters[action.category]
          .concat([action.filter]);
      } else {
        newActiveFilters[action.category] = newActiveFilters[action.category].filter(filter => !(filter === action.filter));
      }
      let filtUploads = state.allUploads;

      // if any filters placed filters appropriately
      Object.keys(state.activeFilters).forEach((cat) => {
        if (newActiveFilters[cat].length) {
          filtUploads = filtUploads
            .filter(upload => !(newActiveFilters[cat].indexOf(upload[cat]) === -1));
        }
      });

      return {
        ...state,
        activeFilters: newActiveFilters,
        filteredUploads: filtUploads,
        uploadCount: filtUploads.length,
      };
    }
    case 'VIEW_CART':
      return {
        ...state,
        viewCart: !state.viewCart,
      };
    case 'SORT_CHANGE':
      return {
        ...state,
        sortBy: action.column,
        allUploads: state.allUploads.sort(createSorter(action.column)),
      };
    case 'CHANGE_PAGE':
      return {
        ...state,
        currentPage: action.page,
      };
    case 'UPDATE_LIST':
      return {
        ...state,
        allUploads: action.uploads.sort(createSorter(state.sortBy)),
        uploadCount: action.uploads.length,
      };
    case 'ADD_ALL_TO_CART':
      return {
        ...state,
        cartItems: state.filteredUploads,
      };
    case 'EMPTY_CART':
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
}

export default downloadReducer;
