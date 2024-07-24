import React from 'react';
import { action } from '@storybook/addon-actions';
import { ErrorPage } from '../error';
import { Navbar } from '../../Navbar/navbar';
import Footer from '../../Footer/footer';

import testUser from '../../testData/testUser';

const loginAction = {
  login: action('logging in'),
};

export default {
  title: 'Error Page',

  decorators: [
    (story) => (
      <>
        <div className="App">
          <header>
            <Navbar {...loginAction} />
          </header>
          <div className="row justify-content-center mt-5">{story()}</div>
        </div>
        <Footer {...loginAction} />
      </>
    ),
  ],
};

export const Default = () => <ErrorPage />;
