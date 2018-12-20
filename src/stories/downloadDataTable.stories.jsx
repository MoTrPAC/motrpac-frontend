import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DownloadDataTable from '../components/downloadDataTable';

const testPreviousUploads = require('../testData/testPreviousUploads');

const downloadActions = {
  onCartClick: action('on Cart Click'),
  onChangeSort: action('on Change Sort'),
};

storiesOf('Download Data Table', module)
  .addDecorator(story => <div className="container"><div className="row justify-content-center">{story()}</div></div>)
  .add('Default', () => <DownloadDataTable filteredUploads={[]} {...downloadActions} />)
  .add('With Data', () => <DownloadDataTable cartItems={[]} filteredUploads={testPreviousUploads} {...downloadActions} />)
  .add('View Cart', () => <DownloadDataTable viewCart cartItems={testPreviousUploads} filteredUploads={testPreviousUploads} {...downloadActions} />)
  .add('Updating', () => <DownloadDataTable viewCart cartItems={testPreviousUploads} filteredUploads={testPreviousUploads} {...downloadActions} listUpdating />);
