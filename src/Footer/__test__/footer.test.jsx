import React from 'react';
import { mount } from 'enzyme';
import { Footer } from '../footer';

const testUser = require('../../testData/testUser');

const footerActions = {
  login: jest.fn(),
  logout: jest.fn(),
};
const defaultMountFooter = mount(<Footer {...footerActions} />);
const loggedInMountFooter = mount(
  <Footer profile={testUser} isAuthenticated {...footerActions} />,
);

describe('Footer', () => {
  test('Has submitter login button by default', () => {
    expect(defaultMountFooter.props().isAuthenticated).toBeFalsy();
    expect(defaultMountFooter.find('.logInBtn').text()).toBe(
      'Login',
    );
  });

  test('Has no login or logout buttons if logged in', () => {
    expect(loggedInMountFooter.props().isAuthenticated).toBeTruthy();
    expect(loggedInMountFooter.find('.logInBtn')).not.toHaveLength(1);
    expect(loggedInMountFooter.find('.logOutBtn')).not.toHaveLength(1);
  });
});
