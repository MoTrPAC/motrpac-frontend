import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { createBrowserHistory } from 'history';
import App from '../App';

const testUser = require('../../testData/testUser');

// Mocking ReactGA for Google Analytics
jest.mock('react-ga');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

// No other routes render components, and only one component rendered
function testCorrectComponentInPath(app, componentName, path, history, auth = false) {
  let noPath = true;
  // Checks the right component loaded at path and other components are not
  app.find('Route').forEach((route) => {
    expect(history.location.pathname).toEqual(path);
    if (route.props().path === path) {
      expect(route.children()).toHaveLength(1);
      expect(route.find(componentName)).toHaveLength(1);
      noPath = false;
    } else {
      expect(route.children()).toHaveLength(0);
    }
  });

  // Checks that sidebar exists if logged-in
  if (auth) {
    expect(app.find('Sidebar').first().find('nav')).toHaveLength(1);
  } else {
    expect(app.find('Sidebar').first().find('nav')).toHaveLength(0);
  }

  // If this is true, route for given component does not exist in App.jsx
  expect(noPath).toBeFalsy();
}

describe('Unauthenticated Application routing', () => {
  const history = createBrowserHistory();
  const mountApp = mount(<App history={history} />);

  test('loads the landing page component at index', () => {
    history.push('/');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'LandingPage', '/', history);
  });

  test('loads the landing page at /dashboard', () => {
    history.push('/dashboard');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'LandingPage', '/', history);
  });

  test('loads the landing page at /upload', () => {
    history.push('/upload');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'LandingPage', '/', history);
  });

  test('loads the landing page at /download', () => {
    history.push('/download');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'LandingPage', '/', history);
  });

  test('loads the linkout page at /external-links', () => {
    history.push('/external-links');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'LinkoutPage', '/external-links', history);
  });

  test('loads the team page at /team', () => {
    history.push('/team');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'TeamPage', '/team', history);
  });

  test('loads the contact page at /contact', () => {
    history.push('/contact');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Contact', '/contact', history);
  });

  test('loads the error page at /error', () => {
    history.push('/error');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'ErrorPage', '/error', history);
  });
});

describe('Authenticated Application routing', () => {
  let history = createBrowserHistory();
  let mountApp = mount(<App history={history} />);
  const loginSuccessAction = {
    type: 'LOGIN_SUCCESS',
    payload: testUser,
  };
  const profileReceiveAction = {
    type: 'PROFILE_RECEIVE',
    profile: testUser,
  };

  beforeAll(() => {
    history = createBrowserHistory();
    mountApp = mount(<App history={history} />);
    // Dispatch successful login
    mountApp.find('Provider').props().store.dispatch(loginSuccessAction);
    // FIXME: Need to chain multiple dispatchers or use async calls
    mountApp.find('Provider').props().store.dispatch(profileReceiveAction);
  });

  afterAll(() => {
    mountApp.unmount();
  });

  test('State should change to logged in on loginSuccess dispatch', () => {
    expect(mountApp.find('Provider').props().store.getState().auth.isAuthenticated).toBeTruthy();
  });

  test('loads the dashboard at /dashboard', () => {
    history.push('/dashboard');
    // Update required to re-render the application
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Dashboard', '/dashboard', history, true);
  });

  test('loads the download page at /download', () => {
    history.push('/download');
    // Update required to re-render the application
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'DownloadPage', '/download', history, true);
  });

  test('loads the upload page at /upload', () => {
    history.push('/upload');
    // Update required to re-render the application
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'UploadScreen', '/upload', history, true);
  });

  test('loads the linkout page at /external-links', () => {
    history.push('/external-links');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'LinkoutPage', '/external-links', history, true);
  });

  test('loads the team page at /team', () => {
    history.push('/team');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'TeamPage', '/team', history, true);
  });
});
