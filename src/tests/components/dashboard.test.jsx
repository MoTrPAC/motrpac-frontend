import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from '../../reducers/index';
import DashboardConnected, { Dashboard } from '../../components/dashboard';

Enzyme.configure({ adapter: new Adapter() });
const testPreviousUploads = require('../../testData/testPreviousUploads');
const testUser = require('../../testData/testUser');

describe('Shallow Dashboard', () => {
  test('Has expected widgets', () => {
    const shallowDash = shallow(
      <Dashboard loggedIn user={testUser} previousUploads={testPreviousUploads} />
    );
    expect(shallowDash.find('PreviousUploadsTable')).toHaveLength(1);
    expect(shallowDash.find('PreviousUploadsGraph')).toHaveLength(1);
    expect(shallowDash.find('AllUploadsDoughnut')).toHaveLength(1);
    expect(shallowDash.find('AllUploadStats')).toHaveLength(1);
  });
});
