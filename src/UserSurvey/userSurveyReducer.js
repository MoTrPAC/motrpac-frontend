import { surveyModdalActionTypes } from './userSurveyActions';

export const defaultUserSurveyState = {
  showUserSurveyModal: false,
};

function userSurveyReducer(state = defaultUserSurveyState, action) {
  switch (action.type) {
    case surveyModdalActionTypes.SHOW_USER_SURVEY_MODAL:
      return {
        ...state,
        showUserSurveyModal: action.value,
      };
    default:
      return state;
  }
}

export default userSurveyReducer;
