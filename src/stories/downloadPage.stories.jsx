
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DownloadPage } from '../components/downloadPage';
import { defaultDownloadState } from '../reducers/downloadReducer';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';

const testPreviousUploads = require('../testData/testPreviousUploads');

const downloadActions = {
  onDownload: action('on Download'),
  onChangeSort: action('on Change Sort'),
};

const loggedInState = {
  ...defaultDownloadState,
  loggedIn: true,
};

const withFilesState = {
  ...defaultDownloadState,
  loggedIn: true,
  allUploads: testPreviousUploads,
};

const footerActions = {
  onLogIn: action('logging in'),
  onLogOut: action('logging out'),
};

storiesOf('Download Page', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar loggedIn />
      </header>
      <div className="componentHolder">
        {story()}
      </div>
      <Footer loggedIn {...footerActions} user={{ name: 'Test User', site: 'CAS' }} />
    </div>

  ))
  .add('default', () => <DownloadPage {...loggedInState} {...downloadActions} />)
  .add('With Data', () => <DownloadPage {...withFilesState} {...downloadActions} />)
