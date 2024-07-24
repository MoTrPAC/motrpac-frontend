import { mount, shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import rootReducer, { defaultRootState } from '../../App/reducers';
import { defaultSidebarState } from '../../Sidebar/sidebarReducer';

import testUser from '../../testData/testUser';
import DashboardConnected, { Dashboard } from '../dashboard';
import { defaultDashboardState } from '../dashboardReducer';

const controlActions = {
  toggleRelease: vi.fn(),
  togglePhase: vi.fn(),
  togglePlot: vi.fn(),
  toggleSort: vi.fn(),
  toggleQC: vi.fn(),
};

describe('Shallow Dashboard', () => {
  const shallowDash = shallow(
    <Dashboard
      isAuthenticated
      profile={testUser}
      {...defaultDashboardState}
      {...controlActions}
      {...defaultSidebarState}
    />,
  );
  const loggedInRootState = {
    ...defaultRootState,
    auth: {
      ...defaultRootState.auth,
      isAuthenticated: true,
      profile: testUser,
    },
  };
  const mountDash = mount(
    <Provider
      store={createStore(
        rootReducer,
        loggedInRootState,
        applyMiddleware(thunkMiddleWare),
      )}
    >
      <MemoryRouter>
        <Routes>
          <Route path={'/'} element={<DashboardConnected />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
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
