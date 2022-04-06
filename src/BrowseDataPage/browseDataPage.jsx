import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthContentContainer from '../lib/ui/authContentContainer';
import actions from './browseDataActions';
import BrowseDataFilter from './browseDataFilter';

export function BrowseDataPage({
  profile,
  expanded,
  filteredUploads,
  sortBy,
  activeFilters,
  currentPage,
  maxRows,
  listUpdating,
  onChangeSort,
  onChangeFilter,
  changePageRequest,
}) {
  const siteName =
    profile.user_metadata && profile.user_metadata.siteName
      ? profile.user_metadata.siteName
      : null;

  return (
    <AuthContentContainer classes="browseDataPage" expanded={expanded}>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div className="page-title">
          <h3 className="mb-0">Browse Data</h3>
        </div>
      </div>
    </AuthContentContainer>
  );
}

BrowseDataPage.propTypes = {
  sortBy: PropTypes.string,
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }),
  expanded: PropTypes.bool,
  listUpdating: PropTypes.bool.isRequired,
  activeFilters: BrowseDataFilter.propTypes.activeFilters.isRequired,
  maxRows: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChangeSort: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  changePageRequest: PropTypes.func.isRequired,
};

BrowseDataPage.defaultProps = {
  sortBy: 'identifier',
  profile: {},
  expanded: false,
};

const mapStateToProps = (state) => ({
  sortBy: state.browseData.sortBy,
  profile: state.auth.profile,
  filteredUploads: state.browseData.filteredUploads,
  activeFilters: state.browseData.activeFilters,
  currentPage: state.browseData.currentPage,
  maxRows: state.browseData.maxRows,
  listUpdating: state.browseData.listUpdating,
  expanded: state.sidebar.expanded,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeSort: (column) => dispatch(actions.sortChange(column)),
  onChangeFilter: (category, filter) => dispatch(actions.changeFilter(category, filter)),
  changePageRequest: (maxRows, page) => dispatch(actions.changePageRequest(maxRows, page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowseDataPage);
