import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';
import configureStore from '../../App/configureStore';
import ErrorPage from '../error';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';

const store = configureStore();

const testUser = require('../../testData/testUser');

const loginAction = {
  login: action('logging in'),
};

storiesOf('Error Page', module)
  .addDecorator(story => (
    <Provider store={store}>
      <div className="App">
        <header>
          <Navbar {...loginAction} profile={testUser} />
        </header>
        <div className="row justify-content-center">
          {story()}
        </div>
      </div>
      <Footer profile={testUser} {...loginAction} />
    </Provider>
  ))
  .add('Default', () => <ErrorPage />);
