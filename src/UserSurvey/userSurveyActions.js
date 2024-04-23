import axios from 'axios';
import dayjs from 'dayjs';

const SHOW_USER_SURVEY_MODAL = 'SHOW_USER_SURVEY_MODAL';
const USER_SURVEY_ID = 'USER_SURVEY_ID';
const USER_SURVEY_SUBMIT = 'USER_SURVEY_SUBMIT';
const USER_SURVEY_SUBMIT_IN_PROGRESS = 'USER_SURVEY_SUBMIT_IN_PROGRESS';
const USER_SURVEY_SUBMIT_SUCCESS = 'USER_SURVEY_SUBMIT_SUCCESS';
const USER_SURVEY_SUBMIT_FAILURE = 'USER_SURVEY_SUBMIT_FAILURE';
const USER_DOWNLOADED_DATA = 'USER_DOWNLOADED_DATA';

export const surveyModdalActionTypes = {
  SHOW_USER_SURVEY_MODAL,
  USER_SURVEY_ID,
  USER_SURVEY_SUBMIT,
  USER_SURVEY_SUBMIT_IN_PROGRESS,
  USER_SURVEY_SUBMIT_SUCCESS,
  USER_SURVEY_SUBMIT_FAILURE,
  USER_DOWNLOADED_DATA,
};

function toggleUserSurveyModal(value) {
  return {
    type: SHOW_USER_SURVEY_MODAL,
    value,
  };
}

function setUserSurveyId(value) {
  return {
    type: USER_SURVEY_ID,
    value,
  };
}

function submitUserSurvey(value) {
  return {
    type: USER_SURVEY_SUBMIT,
    value,
  };
}

function userSurveySubmitInProgress() {
  return {
    type: USER_SURVEY_SUBMIT_IN_PROGRESS,
  };
}

function userSurveySubmitSuccess(status) {
  return {
    type: USER_SURVEY_SUBMIT_SUCCESS,
    status,
  };
}

function userSurveySubmitFailure(error = '') {
  return {
    type: USER_SURVEY_SUBMIT_FAILURE,
    error,
  };
}

function userDownloadedData() {
  return {
    type: USER_DOWNLOADED_DATA,
  };
}

// Handle user survey submission
function handleUserSurveySubmit(user, rating, comment, dataContext) {
  if (!user || !rating) {
    return false;
  }

  const formdata = new FormData();
  formdata.append(
    import.meta.env.VITE_USER_SURVEY_INPUT_1,
    dayjs().format('YYYY-MM-DD'),
  );
  formdata.append(import.meta.env.VITE_USER_SURVEY_INPUT_2, user);
  formdata.append(import.meta.env.VITE_USER_SURVEY_INPUT_3, dataContext);
  formdata.append(import.meta.env.VITE_USER_SURVEY_INPUT_4, rating);
  formdata.append(import.meta.env.VITE_USER_SURVEY_INPUT_5, comment);

  return (dispatch) => {
    dispatch(userSurveySubmitInProgress());
    return axios
      .post(import.meta.env.VITE_USER_SURVEY_SUBMIT_URL, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*',
        },
      })
      .then((response) => {
        if (response.data.error) {
          dispatch(userSurveySubmitFailure(response.data.error));
        }
        dispatch(userSurveySubmitSuccess(response.status));
      })
      .catch((err) => {
        if (err.code === 'ERR_NETWORK' && !err.status) {
          dispatch(userSurveySubmitSuccess('Success'));
        }
        dispatch(userSurveySubmitFailure(`${err.name}: ${err.message}`));
      });
  };
}

const surveyModdalActions = {
  toggleUserSurveyModal,
  setUserSurveyId,
  submitUserSurvey,
  handleUserSurveySubmit,
  userDownloadedData,
};

export default surveyModdalActions;
