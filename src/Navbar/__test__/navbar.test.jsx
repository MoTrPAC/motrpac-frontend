import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import { Navbar } from '../navbar';

Enzyme.configure({ adapter: new Adapter() });

const shallowDefaultNav = shallow(<Navbar />);
const shallowLoggedInNav = shallow(<Navbar isAuthenticated />);

const loggedInItems = ['Dashboard', 'Analysis', 'Methods'];
const navItems = ['Dashboard', 'Analysis', 'Methods', 'Data', 'About', 'Contact'];

describe('Navbar', () => {
  test('Login status undefined, does not show logged in nav items', () => {
    shallowDefaultNav.find('.navLink').forEach((navLink) => {
      expect(loggedInItems.indexOf(navLink.text())).toEqual(-1);
    });
  });

  test('Logged In navbar has expected elements', () => {
    shallowLoggedInNav.find('.navLink').forEach((navLink) => {
      expect(navItems.indexOf(navLink.text())).not.toBe(-1);
    });
  });
});
