import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import { Navbar } from '../navbar';

Enzyme.configure({ adapter: new Adapter() });

const testUser = require('../../testData/testUser');

const navbarActions = {
  logout: jest.fn(),
};

const defaultMountNav = mount(<Navbar />);
const loggedInMountNav = mount(
  <Navbar profile={testUser} isAuthenticated {...navbarActions} />,
);

describe('Navbar', () => {
  test('Has no submitter logout button by default', () => {
    expect(defaultMountNav.props().isAuthenticated).toBeFalsy();
    expect(defaultMountNav.find('.logOutBtn')).not.toHaveLength(1);
  });

  test('Has [username] logout button if logged in', () => {
    expect(loggedInMountNav.props().isAuthenticated).toBeTruthy();
    expect(loggedInMountNav.find('.logOutBtn').text()).toMatch('Log out');
  });
});