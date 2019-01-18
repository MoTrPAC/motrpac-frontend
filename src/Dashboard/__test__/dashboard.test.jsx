import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import { Dashboard } from '../dashboard';

Enzyme.configure({ adapter: new Adapter() });
const testPreviousUploads = require('../../testData/testPreviousUploads');
const testUser = require('../../testData/testUser');

describe('Shallow Dashboard', () => {
  const shallowDash = shallow(
    <Dashboard isAuthenticated profile={testUser} previousUploads={testPreviousUploads} />,
  );

  test('Has expected widgets', () => {
    expect(shallowDash.find('Connect(PreviousUploadsTable)')).toHaveLength(1);
    expect(shallowDash.find('PreviousUploadsGraph')).toHaveLength(1);
    expect(shallowDash.find('AllUploadsDoughnut')).toHaveLength(1);
    expect(shallowDash.find('AllUploadStats')).toHaveLength(1);
  });

  test('dashboard displays correct text on Dashboard', () => {
    expect(shallowDash.find('h3.divHeader').first().text()).toEqual(`${testUser.user_metadata.name}, ${testUser.user_metadata.siteName}`);
  });
});
