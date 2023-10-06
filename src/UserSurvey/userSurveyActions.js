const SHOW_USER_SURVEY_MODAL = 'SHOW_USER_SURVEY_MODAL';

export const surveyModdalActionTypes = {
  SHOW_USER_SURVEY_MODAL,
};

function toggleUserSurveyModal(value) {
  return {
    type: SHOW_USER_SURVEY_MODAL,
    value,
  };
}

const surveyModdalActions = {
  toggleUserSurveyModal,
};

export default surveyModdalActions;
