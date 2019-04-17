
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DownloadPage } from '../downloadPage';
import { defaultDownloadState } from '../downloadReducer';
import { Navbar } from '../../Navbar/navbar';
import { Footer } from '../../Footer/footer';
import { Sidebar } from '../../Sidebar/sidebar';

const testUser = require('../../testData/testUser');
const testAllUploads = require('../../testData/testAllUploads');

const downloadActions = {
  onDownload: action('on Download'),
  onChangeSort: action('on Change Sort'),
  onChangeFilter: action('Change Filter'),
  onChangePage: action('Change Page'),
  onCartClick: action('Add/Remove from Cart'),
  onViewCart: action('View Cart'),
  onEmptyCart: action('Empty Cart'),
  onAddAllToCart: action('Add All To Cart'),
};

const loggedInState = {
  ...defaultDownloadState,
  isAuthenticated: true,
};

const withFilesState = {
  ...defaultDownloadState,
  isAuthenticated: true,
  allUploads: testAllUploads,
  filteredUploads: testAllUploads,
};
const viewCartState = {
  ...defaultDownloadState,
  isAuthenticated: true,
  allUploads: testAllUploads,
  filteredUploads: testAllUploads,
  cartItems: testAllUploads,
  viewCart: true,
};

const navbarAction = {
  logout: action('logging out'),
};

const footerAction = {
  login: action('logging in'),
};

storiesOf('Download Page', module)
  .addDecorator(story => (
    <div className="App">
      <header>
        <Navbar isAuthenticated {...navbarAction} profile={testUser} />
      </header>
      <div className="componentHolder">
        <div className="container-fluid">
          <div className="row">
            <Sidebar isAuthenticated profile={testUser} />
            {story()}
          </div>
        </div>
      </div>
      <Footer isAuthenticated profile={testUser} {...footerAction} />
    </div>

  ))
  .add('default', () => <DownloadPage {...loggedInState} {...downloadActions} />)
  .add('With Data', () => <DownloadPage {...withFilesState} {...downloadActions} />)
  .add('View Cart', () => <DownloadPage {...viewCartState} {...downloadActions} />);
