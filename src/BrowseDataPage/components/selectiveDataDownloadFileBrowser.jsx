import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BrowseDataTable from '../browseDataTable';
import BrowseDataFilter from '../browseDataFilter';
import BootstrapSpinner from '../../lib/ui/spinner';

function SelectiveDataDownloadFileBrowser({
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
  return (
    <div className="selective-data-download-content-container row">
      <BrowseDataFilter
        activeFilters={activeFilters}
        onChangeFilter={onChangeFilter}
        onResetFilters={onResetFilters}
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
              No matches found for the selected filters. Please refer to the
              {' '}
              <Link to="/summary">Summary Table</Link>
              {' '}
              for data that are available.
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
  );
}

SelectiveDataDownloadFileBrowser.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  activeFilters: BrowseDataFilter.propTypes.activeFilters.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

SelectiveDataDownloadFileBrowser.defaultProps = {
  profile: {},
};

export default SelectiveDataDownloadFileBrowser;
