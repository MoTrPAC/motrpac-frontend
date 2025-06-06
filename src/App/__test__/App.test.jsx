import React from 'react';
import { shallow, mount } from 'enzyme';
import { createBrowserHistory } from 'history';
import App from '../App';

const testUser = require('../../testData/testUser.json');

// Mocking Google Analytics
jest.mock('ga-gtag');

// Mocking scrollTo
window.scrollTo = jest.fn();

describe('<App />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<App />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });

  test('It should contain fifteen <Route /> children', () => {
    expect(component.find('Route').length).toBe(27);
  });

  test('It should contain four <PrivateRoute /> children', () => {
    expect(component.find('PrivateRoute').length).toBe(7);
  });
});

// No other routes render components, and only one component rendered
function testCorrectComponentInPath(app, routeTag, componentName, path, history, auth = false) {
  let noPath = true;
  // Checks the right component loaded at path and other components are not
  app.find(routeTag).forEach((route) => {
    expect(history.location.pathname).toEqual(path);
    if (route.props().path === path) {
      expect(route.children()).toHaveLength(1);
      expect(route.find(componentName)).toHaveLength(1);
      noPath = false;
      // If this is true, route for given component does not exist in App.jsx
      expect(noPath).toBeFalsy();
    } else {
      expect(route.children()).toHaveLength(0);
      expect(noPath).toBeTruthy();
    }
  });
}

describe('Unauthenticated Application routing', () => {
  const history = createBrowserHistory();
  const mountApp = mount(<App history={history} />);

  test('loads the landing page component at index', () => {
    history.push('/');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'LandingPage', '/', history);
  });

  test('loads the landing page at /search', () => {
    history.push('/search');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'SearchPage', '/search', history);
  });

  test('loads the browse data page at /data-download', () => {
    history.push('/data-download');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'BrowseDataPage', '/data-download', history);
  });

  test('loads the browse data page at /code-repositories', () => {
    history.push('/code-repositories');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'CodeRepositories', '/code-repositories', history);
  });

  test('loads the browse data page at /project-overview', () => {
    history.push('/project-overview');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'ProjectOverview', '/project-overview', history);
  });

  test('loads the linkout page at /external-links', () => {
    history.push('/external-links');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'LinkoutPage', '/external-links', history);
  });

  test('loads the team page at /team', () => {
    history.push('/team');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'TeamPage', '/team', history);
  });

  test('loads the contact page at /contact', () => {
    history.push('/contact');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'Contact', '/contact', history);
  });

  test('loads the error page at /error', () => {
    history.push('/error');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'ErrorPage', '/error', history);
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

  test('loads the search page at /search', () => {
    history.push('/search');
    // Update required to re-render the application
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'SearchPage', '/search', history, true);
  });

  test('loads the QC reports at /qc-reports', () => {
    history.push('/qc-reports');
    // Update required to re-render the application
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'PrivateRoute', 'DataStatusPage', '/qc-data-monitor', history, true);
  });

  test('loads the methods page at /methods', () => {
    history.push('/methods');
    // Update required to re-render the application
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'PrivateRoute', 'Methods', '/methods', history, true);
  });

  test('loads the sample summary page at /summary', () => {
    history.push('/summary');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'PrivateRoute', 'DataSummaryPage', '/summary', history, true);
  });

  test('loads the linkout page at /external-links', () => {
    history.push('/external-links');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'LinkoutPage', '/external-links', history, true);
  });

  test('loads the team page at /team', () => {
    history.push('/team');
    mountApp.update();
    testCorrectComponentInPath(mountApp, 'Route', 'TeamPage', '/team', history, true);
  });
});
