import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import surveyModdalActions from './userSurveyActions';
import BootstrapSpinner from '../lib/ui/spinner';

import '@styles/userSurvey.scss';

function UserSurveyModal({
  userID = '',
  dataContext = '',
  showUserSurveyModal = false,
  surveySubmitted  = false,
  waitingForResponse = false,
  statusMsg = '',
  errorMsg = '',
  handleModalClose,
  handleUserSurveySubmit,
}) {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!showUserSurveyModal) {
      const userSurveyModalRef = document.querySelector('body');
      userSurveyModalRef.classList.remove('modal-open');
    }
  }, [showUserSurveyModal]);

  const emojidisgust = '\u{1F616}';
  const emojiSad = '\u{1F641}';
  const emojiNeutral = '\u{1F610}';
  const emojiSmile = '\u{1F642}';
  const emojiExcited = '\u{1F601}';
  const emojiDisappointed = '\u{1F613}';

  // render custom textarea placeholder message if user selected a response
  function renderTextAreaPlaceholderMessage() {
    if (rating === 'Awful' || rating === 'Poor') {
      return '(Optional) Tell us what went wrong...';
    }
    if (rating === 'Average') {
      return '(Optional) Tell us how we can improve...';
    }
    if (rating === 'Good' || rating === 'Awesome') {
      return '(Optional) Tell us what you liked...';
    }
  }

  // async submit user survey response
  function handleUserSurveySend() {
    const user = userID || 'anonymous';
    handleUserSurveySubmit(user, rating, comment, dataContext);
  }

  function handleUserSurveyModalClose() {
    handleModalClose(false);
  }

  return (
    <div
      className={`modal fade user-survey-modal ${
        showUserSurveyModal ? 'show' : ''
      }`}
      id="userSurveyModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="userSurveyModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body py-0">
            <div className="modal-message mt-3 mb-4">
              <div className="form-group user-survey-response">
                {!surveySubmitted && !waitingForResponse && !errorMsg.length ? (
                  <label className="user-survey-header">
                    How would you rate your experience exploring and downloading
                    data from the MoTrPAC Data Hub?
                  </label>
                ) : null}
                {waitingForResponse && (
                  <BootstrapSpinner isFetching={waitingForResponse} />
                )}
                {surveySubmitted && statusMsg.length ? (
                  <label className="user-survey-header">
                    Thank you for sharing your feedback with us!
                  </label>
                ) : null}
                {!statusMsg.length && errorMsg.length ? (
                  <label className="user-survey-header">
                    <span>Something went wrong.</span>{' '}
                    <span className="emoji">{emojiDisappointed}</span>{' '}
                    <span>Please try again later.</span>
                  </label>
                ) : null}
                {!surveySubmitted && !waitingForResponse && !errorMsg.length ? (
                  <div className="custom-controls custom-radios mt-3 d-flex align-items-center justify-content-center">
                    <div className="custom-control custom-radio">
                      <label
                        className="form-check-label"
                        htmlFor="userSurveyResponse1"
                      >
                        <input
                          type="radio"
                          name="userSurveyResponse"
                          id="userSurveyResponse1"
                          value="Awful"
                          checked={rating === 'Awful'}
                          onChange={(e) => setRating(e.target.value)}
                        />
                        <span className="emoji">{emojidisgust}</span>
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <label
                        className="form-check-label"
                        htmlFor="userSurveyResponse2"
                      >
                        <input
                          type="radio"
                          name="userSurveyResponse"
                          id="userSurveyResponse2"
                          value="Poor"
                          checked={rating === 'Poor'}
                          onChange={(e) => setRating(e.target.value)}
                        />
                        <span className="emoji">{emojiSad}</span>
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <label
                        className="form-check-label"
                        htmlFor="userSurveyResponse3"
                      >
                        <input
                          type="radio"
                          name="userSurveyResponse"
                          id="userSurveyResponse3"
                          value="Average"
                          checked={rating === 'Average'}
                          onChange={(e) => setRating(e.target.value)}
                        />
                        <span className="emoji">{emojiNeutral}</span>
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <label
                        className="form-check-label"
                        htmlFor="userSurveyResponse4"
                      >
                        <input
                          type="radio"
                          name="userSurveyResponse"
                          id="userSurveyResponse4"
                          value="Good"
                          checked={rating === 'Good'}
                          onChange={(e) => setRating(e.target.value)}
                        />
                        <span className="emoji">{emojiSmile}</span>
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <label
                        className="form-check-label"
                        htmlFor="userSurveyResponse5"
                      >
                        <input
                          type="radio"
                          name="userSurveyResponse"
                          id="userSurveyResponse5"
                          value="Awesome"
                          checked={rating === 'Awesome'}
                          onChange={(e) => setRating(e.target.value)}
                        />
                        <span className="emoji">{emojiExcited}</span>
                      </label>
                    </div>
                  </div>
                ) : null}
                <div className="detailed-user-survey-link mt-3 mb-2">
                  <span>
                    <a
                      href={import.meta.env.VITE_QUALTRICS_SURVEY_URL}
                      className="text-info"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Provide detailed feedback to help us improve
                    </a>
                  </span>
                </div>
                {rating &&
                rating.length > 0 &&
                !surveySubmitted &&
                !errorMsg.length ? (
                  <textarea
                    className="form-control user-comment mt-4 w-100"
                    rows="3"
                    placeholder={renderTextAreaPlaceholderMessage()}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                ) : null}
              </div>
            </div>
          </div>
          {rating &&
          rating.length > 0 &&
          !surveySubmitted &&
          !errorMsg.length ? (
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
                onClick={handleUserSurveySend}
              >
                Send
              </button>
            </div>
          ) : null}
          {(surveySubmitted && statusMsg.length) || errorMsg.length ? (
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
                onClick={handleUserSurveyModalClose}
              >
                Close
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

UserSurveyModal.propTypes = {
  userID: PropTypes.string,
  dataContext: PropTypes.string,
  showUserSurveyModal: PropTypes.bool,
  surveySubmitted: PropTypes.bool,
  waitingForResponse: PropTypes.bool,
  statusMsg: PropTypes.string,
  errorMsg: PropTypes.string,
  handleModalClose: PropTypes.func.isRequired,
  handleUserSurveySubmit: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  showUserSurveyModal: state.userSurvey.showUserSurveyModal,
  surveySubmitted: state.userSurvey.surveySubmitted,
  waitingForResponse: state.userSurvey.waitingForResponse,
  statusMsg: state.userSurvey.status,
  errorMsg: state.userSurvey.error,
});

const mapDispatchToProps = (dispatch) => ({
  handleModalClose: (value) =>
    dispatch(surveyModdalActions.toggleUserSurveyModal(value)),
  handleUserSurveySubmit: (userID, rating, comment, dataContext) =>
    dispatch(
      surveyModdalActions.handleUserSurveySubmit(
        userID,
        rating,
        comment,
        dataContext,
      ),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSurveyModal);
