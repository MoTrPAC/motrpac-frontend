import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from '../../reducers/index';
import { defaultDownloadState } from '../../reducers/downloadReducer';
import DownloadPageConnected, { DownloadPage } from '../../components/downloadPage';

Enzyme.configure({ adapter: new Adapter() });


const testPreviousUploads = require('../../testData/testPreviousUploads');

const loggedInRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    loggedIn: true,
  },
};
const withUploadsRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    loggedIn: true,
  },
  download: {
    ...defaultDownloadState,
    allUploads: testPreviousUploads,
  },
};
const downloadActions = {
  onCartClick: jest.fn(),
  onChangeSort: jest.fn(),
  onChangeFilter: jest.fn(),
  onChangePage: jest.fn(),
  onViewCart: jest.fn(),
  onEmptyCart: jest.fn(),
  onAddAllToCart: jest.fn(),
};


describe('Pure Download Page', () => {
  test('Redirects to home if not logged in', () => {
    const shallowDownload = shallow(
      <DownloadPage
        {...defaultDownloadState}
        {...downloadActions}
        allUploads={testPreviousUploads}
      />,
    );
    expect(shallowDownload.find('Redirect'))
      .toHaveLength(1);
  });
  test('Has required components', () => {
    const shallowDownload = shallow(
      <DownloadPage
        {...defaultDownloadState}
        {...downloadActions}
        allUploads={testPreviousUploads}
        loggedIn
      />,
    );
    expect(shallowDownload.find('DownloadDataTable'))
      .toHaveLength(1);
    expect(shallowDownload.find('DownloadFilter'))
      .toHaveLength(1);
  });
});

describe('Connected Download Page', () => {
  let mountedDownload = mount((
    <Provider store={createStore(rootReducer, withUploadsRootState)}>
      <DownloadPageConnected />
    </Provider>
  ));
  beforeAll(() => {
    mountedDownload = mount((
      <Provider store={createStore(rootReducer, withUploadsRootState)}>
        <DownloadPageConnected />
      </Provider>
    ));
  });
  afterAll(() => {
    mountedDownload.unmount();
  });

  test('Has Required Components', () => {
    expect(mountedDownload.find('DownloadFilter'))
      .toHaveLength(1);
    expect(mountedDownload.find('DownloadDataTable'))
      .toHaveLength(1);
  });
});
