import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import DownloadDataTable from './downloadDataTable';
import DownloadFilter from './downloadFilter';
import DownloadPaginator from './downloadPaginator';
import actions from './downloadActions';

export function DownloadPage({
  isAuthenticated,
  profile,
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
  listUpdating,
  onCartClick,
  onChangeSort,
  onChangeFilter,
  changePageRequest,
}) {
  const siteName = profile.user_metadata && profile.user_metadata.siteName ? profile.user_metadata.siteName : null;
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <div className="container downloadPage">
      <div className="row titleRow mb-1">
        <div className="col-12 col-md-4">
          <h2>Download Data</h2>
        </div>
        <div className="col">
          <button className={`viewCart m-1 mr-sm-5 btn ${viewCart ? 'active' : ''}`} type="button" onClick={onViewCart}>
            {viewCart ? 'Return ' : 'View Cart '}
          </button>
          <button className="emptyCart m-1 btn" type="button" onClick={onEmptyCart}>Empty Cart</button>
          <button className="addAllToCart m-1 btn" type="button" onClick={onAddAllToCart}>Add All To Cart</button>
          <button className="downloadCart m-1 btn" type="button" disabled>
            Download Items&nbsp;
            {cartItems.length ? (<span className="badge badge-pill cartCount">{cartItems.length}</span>) : ''}
          </button>
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
          listUpdating={listUpdating}
          siteName={siteName}
        />
      </div>
      <DownloadPaginator
        currentPage={currentPage}
        maxRows={maxRows}
        onChangePage={changePageRequest}
        uploadCount={uploadCount}
        viewCart={viewCart}
      />
    </div>
  );
}
DownloadPage.propTypes = {
  filteredUploads: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  cartItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sortBy: PropTypes.string,
  uploadCount: PropTypes.number.isRequired,
  isAuthenticated: PropTypes.bool,
  profile: PropTypes.object,
  viewCart: PropTypes.bool.isRequired,
  listUpdating: PropTypes.bool.isRequired,
  activeFilters: DownloadFilter.propTypes.activeFilters.isRequired,
  maxRows: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onCartClick: PropTypes.func.isRequired,
  onChangeSort: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onViewCart: PropTypes.func.isRequired,
  onEmptyCart: PropTypes.func.isRequired,
  onAddAllToCart: PropTypes.func.isRequired,
  changePageRequest: PropTypes.func.isRequired,
};
DownloadPage.defaultProps = {
  sortBy: 'identifier',
  isAuthenticated: false,
  profile: {},
};

const mapStateToProps = state => ({
  sortBy: state.download.sortBy,
  profile: state.auth.profile,
  filteredUploads: state.download.filteredUploads,
  cartItems: state.download.cartItems,
  isAuthenticated: state.auth.isAuthenticated,
  activeFilters: state.download.activeFilters,
  currentPage: state.download.currentPage,
  maxRows: state.download.maxRows,
  uploadCount: state.download.uploadCount,
  viewCart: state.download.viewCart,
  listUpdating: state.download.listUpdating,
});

const mapDispatchToProps = dispatch => ({
  onCartClick: file => dispatch(actions.addToCart(file)),
  onChangeSort: column => dispatch(actions.sortChange(column)),
  onChangeFilter: (category, filter) => dispatch(actions.changeFilter(category, filter)),
  onViewCart: () => dispatch(actions.viewCart()),
  onEmptyCart: () => dispatch(actions.emptyCart()),
  onAddAllToCart: () => dispatch(actions.addAllToCart()),
  changePageRequest: (maxRows, page) => dispatch(actions.changePageRequest(maxRows, page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
