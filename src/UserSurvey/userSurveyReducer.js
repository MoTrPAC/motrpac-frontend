import { surveyModdalActionTypes } from './userSurveyActions';

export const defaultUserSurveyState = {
  showUserSurveyModal: false,
  surveySubmitted: false,
  waitingForResponse: false,
  downloadedData: false,
  surveyId: '',
  status: '',
  error: '',
};

function userSurveyReducer(state = defaultUserSurveyState, action) {
  switch (action.type) {
    case surveyModdalActionTypes.SHOW_USER_SURVEY_MODAL:
      return {
        ...state,
        showUserSurveyModal: action.value,
      };
    case surveyModdalActionTypes.USER_SURVEY_ID:
      return {
        ...state,
        surveyId: action.value,
      };
    case surveyModdalActionTypes.USER_SURVEY_SUBMIT:
      return {
        ...state,
        surveySubmitted: action.value,
      };
    case surveyModdalActionTypes.USER_SURVEY_SUBMIT_IN_PROGRESS:
      return {
        ...state,
        waitingForResponse: true,
      };
    case surveyModdalActionTypes.USER_SURVEY_SUBMIT_SUCCESS:
      return {
        ...state,
        surveySubmitted: true,
        status: action.status,
        waitingForResponse: false,
        error: '',
      };
    case surveyModdalActionTypes.USER_SURVEY_SUBMIT_FAILURE:
      return {
        ...state,
        error: action.error,
        waitingForResponse: false,
      };
    case surveyModdalActionTypes.USER_DOWNLOADED_DATA:
      return {
        ...state,
        downloadedData: true,
      };
    default:
      return state;
  }
}

export default userSurveyReducer;
