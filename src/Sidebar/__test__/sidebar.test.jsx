import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import { Sidebar } from '../sidebar';

Enzyme.configure({ adapter: new Adapter() });

const shallowDefaultSidebar = shallow(<Sidebar />);
const shallowLoggedInSidebar = shallow(<Sidebar isAuthenticated />);

const loggedInItems = ['Dashboard', 'Analysis', 'Methods', 'Data'];
const navItems = ['Dashboard', 'Analysis', 'Methods', 'Data'];

describe('Sidebar', () => {
  test('Login status undefined, does not show logged in nav items', () => {
    shallowDefaultSidebar.find('.navLink').forEach((navLink) => {
      expect(loggedInItems.indexOf(navLink.text())).toEqual(-1);
    });
  });

  test('Logged In navbar has expected elements', () => {
    shallowLoggedInSidebar.find('.navLink').forEach((navLink) => {
      expect(navItems.indexOf(navLink.text())).not.toBe(-1);
    });
  });
});
