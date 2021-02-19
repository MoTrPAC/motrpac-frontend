import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ErrorPage } from '../error';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';

const testUser = require('../../testData/testUser');

const loginAction = {
  login: action('logging in'),
};

storiesOf('Error Page', module)
  .addDecorator(story => (
    <React.Fragment>
      <div className="App">
        <header>
          <Navbar {...loginAction} profile={testUser} />
        </header>
        <div className="row justify-content-center mt-5">
          {story()}
        </div>
      </div>
      <Footer profile={testUser} {...loginAction} />
    </React.Fragment>
  ))
  .add('Default', () => <ErrorPage />);
