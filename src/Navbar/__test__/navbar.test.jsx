import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router-dom';
import { Navbar } from '../navbar';
import History from '../../App/history';


const testUser = require('../../testData/testUser');

const navbarActions = {
  logout: jest.fn(),
};

const defaultMountNav = mount(
  <Router history={History}>
    <Navbar />
  </Router>,
);
const loggedInMountNav = mount(
  <Router history={History}>
    <Navbar profile={testUser} isAuthenticated {...navbarActions} />
  </Router>,
);

describe('Navbar', () => {
  test('Has no submitter logout button by default', () => {
    expect(defaultMountNav.find('Navbar').first().props().isAuthenticated).toBeFalsy();
    expect(defaultMountNav.find('.logOutBtn')).not.toHaveLength(1);
  });

  test('Displays [username, sitename] and logout button if logged in', () => {
    expect(loggedInMountNav.find('Navbar').first().props().isAuthenticated).toBeTruthy();
    expect(loggedInMountNav.find('.user-display-name').text()).toEqual(`${testUser.user_metadata.name}, ${testUser.user_metadata.siteName}`);
    expect(loggedInMountNav.find('.logOutBtn').text()).toMatch('Log out');
  });
});
