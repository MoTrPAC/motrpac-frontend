import React from 'react';
import { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from '../../App/reducers';
import { defaultAnalysisState } from '../analysisReducer';
import AnalysisHomePageConnected, {
  AnalysisHomePage,
} from '../analysisHomePage';
import analysisTypes from '../../lib/analysisTypes';

// Checks if any of the analyses has been set to true
//   Used to determine if other tests depending on these to be active should run
let anyAnalysisActive = false;
analysisTypes.forEach((analysis) => {
  if (analysis.active) {
    anyAnalysisActive = true;
  }
});

const loggedInRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
  },
};

const analysisActions = {
  onPickAnalysis: jest.fn(),
  goBack: jest.fn(),
};

function constructMatchState(subject) {
  return {
    ...defaultAnalysisState,
    isAuthenticated: true,
    match: {
      params: {
        subjectType: subject,
      },
    },
  };
}

describe('Pure Analysis Home Page', () => {
  test('Redirects to home if not logged in', () => {
    const shallowAnalysis = shallow(
      <AnalysisHomePage {...defaultAnalysisState} {...analysisActions} />
    );
    expect(shallowAnalysis.find('Redirect')).toHaveLength(1);
  });
  test('Redirects if no url match (animal or human)', () => {
    const shallowAnalysis = shallow(
      <AnalysisHomePage
        {...defaultAnalysisState}
        {...analysisActions}
        loggedIn
      />
    );
    expect(shallowAnalysis.find('Redirect')).toHaveLength(1);
  });

  const matchingSubjects = [
    'human',
    'animal',
    'HUMAN',
    'ANIMAL',
    'huMan',
    'aNimaL',
    'Human',
    'Animal',
  ];
  test('Does not Redirect if url matches', () => {
    let shallowAnalysis;
    matchingSubjects.forEach((match) => {
      shallowAnalysis = shallow(
        <AnalysisHomePage
          {...constructMatchState(match)}
          {...analysisActions}
        />
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
      expect(shallowAnalysis.find('h3').text()).toEqual(
        expect.stringMatching(expected)
      );
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
      expect(shallowAnalysis.find('h3')).toHaveLength(1);
      expect(shallowAnalysis.find('AnalysisCard')).toHaveLength(6);
    });
  });
});

describe('Connected Animal AnalysisPage', () => {
  let mountedAnalysis = mount((
    <Provider store={createStore(rootReducer, loggedInRootState)}>
      <AnalysisHomePageConnected
        match={{ params: { subjectType: 'animal' } }}
      />
    </Provider>
  ));
  beforeAll(() => {
    mountedAnalysis = mount((
      <Provider store={createStore(rootReducer, loggedInRootState)}>
        <AnalysisHomePageConnected
          match={{ params: { subjectType: 'animal' } }}
        />
      </Provider>
    ));
  });
  afterAll(() => {
    mountedAnalysis.unmount();
  });

  test('Clicking active animal analysis displays targeted analysis, and clicking back button returns to analysis entry page', () => {
    if (anyAnalysisActive) {
      // Initially shows analysisTypeButton
      expect(mountedAnalysis.find('AnalysisCard')).not.toHaveLength(0);

      // Click button --> replace analysisTypeButton with SubAnalysisButton
      mountedAnalysis.find('.activeAnalysis').first().simulate('click');
      expect(mountedAnalysis.find('Provider').props().store.getState().analysis.depth).toEqual(1);
      mountedAnalysis.update();
      expect(mountedAnalysis.find('AnalysisCard')).toHaveLength(0);
      expect(mountedAnalysis.find('AnimalDataAnalysis')).not.toHaveLength(0);

      // Click back button --> replace SubAnalysisButton with AnalysisTypeButton
      mountedAnalysis.find('.backButton').first().simulate('click');
      expect(mountedAnalysis.find('Provider').props().store.getState().analysis.depth).toEqual(0);
      mountedAnalysis.update();
      expect(mountedAnalysis.find('AnimalDataAnalysis')).toHaveLength(0);
      expect(mountedAnalysis.find('AnalysisCard')).not.toHaveLength(0);
    } else {
      expect(mountedAnalysis.find('.activeAnalysis')).toHaveLength(0);
    }
  });
});

describe('Connected Human AnalysisPage', () => {
  let mountedAnalysis = mount((
    <Provider store={createStore(rootReducer, loggedInRootState)}>
      <AnalysisHomePageConnected match={{ params: { subjectType: 'human' } }} />
    </Provider>
  ));
  beforeAll(() => {
    mountedAnalysis = mount((
      <Provider store={createStore(rootReducer, loggedInRootState)}>
        <AnalysisHomePageConnected
          match={{ params: { subjectType: 'human' } }}
        />
      </Provider>
    ));
  });
  afterAll(() => {
    mountedAnalysis.unmount();
  });

  test('There should be no active or clickable human analysis cards', () => {
    // Initially shows 6 inactive analysisTypeButton
    expect(mountedAnalysis.find('AnalysisCard')).toHaveLength(6);
    expect(mountedAnalysis.find('.activeAnalysis')).toHaveLength(0);
    expect(mountedAnalysis.find('SubAnalysisCard')).toHaveLength(0);
    expect(mountedAnalysis.find('Provider').props().store.getState().analysis.depth).toEqual(0);
  });
});
