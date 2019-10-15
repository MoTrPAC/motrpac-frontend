import React from 'react';
import { shallow } from 'enzyme';
import { Sidebar } from '../sidebar';

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

const sidebarActions = {
  clearForm: jest.fn(),
  resetDepth: jest.fn(),
};

const internalUserLoggedInSidebar = shallow(<Sidebar profile={internalUser} {...sidebarActions} />);

const externalUserLoggedInSidebar = shallow(<Sidebar profile={externalUser} {...sidebarActions} />);

const defaultNavItems = ['Dashboard', 'Methods', 'Animal', 'Human', 'Browse Data', 'Summary', 'Releases', 'Upload Data'];

const internalUserDisabledNavItems = ['Dashboard', 'Methods', 'Browse Data', 'Upload Data'];

const externalUserDisabledNavItems = ['Dashboard', 'Methods', 'Animal', 'Human', 'Browse Data', 'Summary', 'Upload Data'];

describe('Sidebar', () => {
  test('Logged In sidebar has expected nav links', () => {
    internalUserLoggedInSidebar.find('.navLink').forEach((navLink) => {
      expect(defaultNavItems.indexOf(navLink.text())).not.toBe(-1);
    });
  });

  test('Internal user logged-in sidebar has expected disabled nav links', () => {
    internalUserLoggedInSidebar.find('.disabled-link').forEach((navLink) => {
      expect(internalUserDisabledNavItems.indexOf(navLink.text())).not.toBe(-1);
    });
  });

  test('External user logged-in sidebar has expected disabled nav links', () => {
    externalUserLoggedInSidebar.find('.disabled-link').forEach((navLink) => {
      expect(externalUserDisabledNavItems.indexOf(navLink.text())).not.toBe(-1);
    });
  });
});
