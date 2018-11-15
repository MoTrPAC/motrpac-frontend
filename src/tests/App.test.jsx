import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createBrowserHistory } from 'history';
import App from '../App';

Enzyme.configure({ adapter: new Adapter() });
const testUser = require('../testData/testUser');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Unauthenticated Application routing', () => {
  const history = createBrowserHistory();
  const mountApp = mount(<App history={history} />);
  test('loads the landing page component at index', () => {
    history.push('/');
    mountApp.update();
    expect(history.location.pathname).toEqual('/');
    expect(mountApp.find('LandingPage')).toHaveLength(1);
    expect(mountApp.find('Dashboard')).toHaveLength(0);
    expect(mountApp.find('UploadScreen')).toHaveLength(0);
  });
  test('loads the landing page at /dashboard', () => {
    history.push('/dashboard');
    mountApp.update();
    expect(history.location.pathname).toEqual('/');
    expect(mountApp.find('LandingPage')).toHaveLength(1);
    expect(mountApp.find('Dashboard')).toHaveLength(0);
    expect(mountApp.find('UploadScreen')).toHaveLength(0);
  });

  test('loads the landing page at /upload', () => {
    history.push('/dashboard');
    mountApp.update();
    expect(history.location.pathname).toEqual('/');
    expect(mountApp.find('LandingPage')).toHaveLength(1);
    expect(mountApp.find('Dashboard')).toHaveLength(0);
    expect(mountApp.find('UploadScreen')).toHaveLength(0);
  });
});

describe('Authenticated Application routing', () => {
  let history = createBrowserHistory();
  let mountApp = mount(<App history={history} />);
  const loginSuccessAction = {
    type: 'LOGIN_SUCCESS',
    user: testUser,
  };
  beforeAll(() => {
    history = createBrowserHistory();
    mountApp = mount(<App history={history} />);
    // Dispatch successful login
    mountApp.find('Provider').props().store.dispatch(loginSuccessAction);
  });
  afterAll(() => {
    mountApp.unmount();
  });

  test('State should change to logged in on loginSuccess dispatch', () => {
    expect(mountApp.find('Provider').props().store.getState().auth.loggedIn).toBeTruthy();
  });
  test('loads the dashboard at /dashboard', () => {
    history.push('/dashboard');
    // Update required to re-render the application
    mountApp.update();
    expect(history.location.pathname).toEqual('/dashboard');
    expect(mountApp.find('LandingPage')).toHaveLength(0);
    expect(mountApp.find('UploadScreen')).toHaveLength(0);
    expect(mountApp.find('Dashboard')).toHaveLength(1);
  });
  test('dashboard displays correct text on Dashboard', () => {
    expect(history.location.pathname).toEqual('/dashboard');
    expect(mountApp.find('h2.light').text()).toEqual(`Welcome ${testUser.name} at ${testUser.siteName}`);
  });
});
