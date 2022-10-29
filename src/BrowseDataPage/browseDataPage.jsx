import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import AuthContentContainer from '../lib/ui/authContentContainer';
import BrowseDataTable from './browseDataTable';
import actions from './browseDataActions';
import BrowseDataFilter from './browseDataFilter';
import AnimatedLoadingIcon from '../lib/ui/loading';

export function BrowseDataPage({
  profile,
  expanded,
  filteredFiles,
  fetching,
  activeFilters,
  onChangeFilter,
  onResetFilters,
  handleDownloadRequest,
  downloadRequestResponse,
  waitingForResponse,
}) {
  const [showMoreSummary, setShowMoreSummary] = useState(false);

  // Send users to default page if they are not consortium members
  const userType = profile.user_metadata && profile.user_metadata.userType;
  if (userType === 'external') {
    return <Redirect to="/home" />;
  }

  // Event handler for "Show prior releases" button
  const toggleShowMoreSummary = (e) => {
    e.preventDefault();
    setShowMoreSummary(!showMoreSummary);
  };

  return (
    <AuthContentContainer classes="browseDataPage" expanded={expanded}>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div className="page-title">
          <h3 className="mb-0">Browse Data</h3>
        </div>
      </div>
      <div className="mt-3 mb-4 browse-data-summary pb-3 border-bottom">
        <span className="emphasis font-weight-bold">
          Browse and download the experimental data of 6-month old rats by
          tissue, assay, or omics. The files accessible and downloadable on this
          page consist of a variety of data types for the animal phase focusing
          on defining molecular changes that occur in rats after up to 8 weeks
          of endurance training (PASS1B):
        </span>
        <ul className="mt-1 mb-2">
          <li>Assay-specific differential analysis and normalized data</li>
          <li>
            Assay-specific quantitative results, experiment metadata, and QA/QC
            reports
          </li>
          <li>
            Cross-platform merged metabolomics data tables for named metabolites
          </li>
          <li>Phenotypic data</li>
        </ul>
        <div className="collapse mb-2" id="collapseSummary">
          <span className="emphasis font-weight-bold">
            The current version of the 6-month old rat data for endurance
            training also include:
          </span>
          <ul className="mt-1 mb-2">
            <li>
              All PASS1B 6-month experimental/sample metadata from the very last
              consortium release
            </li>
            <li>
              Updated PASS1B 6-month phenotypic data since the very last
              consortium release
            </li>
            <li>
              Experimental data of additional tissues and assays not available
              in the very last consortium release
            </li>
          </ul>
          While the raw files are not available for direct download through the
          Data Hub portal, they can be accessed through command-line with
          granted permission. Please contact{' '}
          <a href="mailto:motrpac-data-requests@lists.stanford.edu">
            MoTrPAC Data Requests
          </a>{' '}
          if you need access to the raw files. A{' '}
          <a
            href="https://docs.google.com/document/d/1bdXcYQLZ65GpJKTjf9XwRxhrfHJSD9NIqCxhG6icL8U"
            className="inline-link-with-icon"
            target="_blank"
            rel="noopener noreferrer"
          >
            README
            <i className="material-icons readme-file-icon">description</i>
          </a>{' '}
          document is available for reference on the data included in the very
          last consortium release.
        </div>
        <button
          className="btn btn-link btn-sm show-more-link d-flex align-items-center"
          type="button"
          data-toggle="collapse"
          data-target="#collapseSummary"
          aria-expanded="false"
          aria-controls="collapseSummary"
          onClick={toggleShowMoreSummary}
        >
          <span>Show {!showMoreSummary ? 'more' : 'less'}</span>
          <i className="material-icons">
            {!showMoreSummary ? 'expand_more' : 'expand_less'}
          </i>
        </button>
      </div>
      <div className="browse-data-container row">
        <BrowseDataFilter
          activeFilters={activeFilters}
          onChangeFilter={onChangeFilter}
          onResetFilters={onResetFilters}
        />
        {fetching && <AnimatedLoadingIcon isFetching={fetching} />}
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
    </AuthContentContainer>
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
