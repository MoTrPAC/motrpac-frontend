import React from 'react';
import { storiesOf } from '@storybook/react';
import LandingPage from '../components/landingPage';
import Navbar from '../components/navbar';
import { Footer } from '../components/footer';

storiesOf('Landing Page', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar />
      </header>
      <div className="componentHolder">
        {story()}
      </div>
      <Footer />
    </div>

  ))
  .add('default', () => <LandingPage />);
