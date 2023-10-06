import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import surveyModdalActions from './userSurveyActions';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

function UserSurveyModal({ userID, showUserSurveyModal }) {
  const [userResponse, setUserResponse] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!showUserSurveyModal) {
      const userSurveyModalRef = document.querySelector('body');
      userSurveyModalRef.classList.remove('modal-open');
    }
  }, [showUserSurveyModal]);

  // // reset state and close modal if user did not submit survey
  function handleModalClose() {
    setTimeout(() => {
      dispatch(surveyModdalActions.toggleUserSurveyModal(false));
    }, 200);
  }

  // reset state, close modal, and log response in GA4 if user submitted survey
  function handleSurveySubmit() {
    trackEvent(
      'Data Download',
      'user_survey',
      userID || 'anonymous',
      userResponse,
    );
    setTimeout(() => {
      dispatch(surveyModdalActions.toggleUserSurveyModal(false));
    }, 200);
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
      data-backdrop="static"
      data-keyboard="false"
    >
      <div className="modal-dialog modal modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Your Voice Matters</h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleModalClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body py-0">
            <div className="modal-message mt-3 mb-4">
              <div className="form-group user-survey-response">
                <label htmlFor="subject" className="required-field">
                  Please tell us about your experience accessing and downloading
                  data from the MoTrPAC Data Hub.
                </label>
                <select
                  className="form-control mt-3 w-100"
                  id="userSurveyResponse"
                  value={userResponse}
                  autoComplete="off"
                  onChange={(e) => setUserResponse(e.target.value)}
                >
                  <option value="">--- Select a rating ---</option>
                  <option value="Very easy">Very easy</option>
                  <option value="Somewhat easy">Somewhat easy</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Somewhat difficult">Somewhat difficult</option>
                  <option value="Very difficult">Very difficult</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
              onClick={handleSurveySubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

UserSurveyModal.propTypes = {
  userID: PropTypes.string,
  showUserSurveyModal: PropTypes.bool,
};

UserSurveyModal.defaultProps = {
  userID: '',
  showUserSurveyModal: false,
};

const mapStateToProps = (state) => ({
  showUserSurveyModal: state.userSurvey.showUserSurveyModal,
});

export default connect(mapStateToProps)(UserSurveyModal);
