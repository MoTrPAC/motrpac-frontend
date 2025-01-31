import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import actions from './browseDataActions';
import BrowseDataFilter from './browseDataFilter';
import dataDownloadStructuredData from '../lib/searchStructuredData/dataDownload';
import UserSurveyModal from '../UserSurvey/userSurveyModal';
import DataDownloadsMain from './components/dataDownloadsMain';

export function BrowseDataPage({
  profile,
  filteredFiles,
  activeFilters,
  onChangeFilter,
  onResetFilters,
  handleDownloadRequest,
  downloadRequestResponse,
  waitingForResponse,
  showUserSurveyModal,
  surveyId,
  surveySubmitted,
  downloadedData,
}) {
  useEffect(() => {
    if (showUserSurveyModal) {
      const userSurveyModalRef = document.querySelector('body');
      userSurveyModalRef.classList.add('modal-open');
    }
  }, [showUserSurveyModal]);

  return (
    <div className="browseDataPage px-3 px-md-4 mb-3">
      <Helmet>
        <html lang="en" />
        <title>Data Download - MoTrPAC Data Hub</title>
        <script type="application/ld+json">
          {JSON.stringify(dataDownloadStructuredData)}
        </script>
      </Helmet>
      <DataDownloadsMain
        profile={profile}
        filteredFiles={filteredFiles}
        activeFilters={activeFilters}
        onChangeFilter={onChangeFilter}
        onResetFilters={onResetFilters}
        handleDownloadRequest={handleDownloadRequest}
        downloadRequestResponse={downloadRequestResponse}
        waitingForResponse={waitingForResponse}
        surveySubmitted={surveySubmitted}
        downloadedData={downloadedData}
      />
      <UserSurveyModal
        userID={profile && profile.email ? profile.email : (surveyId ? surveyId : 'anonymous')}
        dataContext={
          downloadRequestResponse.length ? 'selected_files' : 'bundled_files'
        }
      />
    </div>
  );
}

BrowseDataPage.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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
  showUserSurveyModal: PropTypes.bool,
  surveyId: PropTypes.string,
  surveySubmitted: PropTypes.bool,
  downloadedData: PropTypes.bool,
};

BrowseDataPage.defaultProps = {
  profile: {},
  showUserSurveyModal: false,
  surveyId: '',
  surveySubmitted: false,
  downloadedData: false,
};

const mapStateToProps = (state) => ({
  ...state.browseData,
  profile: state.auth.profile,
  showUserSurveyModal: state.userSurvey.showUserSurveyModal,
  surveyId: state.userSurvey.surveyId,
  surveySubmitted: state.userSurvey.surveySubmitted,
  downloadedData: state.userSurvey.downloadedData,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeFilter: (category, filter) =>
    dispatch(actions.changeFilter(category, filter)),
  onResetFilters: () => dispatch(actions.resetFilters()),
  handleDownloadRequest: (email, name, userid, selectedFiles) =>
    dispatch(actions.handleDownloadRequest(email, name, userid, selectedFiles)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowseDataPage);
