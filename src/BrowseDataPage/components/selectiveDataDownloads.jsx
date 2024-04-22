import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import PageTitle from '../../lib/ui/pageTitle';
import actions from '../browseDataActions';
import BrowseDataFilter from '../browseDataFilter';
import SelectiveDataDownloadFileBrowserTab from './selectiveDataDownloadFileBrowserTab';
import SelectiveDataDownloadFileBrowser from './selectiveDataDownloadFileBrowser';

function SelectiveDataDownloads({
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
  const dataDownload = useSelector((state) => state.browseData);
  const dispatch = useDispatch();

  // anonymous user or authenticated user
  const userType = profile.user_metadata && profile.user_metadata.userType;

  return (
    <div className="data-download-selective-files">
      <PageTitle title="Data Download" />
      <div className="browse-data-container row">
        {/* nav tabs */}
        <ul
          className="nav nav-tabs w-100"
          id="selectiveDataDownloadTab"
          role="tablist"
        >
          <SelectiveDataDownloadFileBrowserTab
            className={`nav-link ${dataDownload.pass1b06DataSelected ? 'active' : ''}`}
            id="pass1b_06_data_download_tab"
            href="#pass1b_06_data_download"
            ariaControls="pass1b_06_data_download"
            tabTitle="Endurance Training Rats"
            tabSelectHandler={() => dispatch(actions.selectPass1B06Data())}
            onResetFilters={onResetFilters}
          />
          {userType && userType === 'internal' && (
            <SelectiveDataDownloadFileBrowserTab
              className={`nav-link ${dataDownload.pass1a06DataSelected ? 'active' : ''}`}
              id="pass1a_06_data_download_tab"
              href="#pass1a_06_data_download"
              ariaControls="pass1a_06_data_download"
              tabTitle="Acute Exercise Rats"
              tabSelectHandler={() => dispatch(actions.selectPass1A06Data())}
              onResetFilters={onResetFilters}
            />
          )}
          {userType && userType === 'internal' && (
            <SelectiveDataDownloadFileBrowserTab
              className={`nav-link ${dataDownload.humanPrecovidSedAduDataSelected ? 'active' : ''}`}
              id="human_sed_adu_data_download_tab"
              href="#human_sed_adu_data_download"
              ariaControls="human_sed_adu_data_download"
              tabTitle="Human Sedentary Adults"
              tabSelectHandler={() =>
                dispatch(actions.selectHumanPreCovidSedAduData())
              }
              onResetFilters={onResetFilters}
            />
          )}
        </ul>
        {/* tab panes */}
        <div className="tab-content mt-3 mx-3">
          <div
            className={`tab-pane fade ${dataDownload.pass1b06DataSelected ? 'show active' : ''}`}
            id="pass1b_06_data_download"
            role="tabpanel"
            aria-labelledby="pass1b_06_data_download_tab"
          >
            {dataDownload.pass1b06DataSelected && (
              <SelectiveDataDownloadFileBrowser
                profile={profile}
                filteredFiles={filteredFiles.filter(
                  (item) => item.phase === 'PASS1B-06',
                )}
                fetching={fetching}
                activeFilters={activeFilters}
                onChangeFilter={onChangeFilter}
                onResetFilters={onResetFilters}
                handleDownloadRequest={handleDownloadRequest}
                downloadRequestResponse={downloadRequestResponse}
                waitingForResponse={waitingForResponse}
                studySummary="Experimental data from endurance trained (1 week, 2 weeks, 4 weeks or 8 weeks) compared to untrained young adult rats (6 months old)."
              />
            )}
          </div>
          {userType && userType === 'internal' && (
            <div
              className={`tab-pane fade ${dataDownload.pass1a06DataSelected ? 'show active' : ''}`}
              id="pass1a_06_data_download"
              role="tabpanel"
              aria-labelledby="pass1a_06_data_download_tab"
            >
              {dataDownload.pass1a06DataSelected && (
                <SelectiveDataDownloadFileBrowser
                  profile={profile}
                  filteredFiles={filteredFiles.filter(
                    (item) => item.phase === 'PASS1A-06',
                  )}
                  fetching={fetching}
                  activeFilters={activeFilters}
                  onChangeFilter={onChangeFilter}
                  onResetFilters={onResetFilters}
                  handleDownloadRequest={handleDownloadRequest}
                  downloadRequestResponse={downloadRequestResponse}
                  waitingForResponse={waitingForResponse}
                  studySummary="Experimental data from acute exercise study on young adult rats for a comprehensive analysis of the physiological responses following a single exercise session in 6-month-old F344 rats."
                />
              )}
            </div>
          )}
          {userType && userType === 'internal' && (
            <div
              className={`tab-pane fade ${dataDownload.humanPrecovidSedAduDataSelected ? 'show active' : ''}`}
              id="human_sed_adu_data_download"
              role="tabpanel"
              aria-labelledby="human_sed_adu_data_download_tab"
            >
              {dataDownload.humanPrecovidSedAduDataSelected && (
                <SelectiveDataDownloadFileBrowser
                  profile={profile}
                  filteredFiles={filteredFiles.filter(
                    (item) => item.phase === 'HUMAN-PRECOVID-SED-ADU',
                  )}
                  fetching={fetching}
                  activeFilters={activeFilters}
                  onChangeFilter={onChangeFilter}
                  onResetFilters={onResetFilters}
                  handleDownloadRequest={handleDownloadRequest}
                  downloadRequestResponse={downloadRequestResponse}
                  waitingForResponse={waitingForResponse}
                  studySummary="Differential analysis results data for differences in changes during the acute bout, comparing the change from pre-exercise baseline at any given timepoint during the acute bout as compared to resting control."
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

SelectiveDataDownloads.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({})),
  fetching: PropTypes.bool.isRequired,
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
      userid: PropTypes.string,
    }),
  }),
  activeFilters: BrowseDataFilter.propTypes.activeFilters.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

SelectiveDataDownloads.defaultProps = {
  profile: {},
  filteredFiles: [],
};

export default SelectiveDataDownloads;
