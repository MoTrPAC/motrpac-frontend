import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AuthContentContainer from '../lib/ui/authContentContainer';
import BrowseDataTable from './browseDataTable';
import actions from './browseDataActions';
import BrowseDataFilter from './browseDataFilter';
import AnimatedLoadingIcon from '../lib/ui/loading';

export function BrowseDataPage({
  profile,
  expanded,
  filteredFiles,
  selectedFileUrls,
  selectedFileNames,
  fetching,
  error,
  activeFilters,
  onChangeFilter,
  onResetFilters,
  handleDownloadRequest,
  downloadRequestResponse,
  waitingForResponse,
}) {
  // Send users to default page if they are not consortium members
  const userType = profile.user_metadata && profile.user_metadata.userType;
  if (userType === 'external') {
    return <Redirect to="/home" />;
  }

  return (
    <AuthContentContainer classes="browseDataPage" expanded={expanded}>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div className="page-title">
          <h3 className="mb-0">Browse Data</h3>
        </div>
      </div>
      <div className="my-4">
        Browse and download the PASS1B 6-month processed data by tissue, assay,
        or omics. The available files include molecular and phenotypic data.
        While raw data is not available for download through the data hub
        portal, it can be accessed through command-line. Please contact{' '}
        <a href="mailto:motrpac-data-requests@lists.stanford.edu">
          MoTrPAC Data Requests
        </a>{' '}
        if you need access to the raw data.
      </div>
      <div className="browse-data-container row">
        <BrowseDataFilter
          activeFilters={activeFilters}
          onChangeFilter={onChangeFilter}
          onResetFilters={onResetFilters}
        />
        {!fetching ? (
          <BrowseDataTable
            filteredFiles={filteredFiles}
            selectedFileUrls={selectedFileUrls}
            selectedFileNames={selectedFileNames}
            handleDownloadRequest={handleDownloadRequest}
            downloadRequestResponse={downloadRequestResponse}
            waitingForResponse={waitingForResponse}
            error={error}
            profile={profile}
          />
        ) : (
          <AnimatedLoadingIcon isFetching={fetching} />
        )}
      </div>
    </AuthContentContainer>
  );
}

BrowseDataPage.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedFileUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedFileNames: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  expanded: PropTypes.bool,
  activeFilters: BrowseDataFilter.propTypes.activeFilters.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

BrowseDataPage.defaultProps = {
  profile: {},
  expanded: false,
};

const mapStateToProps = (state) => ({
  ...state.browseData,
  profile: state.auth.profile,
  expanded: state.sidebar.expanded,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeSort: (column) => dispatch(actions.sortChange(column)),
  onChangeFilter: (category, filter) =>
    dispatch(actions.changeFilter(category, filter)),
  onResetFilters: () => dispatch(actions.resetFilters()),
  changePageRequest: (maxRows, page) =>
    dispatch(actions.changePageRequest(maxRows, page)),
  loadDataObjects: (files) => dispatch(actions.loadDataObjects(files)),
  handleDownloadRequest: (email, name, selectedFiles) =>
    dispatch(actions.handleDownloadRequest(email, name, selectedFiles)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowseDataPage);
