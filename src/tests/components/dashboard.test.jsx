import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from '../../reducers/index';
import DashboardConnected, { Dashboard } from '../../components/dashboard';

Enzyme.configure({ adapter: new Adapter() });
const testPreviousUploads = require('../../testData/testPreviousUploads');
const data = require('../../testData/testUser');

describe('Shallow Dashboard', () => {
  const shallowDash = shallow(
    <Dashboard isAuthenticated profile={data} previousUploads={testPreviousUploads} />
  );

  test('Has expected widgets', () => {
    expect(shallowDash.find('PreviousUploadsTable')).toHaveLength(1);
    expect(shallowDash.find('PreviousUploadsGraph')).toHaveLength(1);
    expect(shallowDash.find('AllUploadsDoughnut')).toHaveLength(1);
    expect(shallowDash.find('AllUploadStats')).toHaveLength(1);
  });

  test('dashboard displays correct text on Dashboard', () => {
    expect(shallowDash.find('h2.light').text()).toEqual(`Welcome ${data.name} at ${data.user_metadata.siteName}`);
  });
});
