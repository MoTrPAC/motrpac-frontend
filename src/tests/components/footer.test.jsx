import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import { Footer } from '../../components/footer';

Enzyme.configure({ adapter: new Adapter() });
const testUser = require('../../testData/testUser');

const defaultMountFooter = mount(<Footer />);
const loggedInMountFooter = mount(<Footer user={testUser} loggedIn />);

describe('Footer', () => {
  test('Has submitter login button by default', () => {
    expect(defaultMountFooter.props().loggedIn).toBeFalsy();
    expect(defaultMountFooter.find('.logInOutBtn').text()).toBe('Submitter Login');
  });

  test('Has [username] logout button if logged in', () => {
    expect(loggedInMountFooter.props().loggedIn).toBeTruthy();
    expect(loggedInMountFooter.find('.logInOutBtn').text()).toBe(`${testUser.name} Logout`);
  });
});
