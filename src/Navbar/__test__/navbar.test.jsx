import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route, Router, Routes } from 'react-router-dom';
import QuickSearchBox from '../../Search/quickSearchBox.jsx';
import { Navbar } from '../navbar';
import History from '../../App/history';

import internalUser from '../../testData/testUser';

const navbarActions = {
  login: vi.fn(),
  logout: vi.fn(),
  handleDataFetch: vi.fn(),
  resetBrowseState: vi.fn(),
};

const defaultMountNav = mount(
  <MemoryRouter>
    <Routes>
      <Route path={'/'} element={<Navbar />} />
    </Routes>
  </MemoryRouter>,
);

const internalUserMountNav = mount(
  <MemoryRouter>
    <Routes>
      <Route
        path={'/'}
        element={
          <Navbar profile={internalUser} isAuthenticated {...navbarActions} />
        }
      />
    </Routes>
  </MemoryRouter>,
);

describe('Navbar', () => {
  test('Has no logout button by default', () => {
    expect(
      defaultMountNav.find('Navbar').first().props().isAuthenticated,
    ).toBeFalsy();
    expect(defaultMountNav.find('.logOutBtn')).not.toHaveLength(1);
  });

  test('Has Downloads nav link by default', () => {
    expect(defaultMountNav.find('.nav-link').first().text()).toMatch(
      'Downloads',
    );
  });

  test('Displays [username, sitename] and logout button if logged in', () => {
    expect(
      internalUserMountNav.find('Navbar').first().props().isAuthenticated,
    ).toBeTruthy();
    expect(internalUserMountNav.find('.user-display-name').text()).toEqual(
      `${internalUser.user_metadata.name}`,
    );
    expect(internalUserMountNav.find('.logOutBtn').text()).toMatch('Log out');
  });
});
