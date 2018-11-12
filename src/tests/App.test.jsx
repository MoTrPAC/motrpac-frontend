import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../App';
import history from '../history';

Enzyme.configure({ adapter: new Adapter() });
const testUser = require('../testData/testUser');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Unauthenticated Application routing', () => {
  const mountApp = mount(<App />);
  test('loads the landing page component at index', () => {
    history.push('/');
    expect(mountApp.find('LandingPage')).toHaveLength(1);
    expect(mountApp.find('Dashboard')).toHaveLength(0);
    expect(mountApp.find('UploadScreen')).toHaveLength(0);
  });
  test('loads the landing page at /dashboard', () => {
    history.push('/dashboard');
    expect(mountApp.find('LandingPage')).toHaveLength(1);
    expect(mountApp.find('Dashboard')).toHaveLength(0);
    expect(mountApp.find('UploadScreen')).toHaveLength(0);
  });

  test('loads the landing page at /upload', () => {
    history.push('/dashboard');
    expect(mountApp.find('LandingPage')).toHaveLength(1);
    expect(mountApp.find('Dashboard')).toHaveLength(0);
    expect(mountApp.find('UploadScreen')).toHaveLength(0);
  });
});

describe('Authenticated Application routing', () => {
  const mountApp = mount(<App />);
  const loginSuccessAction = {
    type: 'LOGIN_SUCCESS',
    user: testUser,
  };
  mountApp.find('Provider').props().store.dispatch(loginSuccessAction);

  test('State should change to logged in on dispatch', () => {
    expect(mountApp.find('Provider').props().store.getState().auth.loggedIn).toBeTruthy();
  });
  test('loads the dashboard at /dashboard', () => {
    history.push('/dashboard');
    mountApp.update();
    expect(mountApp.find('LandingPage')).toHaveLength(0);
    expect(mountApp.find('UploadScreen')).toHaveLength(0);
    expect(mountApp.find('Dashboard')).toHaveLength(1);
  });
  test('dashboard displays correct text on Login', () => {
    expect(mountApp.find('.light').text()).toEqual(`Welcome ${testUser.name} at ${testUser.site}`);
  });
});
