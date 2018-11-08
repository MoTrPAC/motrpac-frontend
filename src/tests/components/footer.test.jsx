import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow } from 'enzyme';
import Footer from '../../components/footer';

Enzyme.configure({ adapter: new Adapter() });
const testUser = require('../../testData/testUser');

const defaultShallowFooter = shallow(<Footer />);
const loggedInShallowFooter = shallow(<Footer user={testUser} loggedIn />);

describe('Footer', () => {
  test('Has submitter login button by default', () => {
    expect(defaultShallowFooter.find('.logInOutBtn').text()).toBe('Submitter Login');
  });

  test('Has [username] logout button if logged in', () => {
    expect(loggedInShallowFooter.find('.logInOutBtn').text()).toBe(`${testUser.name} Logout`);
  });
});
