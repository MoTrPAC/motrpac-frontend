import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import surveyModdalActions from '../../UserSurvey/userSurveyActions';
import BootstrapSpinner from '../../lib/ui/spinner';

function AuthAccessFileDownloadModal({
  downloadRequestResponse,
  waitingForResponse,
}) {
  const dispatch = useDispatch();
  // get states from redux store
  const surveySubmitted = useSelector(
    (state) => state.userSurvey.surveySubmitted,
  );
  const downloadedData = useSelector(
    (state) => state.userSurvey.downloadedData,
  );

  // close modal and show survey modal if user submitted download request
  function handleModalCloseAfterRequest() {
    // show survey modal if user has not submitted survey
    if (downloadedData && !surveySubmitted) {
      setTimeout(() => {
        dispatch(surveyModdalActions.toggleUserSurveyModal(true));
      }, 1000);
    }
  }

  return (
    <div
      className="modal fade data-download-modal"
      id="dataDownloadModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="dataDownloadModalLabel"
      aria-hidden="true"
      data-backdrop="static"
      data-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">File Download Request</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleModalCloseAfterRequest}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {downloadRequestResponse.length > 0 && !waitingForResponse ? (
              <div className="modal-message my-3">
                <span className="file-download-request-response">
                  Your download request has been submitted. Processing time may
                  vary depending on the total file size. We will notify you by
                  email when the download is ready.
                </span>
              </div>
            ) : (
              <BootstrapSpinner isFetching={waitingForResponse} />
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary px-3"
              data-dismiss="modal"
              onClick={handleModalCloseAfterRequest}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthAccessFileDownloadModal.propTypes = {
  waitingForResponse: PropTypes.bool.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
};

export default AuthAccessFileDownloadModal;
