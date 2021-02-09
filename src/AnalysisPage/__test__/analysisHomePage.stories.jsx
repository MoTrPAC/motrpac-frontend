import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import configureStore from '../../App/configureStore';
import { AnalysisHomePage } from '../analysisHomePage';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';
import { Sidebar } from '../../Sidebar/sidebar';
import { defaultAnalysisState } from '../analysisReducer';

const store = configureStore();

const testUser = require('../../testData/testUser');

const navbarAction = {
  logout: action('logging out'),
};

const sidebarActions = {
  clearForm: action('clearing form'),
  resetDepth: action('resetting depth'),
};

const AnalysisActions = {
  goBack: action('Back'),
  onPickAnalysis: action('Pick Analysis'),
};

const animalMatch = {
  params: {
    subjectType: 'animal',
  },
};
const humanMatch = {
  params: {
    subjectType: 'human',
  },
};
const depth1StateAnimal = {
  ...defaultAnalysisState,
  match: animalMatch,
  depth: 1,
  currentAnalysis: 'PHENOTYPE',
};
storiesOf('Analysis Page', module)
  .addDecorator((story) => (
    <Provider store={store}>
      <div className="App">
        <header>
          <Navbar isAuthenticated {...navbarAction} profile={testUser} />
        </header>
        <div className="componentHolder">
          <div className="container-fluid">
            <div className="row">
              <Sidebar isAuthenticated profile={testUser} {...sidebarActions} />
              {story()}
            </div>
          </div>
        </div>
      </div>
      <Footer isAuthenticated profile={testUser} />
    </Provider>
  ))
  .add('Animal', () => <AnalysisHomePage {...defaultAnalysisState} match={animalMatch} {...AnalysisActions} />)
  .add('Animal Depth 1', () => <AnalysisHomePage {...depth1StateAnimal} {...AnalysisActions} />)
  .add('Human', () => <AnalysisHomePage {...defaultAnalysisState} match={humanMatch} {...AnalysisActions} />);
