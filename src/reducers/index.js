import { combineReducers } from 'redux';
import uploadReducer from './uploadReducer';
import AuthReducer from './authReducer';

const testUser = require('../testData/testUser');

// TODO: Screen change reducer
export default combineReducers({
  upload: uploadReducer,
  auth: AuthReducer,
});

export const defaultRootState = {
  upload: {
    dragging: 0,
    files: [],
    formValues: {},
    uploadFiles: [],
  },
  auth: {
    user: testUser,
  },
};
