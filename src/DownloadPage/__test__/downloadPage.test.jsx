import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { defaultRootState } from '../../App/reducers';
import { defaultDownloadState } from '../downloadReducer';
import DownloadPageConnected, { DownloadPage } from '../downloadPage';

Enzyme.configure({ adapter: new Adapter() });

const testUser = require('../../testData/testUser');

const testAllUploads = require('../../testData/testAllUploads');

const loggedInRootState = {
  ...defaultRootState,
  auth: {
    ...defaultRootState.auth,
    isAuthenticated: true,
    profile: testUser,
  },
};
const withUploadsRootState = {
  ...loggedInRootState,
  download: {
    ...defaultDownloadState,
    allUploads: testAllUploads,
  },
};
const downloadActions = {
  onCartClick: jest.fn(),
  onChangeSort: jest.fn(),
  onChangeFilter: jest.fn(),
  changePageRequest: jest.fn(),
  onViewCart: jest.fn(),
  onEmptyCart: jest.fn(),
  onAddAllToCart: jest.fn(),
  getUpdatedList: jest.fn(),
};


describe('Pure Download Page', () => {
  test('Redirects to home if not logged in', () => {
    const shallowDownload = shallow(
      <DownloadPage
        {...defaultDownloadState}
        {...downloadActions}
        allUploads={testAllUploads}
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
        allUploads={testAllUploads}
        isAuthenticated
        profile={testUser}
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
    expect(mountedDownload.find('DownloadPaginator'))
      .toHaveLength(1);
  });
});
