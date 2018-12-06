import { types } from './downloadActions';

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

function downloadReducer(state = defaultDownloadState, action) {
  switch (action.type) {
    case types.ADD_TO_CART: {
      let newItem = true;
      const newCartItems = state.cartItems.filter((item) => {
        if (item === action.cartItem) {
          newItem = false;
          return false;
        }
        return true;
      });
      // if not downloadable
      if ((action.cartItem.availability === 'Pending Q.C.') && (action.cartItem.site !== state.siteName)) {
        return {
          ...state,
        };
      }
      // if new cart item, add to cart
      if (newItem) {
        return {
          ...state,
          cartItems: [
            ...newCartItems,
            action.cartItem,
          ],
        };
      }
      // removes from cart if already in cart
      return {
        ...state,
        cartItems: newCartItems,
      };
    }

    case types.CHANGE_FILTER: {
      const isActiveFilter = state.activeFilters[action.category].indexOf(action.filter);
      const newActiveFilters = { ...state.activeFilters };

      if (isActiveFilter === -1) {
        // Adds filter if new
        newActiveFilters[action.category] = newActiveFilters[action.category]
          .concat([action.filter]);
      } else {
        // Removes filter if already exists
        newActiveFilters[action.category] = newActiveFilters[action.category]
          .filter(filter => !(filter === action.filter));
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
        requireUpdate: true,
      };
    }
    case types.APPLY_FILTERS: {
      let filtUploads = state.allUploads;
      Object.keys(state.activeFilters).forEach((cat) => {
        if (state.activeFilters[cat].length) {
          filtUploads = filtUploads
            .filter(upload => !(state.activeFilters[cat].indexOf(upload[cat]) === -1));
        }
      });
      return {
        ...state,
        filteredUploads: filtUploads,
      };
    }
    case types.VIEW_CART:
      return {
        ...state,
        viewCart: !state.viewCart,
      };
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
    case types.ADD_ALL_TO_CART: {
      let cartItems = [...state.cartItems];
      // Only uploads available to user added to cart
      const filtUploads = [...state.filteredUploads].filter((upload) => {
        if ((upload.availability === 'Pending Q.C.') && (upload.site !== state.siteName)) {
          return false;
        }
        return true;
      });

      // Filters out items that are not unique
      filtUploads.forEach((upload) => {
        cartItems = cartItems.filter(cartItem => cartItem !== upload);
      });

      return {
        ...state,
        cartItems: [...cartItems, ...filtUploads],
      };
    }
    case types.EMPTY_CART:
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
}

export default downloadReducer;
