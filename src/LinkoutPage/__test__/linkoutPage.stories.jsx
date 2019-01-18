import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { LinkoutPage } from '../linkoutPage';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';

const footerActions = {
  login: action('logging in'),
  logout: action('logging out'),
};

storiesOf('Linkout Page', module)
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
  .add('Default', () => <LinkoutPage />);
