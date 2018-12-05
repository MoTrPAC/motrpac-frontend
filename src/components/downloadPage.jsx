import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import DownloadDataTable from './downloadDataTable';
import DownloadFilter from './downloadFilter';
import DownloadPaginator from './downloadPaginator';

export function DownloadPage({
  loggedIn,
  filteredUploads,
  cartItems,
  uploadCount,
  sortBy,
  viewCart,
  onViewCart,
  onEmptyCart,
  onAddAllToCart,
  activeFilters,
  currentPage,
  maxRows,
  onCartClick,
  onChangeSort,
  onChangeFilter,
  onChangePage,
}) {
  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className="container downloadPage">
      <div className="row titleRow mb-1">
        <div className="col-12 col-md-4">
          <h2>Download Data</h2>
        </div>
        <div className="col">
          <button className={`viewCart m-1 mr-5 btn ${viewCart ? 'active' : ''}`} type="button" onClick={onViewCart}>
            View Cart&nbsp;
            {cartItems.length ? (<span className="badge badge-pill cartCount">{cartItems.length}</span>) : ''}
          </button>
          <button className="emptyCart m-1 btn" type="button" onClick={onEmptyCart}>Empty Cart</button>
          <button className="addAllToCart m-1 btn" type="button" onClick={onAddAllToCart}>Add All To Cart</button>
        </div>
      </div>
      <div className="row justify-content-center">
        <DownloadFilter
          activeFilters={activeFilters}
          onChangeFilter={onChangeFilter}
        />
        <DownloadDataTable
          filteredUploads={filteredUploads}
          cartItems={cartItems}
          sortBy={sortBy}
          onCartClick={onCartClick}
          onChangeSort={onChangeSort}
          maxRows={maxRows}
          currentPage={currentPage}
          viewCart={viewCart}
        />
      </div>
      <DownloadPaginator
        currentPage={currentPage}
        filteredUploads={filteredUploads}
        maxRows={maxRows}
        onChangePage={onChangePage}
        uploadCount={uploadCount}
        viewCart={viewCart}
        cartItems={cartItems}
      />
    </div>
  );
}
DownloadPage.propTypes = {
  filteredUploads: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  cartItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sortBy: PropTypes.string,
  uploadCount: PropTypes.number.isRequired,
  loggedIn: PropTypes.bool,
  viewCart: PropTypes.bool.isRequired,
  activeFilters: DownloadFilter.propTypes.activeFilters.isRequired,
  maxRows: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onCartClick: PropTypes.func.isRequired,
  onChangeSort: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onViewCart: PropTypes.func.isRequired,
  onEmptyCart: PropTypes.func.isRequired,
  onAddAllToCart: PropTypes.func.isRequired,
};
DownloadPage.defaultProps = {
  sortBy: 'identifier',
  loggedIn: false,
};

const mapStateToProps = state => ({
  sortBy: state.download.sortBy,
  filteredUploads: state.download.filteredUploads,
  cartItems: state.download.cartItems,
  loggedIn: state.auth.loggedIn,
  activeFilters: state.download.activeFilters,
  currentPage: state.download.currentPage,
  maxRows: state.download.maxRows,
  uploadCount: state.download.uploadCount,
  viewCart: state.download.viewCart,
});

const mapDispatchToProps = dispatch => ({
  onCartClick: file => dispatch({
    type: 'ADD_TO_CART',
    cartItem: file,
  }),
  onChangeSort: sortCol => dispatch({
    type: 'SORT_CHANGE',
    column: sortCol,
  }),
  onChangeFilter: (cat, filt) => dispatch({
    type: 'CHANGE_FILTER',
    category: cat,
    filter: filt,
  }),
  onChangePage: toPage => dispatch({
    type: 'CHANGE_PAGE',
    page: toPage,
  }),
  onViewCart: () => dispatch({
    type: 'VIEW_CART',
  }),
  onEmptyCart: () => dispatch({
    type: 'EMPTY_CART',
  }),
  onAddAllToCart: () => dispatch({
    type: 'ADD_ALL_TO_CART',
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
