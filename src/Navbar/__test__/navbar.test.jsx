import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router-dom';
import { Navbar } from '../navbar';
import History from '../../App/history';

import internalUser from '../../testData/testUser';

const navbarActions = {
  login: jest.fn(),
  logout: jest.fn(),
  handleDataFetch: jest.fn(),
  resetBrowseState: jest.fn(),
};

const defaultMountNav = mount(
  <Router history={History}>
    <Navbar />
  </Router>
);

const internalUserMountNav = mount(
  <Router history={History}>
    <Navbar profile={internalUser} isAuthenticated {...navbarActions} />
  </Router>
);

describe('Navbar', () => {
  test('Has no logout button by default', () => {
    expect(
      defaultMountNav.find('Navbar').first().props().isAuthenticated
    ).toBeFalsy();
    expect(defaultMountNav.find('.logOutBtn')).not.toHaveLength(1);
  });

  test('Has Downloads nav link by default', () => {
    expect(defaultMountNav.find('.nav-link').first().text()).toMatch(
      'Downloads'
    );
  });

  test('Displays [username, sitename] and logout button if logged in', () => {
    expect(
      internalUserMountNav.find('Navbar').first().props().isAuthenticated
    ).toBeTruthy();
    expect(internalUserMountNav.find('.user-display-name').text()).toEqual(
      `${internalUser.user_metadata.name}`
    );
    expect(internalUserMountNav.find('.logOutBtn').text()).toMatch('Log out');
  });
});
