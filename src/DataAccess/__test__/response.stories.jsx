import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RegistrationResponse from '../response';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';

const navbarActions = {
  login: action('logging in'),
  logout: action('logging out'),
};

const footerActions = {
  login: action('logging in'),
};

storiesOf('New User Registration Response', module)
  .addDecorator(story => (
    <React.Fragment>
      <div className="App">
        <header>
          <Navbar {...navbarActions} />
        </header>
        <div className="justify-content-center dataAccessPage">
          <div className="container">
            {story()}
          </div>
        </div>
      </div>
      <Footer {...footerActions} />
    </React.Fragment>
  ))
  .add('Registration success', () => <RegistrationResponse status="success" />)
  .add('Registration error', () => <RegistrationResponse status="error" />);
