import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import DownloadDataTable from './downloadDataTable';
import DownloadFilter from './downloadFilter';
import DownloadPaginator from './downloadPaginator';
import actions from '../reducers/downloadActions';

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
  getUpdatedList,
}) {
  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className="container downloadPage">
      <button className="btn btn-primary" type="button" onClick={getUpdatedList}>GetUpdatedList</button>
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
  onCartClick: file => dispatch(actions.addToCart(file)),
  onChangeSort: column => dispatch(actions.sortChange(column)),
  onChangeFilter: (category, filter) => dispatch(actions.changeFilter(category, filter)),
  onChangePage: page => dispatch(actions.changePage(page)),
  onViewCart: () => dispatch(actions.viewCart()),
  onEmptyCart: () => dispatch(actions.emptyCart()),
  onAddAllToCart: () => dispatch(actions.addAllToCart()),
  getUpdatedList: params => dispatch(actions.getUpdatedList(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
