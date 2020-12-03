import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AnalysisHomePage } from '../analysisHomePage';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';
import { Sidebar } from '../../Sidebar/sidebar';
import { defaultAnalysisState } from '../analysisReducer';

const testUser = require('../../testData/testUser');

const navbarAction = {
  logout: action('logging out'),
};

const footerAction = {
  login: action('logging in'),
};

const sidebarActions = {
  clearForm: action('clearing form'),
  resetDepth: action('resetting depth'),
};

const AnalysisActions = {
  goBack: action('Back'),
  onPickAnalysis: action('Pick Analysis'),
  onPickSubAnalysis: action('Pick SubAnalysis'),
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
const depth1StateHuman = {
  ...defaultAnalysisState,
  match: humanMatch,
  depth: 1,
  currentAnalysis: 'META_ANALYSIS',
};
const depth2StateHuman = {
  ...defaultAnalysisState,
  match: humanMatch,
  depth: 2,
  currentAnalysis: 'META_ANALYSIS',
  currentSubAnalysis: 'META_ANALYSIS_PUBLIC_DATA',
};
const depth1StateAnimal = {
  ...defaultAnalysisState,
  match: animalMatch,
  depth: 1,
  currentAnalysis: 'PHENOTYPE',
};
storiesOf('Analysis Page', module)
  .addDecorator((story) => (
    <>
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
      <Footer isAuthenticated profile={testUser} {...footerAction} />
    </>
  ))
  .add('Animal', () => <AnalysisHomePage isAuthenticated {...defaultAnalysisState} match={animalMatch} {...AnalysisActions} />)
  .add('Animal Depth 1', () => <AnalysisHomePage isAuthenticated {...depth1StateAnimal} {...AnalysisActions} />)
  .add('Human', () => <AnalysisHomePage isAuthenticated {...defaultAnalysisState} match={humanMatch} {...AnalysisActions} />)
  .add('Human Depth 1', () => <AnalysisHomePage isAuthenticated {...depth1StateHuman} {...AnalysisActions} />)
  .add('Human Depth 2', () => <AnalysisHomePage isAuthenticated {...depth2StateHuman} {...AnalysisActions} />);
