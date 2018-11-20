import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AnalysisHomePage } from '../components/analysisHomePage';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';

const footerActions = {
  onLogIn: action('logging in'),
  onLogOut: action('logging out'),
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
  .add('Animal', () => <AnalysisHomePage match={animalMatch} />)
  .add('Human', () => <AnalysisHomePage match={humanMatch} />);
