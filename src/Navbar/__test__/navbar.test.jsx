import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router-dom';
import { Navbar } from '../navbar';
import History from '../../App/history';

const internalUser = require('../../testData/testUser');

const externalUser = {
  ...internalUser,
  user_metadata: {
    name: 'Test User',
    givenName: 'TestUser',
    siteName: 'Stanford',
    hasAccess: true,
    userType: 'external',
  },
};

const navbarActions = {
  login: jest.fn(),
  logout: jest.fn(),
  handleQuickSearchInputChange: jest.fn(),
  handleQuickSearchRequestSubmit: jest.fn(),
  resetQuickSearch: jest.fn(),
  getSearchForm: jest.fn(),
  resetAdvSearch: jest.fn(),
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

const externalUserMountNav = mount(
  <Router history={History}>
    <Navbar profile={externalUser} isAuthenticated {...navbarActions} />
  </Router>
);

describe('Navbar', () => {
  test('Has no submitter logout button by default', () => {
    expect(
      defaultMountNav.find('Navbar').first().props().isAuthenticated
    ).toBeFalsy();
    expect(defaultMountNav.find('.logOutBtn')).not.toHaveLength(1);
  });

  test('Displays [username, sitename] and logout button if logged in', () => {
    expect(
      internalUserMountNav.find('Navbar').first().props().isAuthenticated
    ).toBeTruthy();
    expect(internalUserMountNav.find('.user-display-name').text()).toEqual(
      `${internalUser.user_metadata.name}, ${internalUser.user_metadata.siteName}`
    );
    expect(internalUserMountNav.find('.logOutBtn').text()).toMatch('Log out');
  });
  // Quick search is temporarily disabled and so updating this assertion
  test('No quick search box is shown if logged in as internal user', () => {
    expect(
      internalUserMountNav.find('Navbar').first().props().isAuthenticated
    ).toBeTruthy();
    expect(
      internalUserMountNav.find('.quick-search-box-container')
    ).toHaveLength(0);
  });

  test('No quick search box is shown if logged in as external user', () => {
    expect(
      externalUserMountNav.find('Navbar').first().props().isAuthenticated
    ).toBeTruthy();
    expect(
      externalUserMountNav.find('.quick-search-box-container')
    ).toHaveLength(0);
  });
});
