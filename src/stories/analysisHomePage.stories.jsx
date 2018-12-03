import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AnalysisHomePage } from '../components/analysisHomePage';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import { defaultAnalysisState } from '../reducers/analysisReducer';

const footerActions = {
  onLogIn: action('logging in'),
  onLogOut: action('logging out'),
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
        <Navbar />
      </header>
      <div className="componentHolder">
        {story()}
      </div>
      <Footer {...footerActions} />
    </div>
  ))
  .add('Animal', () => <AnalysisHomePage loggedIn {...defaultAnalysisState} match={animalMatch} {...AnalysisActions} />)
  .add('Human', () => <AnalysisHomePage loggedIn {...defaultAnalysisState} match={humanMatch} {...AnalysisActions} />)
  .add('Human Depth 1', () => <AnalysisHomePage loggedIn {...depth1State} {...AnalysisActions} />);
