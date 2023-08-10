import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import BrowseDataTable from './browseDataTable';
import actions from './browseDataActions';
import BrowseDataFilter from './browseDataFilter';
import BootstrapSpinner from '../lib/ui/spinner';
import OpenAccessBrowseDataSummary from './components/openAccessSummary';
import AuthAccessBrowseDataSummary from './components/authAccessSummary';
import dataDownloadStructuredData from '../lib/searchStructuredData/dataDownload';

export function BrowseDataPage({
  profile,
  filteredFiles,
  fetching,
  activeFilters,
  onChangeFilter,
  onResetFilters,
  handleDownloadRequest,
  downloadRequestResponse,
  waitingForResponse,
}) {
  // anonymous user or authenticated user
  const userType = profile.user_metadata && profile.user_metadata.userType;

  return (
    <div className="browseDataPage px-3 px-md-4 mb-3">
      <Helmet>
        <html lang="en" />
        <title>Data Download - MoTrPAC Data Hub</title>
        <script type="application/ld+json">
          {JSON.stringify(dataDownloadStructuredData)}
        </script>
      </Helmet>
      <PageTitle
        title={
          userType && userType === 'internal'
            ? 'Endurance Training and Acute Exercise Young Adult Rats Data'
            : 'Endurance Exercise Training Young Adult Rats (6 months) Data'
        }
      />
      {!userType || (userType && userType === 'external') ? (
        <OpenAccessBrowseDataSummary profile={profile} />
      ) : null}
      {userType && userType === 'internal' ? (
        <AuthAccessBrowseDataSummary />
      ) : null}
      <div className="browse-data-container row">
        <BrowseDataFilter
          activeFilters={activeFilters}
          onChangeFilter={onChangeFilter}
          onResetFilters={onResetFilters}
          userType={userType}
        />
        {fetching && (
          <div className="col-md-9">
            <BootstrapSpinner isFetching={fetching} />
          </div>
        )}
        {!fetching && !filteredFiles.length && (
          <div className="browse-data-table-wrapper col-md-9">
            <p className="mt-4">
              <span>
                No matches found for the selected filters. Please refer to the{' '}
                <Link to="/summary">Summary Table</Link> for data that are
                available.
              </span>
            </p>
          </div>
        )}
        {!fetching && filteredFiles.length && (
          <BrowseDataTable
            filteredFiles={filteredFiles}
            handleDownloadRequest={handleDownloadRequest}
            downloadRequestResponse={downloadRequestResponse}
            waitingForResponse={waitingForResponse}
            profile={profile}
          />
        )}
      </div>
    </div>
  );
}

BrowseDataPage.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetching: PropTypes.bool.isRequired,
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  activeFilters: BrowseDataFilter.propTypes.activeFilters.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

BrowseDataPage.defaultProps = {
  profile: {},
};

const mapStateToProps = (state) => ({
  ...state.browseData,
  profile: state.auth.profile,
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
