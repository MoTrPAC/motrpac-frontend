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
  sortBy,
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
      <div className="row titleRow">
        <div className="col">
          <h2>Download Data</h2>
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
        />
      </div>
      <DownloadPaginator
        currentPage={currentPage}
        filteredUploads={filteredUploads}
        maxRows={maxRows}
        onChangePage={onChangePage}
      />
    </div>
  );
}
DownloadPage.propTypes = {
  filteredUploads: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sortBy: PropTypes.string,
  loggedIn: PropTypes.bool,
  activeFilters: DownloadFilter.propTypes.activeFilters.isRequired,
  maxRows: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onCartClick: PropTypes.func.isRequired,
  onChangeSort: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadPage);
