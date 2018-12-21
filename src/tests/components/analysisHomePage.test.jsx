import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from '../../reducers/index';
import { defaultAnalysisState } from '../../reducers/analysisReducer';
import AnalysisHomePageConnected, { AnalysisHomePage } from '../../components/analysisHomePage';
import { defaultDownloadState } from '../../reducers/downloadReducer';

Enzyme.configure({ adapter: new Adapter() });


const loggedInRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    loggedIn: true,
  },
};

const analysisActions = {
  onPickAnalysis: jest.fn(),
  onPickSubAnalysis: jest.fn(),
  goBack: jest.fn(),
};
function constructMatchState(subject) {
  return {
    ...defaultAnalysisState,
    loggedIn: true,
    match: {
      params: {
        subjectType: subject,
      },
    },
  };
}

describe('Pure AnalysisHome Page', () => {
  test('Redirects to home if not logged in', () => {
    const shallowAnalysis = shallow(
      <AnalysisHomePage
        {...defaultAnalysisState}
        {...analysisActions}
      />,
    );
    expect(shallowAnalysis.find('Redirect')).toHaveLength(1);
  });
  test('Redirects if no url match (animal or human)', () => {
    const shallowAnalysis = shallow(
      <AnalysisHomePage
        {...defaultAnalysisState}
        {...analysisActions}
        loggedIn
      />,
    );
    expect(shallowAnalysis.find('Redirect')).toHaveLength(1);
  });

  const matchingSubjects = ['human', 'animal', 'HUMAN', 'ANIMAL', 'huMan', 'aNimaL', 'Human', 'Animal'];
  test('Does not Redirect if url matches', () => {
    let shallowAnalysis;
    matchingSubjects.forEach((match) => {
      shallowAnalysis = shallow(
        <AnalysisHomePage
          {...constructMatchState(match)}
          {...analysisActions}
        />,
      );
      expect(shallowAnalysis.find('Redirect')).toHaveLength(0);
    });
  });

  test('Correct header if url matches', () => {
    const expected = 'Human Data Analysis|Animal Data Analysis';
    let shallowAnalysis;
    matchingSubjects.forEach((match) => {
      shallowAnalysis = shallow(
        <AnalysisHomePage
          {...constructMatchState(match)}
          {...analysisActions}
        />,
      );
      expect(shallowAnalysis.find('h2').text()).toEqual(expect.stringMatching(expected));
    });
  });

  test('Correct components if url matches', () => {
    let shallowAnalysis;
    matchingSubjects.forEach((match) => {
      shallowAnalysis = shallow(
        <AnalysisHomePage
          {...constructMatchState(match)}
          {...analysisActions}
        />,
      );
      expect(shallowAnalysis.find('h2')).toHaveLength(1);
      expect(shallowAnalysis.find('AnalysisTypeButton')).toHaveLength(6);
      expect(shallowAnalysis.find('.breadcrumbs')).toHaveLength(1);
    });
  });
});

describe('Connected AnalysisPage', () => {
  let mountedAnalysis = mount((
    <Provider store={createStore(rootReducer, loggedInRootState)}>
      <AnalysisHomePageConnected match={{ params: { subjectType: 'human' } }} />
    </Provider>
  ));
  beforeAll(() => {
    mountedAnalysis = mount((
      <Provider store={createStore(rootReducer, loggedInRootState)}>
        <AnalysisHomePageConnected match={{ params: { subjectType: 'human' } }} />
      </Provider>
    ));
  });
  afterAll(() => {
    mountedAnalysis.unmount();
  });

  test('Clicking active analysis displays subanalyses, clicking back returns to initial', () => {
    // Initially shows analysisTypeButton
    expect(mountedAnalysis.find('AnalysisTypeButton')).not.toHaveLength(0);

    // Click button --> replace analysisTypeButton with SubAnalysisButton
    mountedAnalysis.find('.analysisTypeActive').first().simulate('click');
    expect(mountedAnalysis.find('Provider').props().store.getState().analysis.depth).toEqual(1);
    mountedAnalysis.update();
    expect(mountedAnalysis.find('SubAnalysisButton')).not.toHaveLength(0);
    expect(mountedAnalysis.find('AnalysisTypeButton')).toHaveLength(0);

    // Click back button --> replace SubAnalysisButton with AnalysisTypeButton
    mountedAnalysis.find('.backButton').first().simulate('click');
    expect(mountedAnalysis.find('Provider').props().store.getState().analysis.depth).toEqual(0);
    mountedAnalysis.update();
    expect(mountedAnalysis.find('SubAnalysisButton')).toHaveLength(0);
    expect(mountedAnalysis.find('AnalysisTypeButton')).not.toHaveLength(0);
  });
});
