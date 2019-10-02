import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DataAccessPage } from '../dataAccessPage';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';

const navbarActions = {
  login: action('logging in'),
  logout: action('logging out'),
};

const footerActions = {
  login: action('logging in'),
};

storiesOf('Data Access Page', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar {...navbarActions} />
      </header>
      <div className="row justify-content-center">
        {story()}
      </div>
      <Footer {...footerActions} />
    </div>
  ))
  .add('Default', () => <DataAccessPage />);
