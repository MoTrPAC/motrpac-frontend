import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import { Footer } from '../../components/footer';

Enzyme.configure({ adapter: new Adapter() });
const data = require('../../testData/testUser');

const footerActions = {
  onLogIn: jest.fn(),
  onLogOut: jest.fn(),
};
const defaultMountFooter = mount(<Footer {...footerActions} />);
const loggedInMountFooter = mount(
  <Footer profile={data} isAuthenticated {...footerActions} />
);

describe('Footer', () => {
  test('Has submitter login button by default', () => {
    expect(defaultMountFooter.props().isAuthenticated).toBeFalsy();
    expect(defaultMountFooter.find('.logInOutBtn').text()).toBe(
      'Submitter Login'
    );
  });

  test('Has [username] logout button if logged in', () => {
    expect(loggedInMountFooter.props().isAuthenticated).toBeTruthy();
    expect(loggedInMountFooter.find('.logInOutBtn').text()).toMatch(
      new RegExp(data.name)
    );
    expect(loggedInMountFooter.find('.logInOutBtn').text()).toMatch('Logout');
  });
});
