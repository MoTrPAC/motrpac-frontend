import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AnalysisHomePage } from '../analysisHomePage';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';
import { defaultAnalysisState } from '../analysisReducer';

const testUser = require('../../testData/testUser');

const footerActions = {
  login: action('logging in'),
  logout: action('logging out'),
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
const depth1State = {
  ...defaultAnalysisState,
  match: humanMatch,
  depth: 1,
  currentAnalysis: 'PDMA',
};
storiesOf('Analysis Page', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar isAuthenticated />
      </header>
      <div className="componentHolder">
        {story()}
      </div>
      <Footer isAuthenticated {...footerActions} profile={testUser} />
    </div>
  ))
  .add('Animal', () => <AnalysisHomePage isAuthenticated {...defaultAnalysisState} match={animalMatch} {...AnalysisActions} />)
  .add('Human', () => <AnalysisHomePage isAuthenticated {...defaultAnalysisState} match={humanMatch} {...AnalysisActions} />)
  .add('Human Depth 1', () => <AnalysisHomePage isAuthenticated {...depth1State} {...AnalysisActions} />);
