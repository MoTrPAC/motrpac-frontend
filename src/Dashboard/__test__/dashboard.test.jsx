import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleWare from 'redux-thunk';
import { Router } from 'react-router-dom';
import rootReducer, { defaultRootState } from '../../App/reducers';
import { defaultUploadState } from '../../UploadPage/uploadReducer';
import DashboardConnected, { Dashboard } from '../dashboard';
import History from '../../App/history';

Enzyme.configure({ adapter: new Adapter() });
const testPreviousUploads = require('../../testData/testPreviousUploads');
const testUser = require('../../testData/testUser');

const buttonActions = {
  clearForm: jest.fn(),
};

describe('Shallow Dashboard', () => {
  const shallowDash = shallow(
    <Dashboard
      previousUploads={testPreviousUploads}
      {...buttonActions}
    />,
  );
  const loggedInRootState = {
    ...defaultRootState,
    auth: {
      ...defaultRootState.auth,
      isAuthenticated: true,
      profile: testUser,
    },
    upload: {
      ...defaultUploadState,
      previousUploads: testPreviousUploads,
    },
  };
  const mountDash = mount((
    <Provider store={createStore(rootReducer, loggedInRootState, applyMiddleware(thunkMiddleWare))}>
      <Router history={History}>
        <DashboardConnected />
      </Router>
    </Provider>
  ));
  test('Has expected widgets', () => {
    expect(shallowDash.find('Connect(PreviousUploadsTable)')).toHaveLength(1);
    expect(shallowDash.find('PreviousUploadsGraph')).toHaveLength(1);
    expect(shallowDash.find('AllUploadsDoughnut')).toHaveLength(1);
    expect(shallowDash.find('AllUploadStats')).toHaveLength(1);
  });

  test('Edit button appears after expanding an upload on the dashboard', () => {
    expect(mountDash.find('.editUploadBtn')).toHaveLength(0);
    mountDash.find('Caret').first().simulate('click');
    mountDash.update();
    expect(mountDash.find('.editUploadBtn')).toHaveLength(1);
  });
});
