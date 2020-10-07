import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleWare from 'redux-thunk';
import { Router } from 'react-router-dom';
import rootReducer, { defaultRootState } from '../../App/reducers';
import { defaultDashboardState } from '../dashboardReducer';
import { defaultSidebarState } from '../../Sidebar/sidebarReducer';
import DashboardConnected, { Dashboard } from '../dashboard';
import History from '../../App/history';

Enzyme.configure({ adapter: new Adapter() });

const testUser = require('../../testData/testUser');

const controlActions = {
  toggleRelease: jest.fn(),
  togglePhase: jest.fn(),
  togglePlot: jest.fn(),
  toggleSort: jest.fn(),
  toggleQC: jest.fn(),
};

describe('Shallow Dashboard', () => {
  const shallowDash = shallow(
    <Dashboard
      isAuthenticated
      profile={testUser}
      {...defaultDashboardState}
      {...controlActions}
      {...defaultSidebarState}
    />
  );
  const loggedInRootState = {
    ...defaultRootState,
    auth: {
      ...defaultRootState.auth,
      isAuthenticated: true,
      profile: testUser,
    },
  };
  const mountDash = mount((
    <Provider
      store={createStore(
        rootReducer,
        loggedInRootState,
        applyMiddleware(thunkMiddleWare)
      )}
    >
      <Router history={History}>
        <DashboardConnected />
      </Router>
    </Provider>
  ));
  test('Has expected widgets', () => {
    expect(shallowDash.find('ReleasedSampleHighlight')).toHaveLength(1);
    expect(shallowDash.find('ReleasedSamplePlot')).toHaveLength(1);
    expect(shallowDash.find('ReleasedSampleTable')).toHaveLength(1);
    expect(shallowDash.find('ReleasedSampleSummary')).toHaveLength(1);
    expect(shallowDash.find('PlotControls')).toHaveLength(1);
    expect(shallowDash.find('TableControls')).toHaveLength(1);
  });

  test('Has 4 expected release sample filter buttons', () => {
    expect(mountDash.find('.btn-outline-primary')).toHaveLength(4);
    expect(mountDash.find('.btn-outline-primary.active')).toHaveLength(2);
  });
});
