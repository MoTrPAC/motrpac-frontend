import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DownloadDataTable from '../downloadDataTable';

const testAllUploads = require('../../testData/testAllUploads');

const downloadActions = {
  onCartClick: action('on Cart Click'),
  onChangeSort: action('on Change Sort'),
};

storiesOf('Download Data Table', module)
  .addDecorator(story => <div className="container"><div className="row justify-content-center">{story()}</div></div>)
  .add('Default', () => <DownloadDataTable filteredUploads={[]} {...downloadActions} />)
  .add('With Data', () => <DownloadDataTable cartItems={[]} filteredUploads={testAllUploads} {...downloadActions} />)
  .add('View Cart', () => <DownloadDataTable viewCart cartItems={testAllUploads} filteredUploads={testAllUploads} {...downloadActions} />)
  .add('Updating', () => <DownloadDataTable viewCart cartItems={testAllUploads} filteredUploads={testAllUploads} {...downloadActions} listUpdating />);
